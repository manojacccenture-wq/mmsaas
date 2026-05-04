import React, { useState } from "react";
import Button from "@/shared/components/UI/Button/Button";
import Card from "@/shared/components/UI/Card/Card";
import Select from "@/shared/components/UI/Select/Select";
import Input from "@/shared/components/UI/Input/Input";
import { 
  useAttachPolicyToRoleMutation, 
  useGetGlobalRolesQuery, 
  useGetIAMPoliciesQuery,
  useCreateIAMPolicyMutation
} from "@/features/tenantManagement/api/tenantApi";

// SVG Icons
const ShieldCheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
  </svg>
);

// ─── Policy Library Card ─────────────────────────────────────────────────────
const PolicyCard = ({ policy }: { policy: any }) => {
  const [expanded, setExpanded] = useState(false);
  const isManaged = policy.type === "MANAGED";
  const allowStatements = (policy.statements || []).filter((s: any) => s.effect === "ALLOW");
  const denyStatements  = (policy.statements || []).filter((s: any) => s.effect === "DENY");

  return (
    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-5 cursor-pointer" onClick={() => setExpanded(p => !p)}>
        <div className="flex items-start gap-3">
          <div className={`mt-0.5 p-2 rounded-xl ${isManaged ? "bg-indigo-50 text-indigo-600" : "bg-amber-50 text-amber-600"}`}>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="font-bold text-slate-800 text-sm">{policy.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${
                isManaged ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-amber-50 text-amber-600 border-amber-200"
              }`}>
                {policy.type}
              </span>
              <span className="text-[11px] text-slate-400">{policy.statements?.length || 0} statement{policy.statements?.length !== 1 ? "s" : ""}</span>
              {allowStatements.length > 0 && (
                <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  ✓ {allowStatements.length} ALLOW
                </span>
              )}
              {denyStatements.length > 0 && (
                <span className="text-[10px] bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-semibold">
                  ✗ {denyStatements.length} DENY
                </span>
              )}
            </div>
          </div>
        </div>
        <svg className={`w-4 h-4 text-slate-400 flex-shrink-0 mt-1 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded Statements */}
      {expanded && (
        <div className="border-t border-slate-100 px-5 pb-5 pt-4 space-y-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">What this policy does:</p>
          {(policy.statements || []).map((stmt: any, i: number) => {
            const isAllow = stmt.effect === "ALLOW";
            return (
              <div key={i} className={`rounded-xl border p-4 ${
                isAllow ? "bg-emerald-50 border-emerald-200" : "bg-red-50 border-red-200"
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    isAllow ? "bg-emerald-600 text-white" : "bg-red-600 text-white"
                  }`}>
                    {isAllow ? "✓ ALLOW" : "✗ DENY"}
                  </span>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Actions</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(stmt.actions || []).map((a: string, ai: number) => (
                        <code key={ai} className={`text-[11px] px-2 py-0.5 rounded-md font-mono font-semibold ${
                          isAllow ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                        }`}>{a}</code>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide mb-1">Resources</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(stmt.resources || []).map((r: string, ri: number) => (
                        <code key={ri} className="text-[11px] px-2 py-0.5 rounded-md font-mono bg-slate-200 text-slate-700 font-semibold">{r}</code>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
const PolicyManagement = () => {
  const [activeTab, setActiveTab] = useState<"create" | "assign" | "library">("create");

  const [attachPolicy, { isLoading: isAttaching }] = useAttachPolicyToRoleMutation();
  const [createPolicy, { isLoading: isCreating }] = useCreateIAMPolicyMutation();
  const { data: policiesData } = useGetIAMPoliciesQuery({});
  const { data: rolesData } = useGetGlobalRolesQuery({});
  
  const policies = policiesData?.data || [];
  const roles = rolesData?.data || [];

  // Assign State
  const [assignment, setAssignment] = useState({ roleId: "", policyId: "" });

  // Create State
  const [policyName, setPolicyName] = useState("");
  const [policyType, setPolicyType] = useState("MANAGED");
  const [statements, setStatements] = useState([
    { effect: "ALLOW", actions: "*", resources: "*" }
  ]);

  const handleAttach = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await attachPolicy(assignment).unwrap();
      setAssignment({ roleId: "", policyId: "" });
      alert("Policy attached to role successfully!");
    } catch (err) {
      alert("Failed to attach policy");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!policyName) return alert("Policy name is required");

    const formattedStatements = statements.map(s => ({
      effect: s.effect,
      actions: s.actions.split(",").map(a => a.trim()).filter(Boolean),
      resources: s.resources.split(",").map(r => r.trim()).filter(Boolean),
    }));

    try {
      await createPolicy({
        name: policyName,
        type: policyType,
        statements: formattedStatements
      }).unwrap();
      
      setPolicyName("");
      setStatements([{ effect: "ALLOW", actions: "*", resources: "*" }]);
      alert("Policy created successfully!");
    } catch (err) {
      alert("Failed to create policy");
    }
  };

  const addStatement = () => {
    setStatements([...statements, { effect: "ALLOW", actions: "", resources: "*" }]);
  };

  const updateStatement = (index: number, field: string, value: string) => {
    const newStatements = [...statements];
    newStatements[index] = { ...newStatements[index], [field]: value };
    setStatements(newStatements);
  };

  const removeStatement = (index: number) => {
    setStatements(statements.filter((_, i) => i !== index));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shadow-sm border border-indigo-100">
              <ShieldCheckIcon />
            </div>
            IAM Policy Management
          </h1>
          <p className="text-slate-500 mt-2 max-w-2xl text-sm leading-relaxed">
            Create robust access control policies and attach them to roles to secure your organization's resources. Policies define exactly what actions are allowed or denied.
          </p>
        </div>
        
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl shadow-inner border border-slate-200">
          <button 
            type="button"
            onClick={() => setActiveTab("create")}
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "create" 
              ? "bg-white text-indigo-700 shadow-sm" 
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            Create Policy
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("assign")}
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
              activeTab === "assign" 
              ? "bg-white text-emerald-700 shadow-sm" 
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            Assign Policy
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("library")}
            className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
              activeTab === "library" 
              ? "bg-white text-violet-700 shadow-sm" 
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
            }`}
          >
            Policy Library
            <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded-full font-bold">
              {policies.length}
            </span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* CREATE POLICY TAB */}
        {activeTab === "create" && (
          <Card className="p-8 border-t-4 border-indigo-500 shadow-xl bg-white/60 backdrop-blur-sm rounded-2xl">
            <div className="mb-8 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-slate-800">Design Security Policy</h2>
              <p className="text-sm text-slate-500 mt-1">Define your statements carefully. Use comma-separated values for multiple actions or resources.</p>
            </div>
            
            <form onSubmit={handleCreate} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input 
                  label="Policy Name" 
                  placeholder="e.g., ReadOnlyAccess"
                  value={policyName}
                  onChange={(e) => setPolicyName(e.target.value)}
                  required
                />
                <Select
                  label="Policy Type"
                  options={[
                    { value: "MANAGED", label: "Managed (Global)" },
                    { value: "INLINE", label: "Inline (Specific)" }
                  ]}
                  value={policyType}
                  onChange={(e) => setPolicyType(e.target.value)}
                />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-slate-700">Policy Statements</h3>
                  <button 
                    type="button" 
                    onClick={addStatement}
                    className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    <PlusIcon /> Add Statement
                  </button>
                </div>

                <div className="space-y-4">
                  {statements.map((stmt, idx) => (
                    <div key={idx} className="group relative bg-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                      {statements.length > 1 && (
                        <button 
                          type="button"
                          onClick={() => removeStatement(idx)}
                          className="absolute -top-3 -right-3 bg-red-100 text-red-600 p-1.5 rounded-full hover:bg-red-200 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 shadow-sm"
                        >
                          <TrashIcon />
                        </button>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-3">
                          <Select
                            label="Effect"
                            options={[
                              { value: "ALLOW", label: "Allow" },
                              { value: "DENY", label: "Deny" }
                            ]}
                            value={stmt.effect}
                            onChange={(e) => updateStatement(idx, "effect", e.target.value)}
                            className={stmt.effect === "ALLOW" ? "text-emerald-700 bg-emerald-50 border-emerald-200" : "text-rose-700 bg-rose-50 border-rose-200"}
                          />
                        </div>
                        <div className="md:col-span-5">
                          <Input 
                            label="Actions (comma separated)" 
                            placeholder="e.g., users:read, users:write"
                            value={stmt.actions}
                            onChange={(e) => updateStatement(idx, "actions", e.target.value)}
                            required
                          />
                        </div>
                        <div className="md:col-span-4">
                          <Input 
                            label="Resources" 
                            placeholder="e.g., *"
                            value={stmt.resources}
                            onChange={(e) => updateStatement(idx, "resources", e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 flex justify-end">
                <Button 
                  type="submit" 
                  disabled={isCreating}
                  className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5"
                >
                  {isCreating ? "Creating..." : "Create Policy"}
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* ASSIGN POLICY TAB */}
        {activeTab === "assign" && (
          <Card className="p-8 border-t-4 border-emerald-500 shadow-xl bg-white/60 backdrop-blur-sm rounded-2xl">
            <div className="mb-8 border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Attach Policy to Role</h2>
                <p className="text-sm text-slate-500 mt-1">Bind security layers to specific roles to instantly enforce access controls.</p>
              </div>
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold shadow-sm border border-emerald-100">
                🔒
              </div>
            </div>
            
            <form onSubmit={handleAttach} className="space-y-6 max-w-2xl mx-auto py-4">
              <Select
                label="Target Role"
                options={roles.map((r: any) => ({ value: r._id, label: `${r.name} (${r.code})` }))}
                value={assignment.roleId}
                onChange={(e) => setAssignment({ ...assignment, roleId: e.target.value })}
                required
                placeholder="Select role to modify"
                className="bg-slate-50"
              />
              <Select
                label="IAM Policy"
                options={policies.map((p: any) => ({ value: p._id, label: p.name }))}
                value={assignment.policyId}
                onChange={(e) => setAssignment({ ...assignment, policyId: e.target.value })}
                required
                placeholder="Select security policy"
                className="bg-slate-50"
              />
              <div className="pt-4">
                <Button 
                  type="submit" 
                  disabled={isAttaching}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase py-4 rounded-xl shadow-lg shadow-emerald-200 transition-all transform hover:-translate-y-0.5"
                >
                   {isAttaching ? "Attaching Layer..." : "Attach Security Layer"}
                </Button>
              </div>
            </form>
          </Card>
        )}
        {/* POLICY LIBRARY TAB */}
        {activeTab === "library" && (
          <div className="space-y-6">
            {/* Summary bar */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Total Policies", value: policies.length, color: "bg-violet-100 text-violet-700", icon: "🛡️" },
                { label: "Managed (Global)", value: policies.filter((p: any) => p.type === "MANAGED").length, color: "bg-indigo-100 text-indigo-700", icon: "🌐" },
                { label: "Inline (Specific)", value: policies.filter((p: any) => p.type === "INLINE").length, color: "bg-amber-100 text-amber-700", icon: "⚙️" },
              ].map(stat => (
                <div key={stat.label} className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                  <span className={`text-2xl w-10 h-10 flex items-center justify-center rounded-xl ${stat.color}`}>{stat.icon}</span>
                  <div>
                    <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                    <p className="text-xs text-slate-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Legend */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 flex flex-wrap items-center gap-4 text-xs text-slate-600">
              <span className="font-semibold text-slate-700">How to read:</span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"/> ALLOW = these actions are <strong>permitted</strong></span>
              <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"/> DENY = these actions are <strong>blocked</strong> (overrides ALLOW)</span>
              <span className="flex items-center gap-1.5"><code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono">orders:read</code> = resource <strong>:</strong> verb format</span>
              <span className="flex items-center gap-1.5"><code className="bg-slate-200 px-1.5 py-0.5 rounded font-mono">*</code> = matches everything</span>
            </div>

            {/* Policy Cards */}
            {policies.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <div className="text-5xl mb-3">🛡️</div>
                <p className="font-semibold text-slate-600">No policies created yet</p>
                <p className="text-sm mt-1">Switch to the "Create Policy" tab to add your first policy.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policies.map((policy: any) => (
                  <PolicyCard key={policy._id} policy={policy} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PolicyManagement;
