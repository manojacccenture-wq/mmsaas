using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using System.Data.Entity;
using AnnasKitchen.WebApi.Models;
using AnnasKitchen.WebApi.Providers;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.OAuth;
using Newtonsoft.Json;

namespace AnnasKitchen.WebApi.Controllers
{
    [RoutePrefix("api/sso")]
    public class SsoController : ApiController
    {
        // ── OWIN managers (lazy-resolved per request) ────────────────────
        private ApplicationUserManager _userManager;
        private ApplicationRoleManager _roleManager;

        private ApplicationUserManager UserManager =>
            _userManager ?? (_userManager = Request.GetOwinContext().GetUserManager<ApplicationUserManager>());

        private ApplicationRoleManager RoleManager =>
            _roleManager ?? (_roleManager = Request.GetOwinContext().GetUserManager<ApplicationRoleManager>());

        // ── POST api/sso/exchange ────────────────────────────────────────
        /// <summary>
        /// Exchanges a MSAAS one-time launch token for a FoodERP OWIN bearer token.
        /// Called by the FoodERP Frontend SsoLaunch page after redirect from MSAAS.
        /// </summary>
        [HttpPost]
        [Route("exchange")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> Exchange(SsoExchangeModel model)
        {
            // ── 1. Validate input ────────────────────────────────────────
            if (model == null || string.IsNullOrWhiteSpace(model.Code))
            {
                return ErrorResponse(HttpStatusCode.BadRequest, "Launch code is required.");
            }

            // ── 2. Validate launch token with MSAAS Backend ──────────────
            var msaasPayload = await ValidateLaunchTokenWithMsaas(model.Code.Trim());
            if (msaasPayload == null)
            {
                return ErrorResponse(HttpStatusCode.Unauthorized, "Invalid or expired launch token.");
            }

            string email = msaasPayload.Email;
            if (string.IsNullOrWhiteSpace(email))
            {
                return ErrorResponse(HttpStatusCode.BadRequest, "Invalid SSO identity: no email provided.");
            }

            // ── 3. Find or create FoodERP user ───────────────────────────
            // Try synthetic tenant username first (Option B Identity Architecture)
            string syntheticUserName = $"MSAAS_{msaasPayload.TenantId}_{msaasPayload.UserId}";
            ApplicationUser user = await UserManager.FindByNameAsync(syntheticUserName);
            
            if (user == null)
            {
                // Fallback for legacy standalone demo users
                user = await UserManager.FindByEmailAsync(email);
            }

            if (user == null)
            {
                user = await ProvisionSsoUser(email);
                if (user == null)
                {
                    return ErrorResponse(HttpStatusCode.InternalServerError, "Failed to create FoodERP user for SSO.");
                }
            }

            // ── 4. Ensure user is active ─────────────────────────────────
            if (!user.IsActive)
            {
                return ErrorResponse(HttpStatusCode.Forbidden, "FoodERP account is inactive. Please contact an administrator.");
            }

            // ── 5. Generate OWIN bearer token (identical to /Token) ──────
            try
            {
                var response = GenerateTokenResponse(user);
                return JsonResponse(HttpStatusCode.OK, response);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.TraceError("[SSO] Token generation failed: " + ex.Message);
                return ErrorResponse(HttpStatusCode.InternalServerError, "Failed to generate authentication token.");
            }
        }

        // ── MSAAS validation call ────────────────────────────────────────
        private async Task<MsaasIdentity> ValidateLaunchTokenWithMsaas(string token)
        {
            string msaasUrl = ConfigurationManager.AppSettings["MsaasBackendUrl"];
            string apiKey = ConfigurationManager.AppSettings["InternalApiKey"];

            if (string.IsNullOrWhiteSpace(msaasUrl) || string.IsNullOrWhiteSpace(apiKey))
            {
                System.Diagnostics.Trace.TraceError("[SSO] MsaasBackendUrl or InternalApiKey is not configured.");
                return null;
            }

            string endpoint = msaasUrl.TrimEnd('/') + "/v1/api/auth/validate-launch-token";

            try
            {
                using (var client = new HttpClient())
                {
                    client.Timeout = TimeSpan.FromSeconds(10);
                    client.DefaultRequestHeaders.Add("x-internal-api-key", apiKey);

                    var body = new { token };
                    var json = JsonConvert.SerializeObject(body);
                    var content = new StringContent(json, Encoding.UTF8, "application/json");

                    var response = await client.PostAsync(endpoint, content);
                    var responseBody = await response.Content.ReadAsStringAsync();

                    if (!response.IsSuccessStatusCode)
                    {
                        System.Diagnostics.Trace.TraceInformation(
                            "[SSO] MSAAS validation failed (" + (int)response.StatusCode + "): " + responseBody);
                        return null;
                    }

                    var result = JsonConvert.DeserializeObject<MsaasValidationResponse>(responseBody);
                    if (result == null || !result.IsValid || result.Identity == null)
                    {
                        return null;
                    }

                    return result.Identity;
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.TraceError("[SSO] MSAAS validation error: " + ex.Message);
                return null;
            }
        }

        // ── Shared user creation logic ──────────────────────────────────
        private async Task<ApplicationUser> CreateSsoUser(string email, string name = null)
        {
            string userName = email.Contains("@") ? email.Split('@')[0] : email;

            var user = new ApplicationUser
            {
                UserName = userName,
                Email = email,
                Name = !string.IsNullOrEmpty(name) ? name : userName,
                IsActive = true,
                CreatedOn = DateTime.Now
            };

            // Random password — SSO users never log in with password
            string tempPassword = Guid.NewGuid().ToString("N").Substring(0, 12) + "A1!";
            var result = await UserManager.CreateAsync(user, tempPassword);

            if (!result.Succeeded)
            {
                string errors = string.Join("; ", result.Errors);
                System.Diagnostics.Trace.TraceError("[SSO] User creation failed: " + errors);
                return null;
            }

            // Assign default role — ensure "Franchisee" role exists in DB
            if (await RoleManager.RoleExistsAsync("Franchisee"))
            {
                await UserManager.AddToRoleAsync(user.Id, "Franchisee");
            }
            else
            {
                // Fallback: assign the first available role
                var firstRole = RoleManager.Roles.FirstOrDefault();
                if (firstRole != null)
                {
                    await UserManager.AddToRoleAsync(user.Id, firstRole.Name);
                }
            }

            return user;
        }

        // ── SSO user provisioning (called during SSO exchange fallback) ─
        private async Task<ApplicationUser> ProvisionSsoUser(string email)
        {
            try
            {
                return await CreateSsoUser(email);
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.TraceError("[SSO] ProvisionSsoUser error: " + ex.Message);
                return null;
            }
        }


        // ── POST api/sso/provision-franchise ────────────────────────────
        [HttpPost]
        [Route("provision-franchise")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> ProvisionFranchise(ProvisionFranchiseModel model)
        {
            if (!ValidateInternalApiKey()) return ErrorResponse(HttpStatusCode.Unauthorized, "Invalid API key.");
            if (model == null || string.IsNullOrWhiteSpace(model.TenantId)) return ErrorResponse(HttpStatusCode.BadRequest, "TenantId is required.");

            try
            {
                using (var db = new ApplicationDbContext())
                {
                    var existing = await db.Franchisees.FirstOrDefaultAsync(f => f.Id == model.TenantId);
                    if (existing != null)
                    {
                        return JsonResponse(HttpStatusCode.OK, new { message = "Franchise already exists", franchiseId = existing.Id });
                    }

                    var franchisee = new Franchisee
                    {
                        Id = model.TenantId,
                        StoreName = model.StoreName ?? "MSAAS Tenant",
                        Address = model.Address ?? "Online",
                        ContactNo = model.ContactNo ?? "N/A",
                        Email = model.Email ?? "N/A",
                        OperationalStatus = "Active",
                        IsActive = true,
                        CreatedDate = DateTime.Now,
                        CreatedBy = "MSAAS_API"
                    };

                    db.Franchisees.Add(franchisee);
                    await db.SaveChangesAsync();

                    return JsonResponse(HttpStatusCode.OK, new { message = "Franchise provisioned successfully", franchiseId = franchisee.Id });
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.TraceError("[SSO] ProvisionFranchise error: " + ex.Message);
                return ErrorResponse(HttpStatusCode.InternalServerError, "Franchise provisioning failed.");
            }
        }

        // ── POST api/sso/provision-user ─────────────────────────────────
        [HttpPost]
        [Route("provision-user")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> ProvisionUser(ProvisionUserModel model)
        {
            if (!ValidateInternalApiKey()) return ErrorResponse(HttpStatusCode.Unauthorized, "Invalid API key.");
            if (model == null || string.IsNullOrWhiteSpace(model.TenantId) || string.IsNullOrWhiteSpace(model.UserId) || string.IsNullOrWhiteSpace(model.Email))
            {
                return ErrorResponse(HttpStatusCode.BadRequest, "TenantId, UserId, and Email are required.");
            }

            string syntheticUserName = $"MSAAS_{model.TenantId}_{model.UserId}";
            string name = !string.IsNullOrWhiteSpace(model.Name) ? model.Name.Trim() : syntheticUserName;
            string role = !string.IsNullOrWhiteSpace(model.Role) ? model.Role : "Waiter";

            try
            {
                // 1. Ensure Franchise exists
                using (var db = new ApplicationDbContext())
                {
                    bool franchiseExists = await db.Franchisees.AnyAsync(f => f.Id == model.TenantId);
                    if (!franchiseExists)
                    {
                        return ErrorResponse(HttpStatusCode.BadRequest, "Parent Franchise does not exist. Provision franchise first.");
                    }
                }

                // 2. Find or Create Identity User
                ApplicationUser user = await UserManager.FindByNameAsync(syntheticUserName);
                if (user != null)
                {
                    // Map to Franchise safely
                    await EnsureFranchiseeUserMapping(user.Id, model.TenantId);
                    await EnsureUserRole(user.Id, role);

                    return JsonResponse(HttpStatusCode.OK, new { message = "User already exists", userId = user.Id });
                }

                user = new ApplicationUser
                {
                    UserName = syntheticUserName,
                    Email = model.Email.Trim().ToLower(),
                    Name = name,
                    IsActive = true,
                    CreatedOn = DateTime.Now
                };

                string tempPassword = Guid.NewGuid().ToString("N").Substring(0, 12) + "A1!";
                var result = await UserManager.CreateAsync(user, tempPassword);
                if (!result.Succeeded)
                {
                    return ErrorResponse(HttpStatusCode.InternalServerError, "Failed to create FoodERP identity.");
                }

                // 3. Map to Role
                await EnsureUserRole(user.Id, role);

                // 4. Map to Franchise
                await EnsureFranchiseeUserMapping(user.Id, model.TenantId);

                return JsonResponse(HttpStatusCode.OK, new { message = "User provisioned successfully", userId = user.Id });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.TraceError("[SSO] ProvisionUser error: " + ex.Message);
                return ErrorResponse(HttpStatusCode.InternalServerError, "User provisioning failed.");
            }
        }

        // ── POST api/sso/update-role ────────────────────────────────────
        [HttpPost]
        [Route("update-role")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> UpdateRole(UpdateRoleModel model)
        {
            if (!ValidateInternalApiKey()) return ErrorResponse(HttpStatusCode.Unauthorized, "Invalid API key.");
            if (model == null || string.IsNullOrWhiteSpace(model.TenantId) || string.IsNullOrWhiteSpace(model.UserId) || string.IsNullOrWhiteSpace(model.Role))
            {
                return ErrorResponse(HttpStatusCode.BadRequest, "TenantId, UserId, and Role are required.");
            }

            string syntheticUserName = $"MSAAS_{model.TenantId}_{model.UserId}";
            try
            {
                ApplicationUser user = await UserManager.FindByNameAsync(syntheticUserName);
                if (user == null)
                {
                    return ErrorResponse(HttpStatusCode.NotFound, "User not found.");
                }

                // Remove existing roles
                var existingRoles = await UserManager.GetRolesAsync(user.Id);
                if (existingRoles.Any())
                {
                    await UserManager.RemoveFromRolesAsync(user.Id, existingRoles.ToArray());
                }

                // Add new role
                await EnsureUserRole(user.Id, model.Role);

                return JsonResponse(HttpStatusCode.OK, new { message = "Role updated successfully" });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.TraceError("[SSO] UpdateRole error: " + ex.Message);
                return ErrorResponse(HttpStatusCode.InternalServerError, "Role update failed.");
            }
        }

        // ── POST api/sso/deprovision-franchise ──────────────────────────
        [HttpPost]
        [Route("deprovision-franchise")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> DeprovisionFranchise(DeprovisionFranchiseModel model)
        {
            if (!ValidateInternalApiKey()) return ErrorResponse(HttpStatusCode.Unauthorized, "Invalid API key.");
            if (model == null || string.IsNullOrWhiteSpace(model.TenantId)) return ErrorResponse(HttpStatusCode.BadRequest, "TenantId is required.");

            try
            {
                using (var db = new ApplicationDbContext())
                {
                    // 1. Delete FranchiseeUsers
                    var mappings = db.FranchiseeUsers.Where(fu => fu.FranchiseeId == model.TenantId).ToList();
                    db.FranchiseeUsers.RemoveRange(mappings);

                    // 2. Delete Franchisee
                    var franchise = await db.Franchisees.FirstOrDefaultAsync(f => f.Id == model.TenantId);
                    if (franchise != null)
                    {
                        db.Franchisees.Remove(franchise);
                    }

                    await db.SaveChangesAsync();

                    // Note: We don't delete AspNetUsers here, they are deleted via /deprovision individual calls
                    return JsonResponse(HttpStatusCode.OK, new { message = "Franchise deprovisioned successfully" });
                }
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.TraceError("[SSO] DeprovisionFranchise error: " + ex.Message);
                return ErrorResponse(HttpStatusCode.InternalServerError, "Franchise deprovision failed.");
            }
        }

        // ── POST api/sso/provision ──────────────────────────────────────
        /// <summary>
        /// Provisions a FoodERP user from MSAAS (internal API, requires x-internal-api-key).
        /// Idempotent: returns existing user if already provisioned.
        /// </summary>
        [HttpPost]
        [Route("provision")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> Provision(ProvisionModel model)
        {
            // 1. Validate internal API key
            string apiKey = Request.Headers.Contains("x-internal-api-key")
                ? Request.Headers.GetValues("x-internal-api-key").FirstOrDefault()
                : null;
            string expectedKey = ConfigurationManager.AppSettings["InternalApiKey"];
            if (string.IsNullOrEmpty(apiKey) || apiKey != expectedKey)
            {
                return ErrorResponse(HttpStatusCode.Unauthorized, "Invalid API key.");
            }

            // 2. Validate input
            if (model == null || string.IsNullOrWhiteSpace(model.TenantId) || string.IsNullOrWhiteSpace(model.UserId))
            {
                return ErrorResponse(HttpStatusCode.BadRequest, "TenantId and UserId are required.");
            }

            string email = model.Email.Trim().ToLower();
            string name = !string.IsNullOrWhiteSpace(model.Name) ? model.Name.Trim() : null;

            try
            {
                // 3. Find or create user (idempotent)
                ApplicationUser user = await UserManager.FindByEmailAsync(email);

                if (user != null)
                {
                    // User exists — update name if provided and different
                    if (!string.IsNullOrEmpty(name) && user.Name != name)
                    {
                        user.Name = name;
                        await UserManager.UpdateAsync(user);
                    }
                    return JsonResponse(HttpStatusCode.OK, new
                    {
                        message = "User already exists",
                        userId = user.Id
                    });
                }

                // 4. Create user using shared logic
                user = await CreateSsoUser(email, name);
                if (user == null)
                {
                    return ErrorResponse(HttpStatusCode.InternalServerError, "Failed to create FoodERP user.");
                }

                return JsonResponse(HttpStatusCode.OK, new
                {
                    message = "User provisioned successfully",
                    userId = user.Id
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.TraceError("[SSO] Provision error: " + ex.Message);
                return ErrorResponse(HttpStatusCode.InternalServerError, "Provisioning failed.");
            }
        }

        // ── POST api/sso/deprovision ────────────────────────────────────
        /// <summary>
        /// Removes a FoodERP user from MSAAS (internal API, requires x-internal-api-key).
        /// Idempotent: returns success if user already removed.
        /// </summary>
        [HttpPost]
        [Route("deprovision")]
        [AllowAnonymous]
        public async Task<HttpResponseMessage> Deprovision(DeprovisionModel model)
        {
            // 1. Validate internal API key
            string apiKey = Request.Headers.Contains("x-internal-api-key")
                ? Request.Headers.GetValues("x-internal-api-key").FirstOrDefault()
                : null;
            string expectedKey = ConfigurationManager.AppSettings["InternalApiKey"];
            if (string.IsNullOrEmpty(apiKey) || apiKey != expectedKey)
            {
                return ErrorResponse(HttpStatusCode.Unauthorized, "Invalid API key.");
            }

            // 2. Validate input
            if (model == null || string.IsNullOrWhiteSpace(model.Email))
            {
                return ErrorResponse(HttpStatusCode.BadRequest, "Email is required.");
            }

            string syntheticUserName = $"MSAAS_{model.TenantId}_{model.UserId}";

            try
            {
                // 3. Find user (idempotent)
                ApplicationUser user = await UserManager.FindByNameAsync(syntheticUserName);
                if (user == null)
                {
                    return JsonResponse(HttpStatusCode.OK, new
                    {
                        message = "User not found (already cleaned)"
                    });
                }

                // 4. Delete FranchiseeUsers mapping
                using (var db = new ApplicationDbContext())
                {
                    var mappings = db.FranchiseeUsers.Where(fu => fu.UserId == user.Id).ToList();
                    if (mappings.Any())
                    {
                        db.FranchiseeUsers.RemoveRange(mappings);
                        await db.SaveChangesAsync();
                    }
                }
                
                // 5. Delete user
                var result = await UserManager.DeleteAsync(user);
                if (!result.Succeeded)
                {
                    string errors = string.Join("; ", result.Errors);
                    System.Diagnostics.Trace.TraceError("[SSO] Deprovision delete failed: " + errors);
                    return ErrorResponse(HttpStatusCode.InternalServerError, "Failed to delete user: " + errors);
                }

                return JsonResponse(HttpStatusCode.OK, new
                {
                    message = "User deprovisioned successfully"
                });
            }
            catch (Exception ex)
            {
                System.Diagnostics.Trace.TraceError("[SSO] Deprovision error: " + ex.Message);
                return ErrorResponse(HttpStatusCode.InternalServerError, "Deprovision failed.");
            }
        }

        // ── Token generation (mirrors ApplicationOAuthProvider) ──────────
        private object GenerateTokenResponse(ApplicationUser user)
        {
            // 1. Create identity with same claims as normal login
            ClaimsIdentity oAuthIdentity = user.GenerateUserIdentity(UserManager, OAuthDefaults.AuthenticationType);

            // 2. Get user role (required — matches GrantResourceOwnerCredentials pattern)
            IList<string> roles = UserManager.GetRoles(user.Id);
            string role = roles.FirstOrDefault() ?? "";

            // 3. Create authentication properties (same keys as ApplicationOAuthProvider)
            AuthenticationProperties properties = ApplicationOAuthProvider.CreateProperties(
                user.Id, user.UserName, user.Name, role);

            // 4. Create ticket and generate opaque bearer token
            AuthenticationTicket ticket = new AuthenticationTicket(oAuthIdentity, properties);
            string accessToken = Startup.OAuthOptions.AccessTokenFormat.Protect(ticket);

            // 5. Return in standard OWIN token-response format
            //    Frontend reads: access_token, token_type, expires_in
            //    Frontend also reads: userId, userName (from rawData)
            int expiresIn = (int)Startup.OAuthOptions.AccessTokenExpireTimeSpan.TotalSeconds;

            return new
            {
                access_token = accessToken,
                token_type = "bearer",
                expires_in = expiresIn,
                userId = user.Id,
                userName = user.UserName,
                name = user.Name,
                role = role
            };
        }

        // ── Response helpers ─────────────────────────────────────────────
        private HttpResponseMessage JsonResponse(HttpStatusCode statusCode, object payload)
        {
            var response = Request.CreateResponse(statusCode, payload);
            response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
            return response;
        }

        private HttpResponseMessage ErrorResponse(HttpStatusCode statusCode, string message)
        {
            var body = new { error = message };
            var response = Request.CreateResponse(statusCode, body);
            response.Content.Headers.ContentType = new System.Net.Http.Headers.MediaTypeHeaderValue("application/json");
            return response;
        }

        // ── Request / response DTOs ──────────────────────────────────────

        public class SsoExchangeModel
        {
            public string Code { get; set; }
        }

        public class ProvisionModel
        {
            [System.ComponentModel.DataAnnotations.Required]
            public string Email { get; set; }
            public string Name { get; set; }
        }

        public class DeprovisionModel
        {
            [System.ComponentModel.DataAnnotations.Required]
            public string TenantId { get; set; }
            [System.ComponentModel.DataAnnotations.Required]
            public string UserId { get; set; }
        }

        private class MsaasValidationResponse
        {
            [JsonProperty("isValid")]
            public bool IsValid { get; set; }

            [JsonProperty("identity")]
            public MsaasIdentity Identity { get; set; }
        }


        public class ProvisionFranchiseModel
        {
            [System.ComponentModel.DataAnnotations.Required]
            public string TenantId { get; set; }
            [System.ComponentModel.DataAnnotations.Required]
            public string StoreName { get; set; }
            public string Address { get; set; }
            public string ContactNo { get; set; }
            public string Email { get; set; }
        }

        public class ProvisionUserModel
        {
            [System.ComponentModel.DataAnnotations.Required]
            public string TenantId { get; set; }
            [System.ComponentModel.DataAnnotations.Required]
            public string UserId { get; set; }
            [System.ComponentModel.DataAnnotations.Required]
            public string Email { get; set; }
            public string Name { get; set; }
            [System.ComponentModel.DataAnnotations.Required]
            public string Role { get; set; }
        }
        
        public class UpdateRoleModel
        {
            [System.ComponentModel.DataAnnotations.Required]
            public string TenantId { get; set; }
            [System.ComponentModel.DataAnnotations.Required]
            public string UserId { get; set; }
            [System.ComponentModel.DataAnnotations.Required]
            public string Role { get; set; }
        }

        public class DeprovisionFranchiseModel
        {
            [System.ComponentModel.DataAnnotations.Required]
            public string TenantId { get; set; }
        }

        private class MsaasIdentity
        {
            [JsonProperty("userId")]
            public string UserId { get; set; }

            [JsonProperty("email")]
            public string Email { get; set; }

            [JsonProperty("tenantId")]
            public string TenantId { get; set; }

            [JsonProperty("productId")]
            public string ProductId { get; set; }

            [JsonProperty("roleId")]
            public string RoleId { get; set; }
        }
    }
}
