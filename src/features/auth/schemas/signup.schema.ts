import { z } from "zod";

const nameRegex = /^[A-Za-z\s'-]+$/;

const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,128}$/;

export const signUpSchema = z
    .object({
        fullName: z
            .string()
            .trim()
            .min(2, "Name must be at least 2 characters")
            .max(100)
            .regex(nameRegex, "Please enter your full name"),

        identifier: z
            .string()
            .trim()
            .min(1, "Email or phone number is required"),

        password: z.string().optional(),
        confirmPassword: z.string().optional(),

        terms: z
            .boolean()
            .refine((val) => val === true, {
                message: "You must accept the Terms of Service to continue",
            }),

    })
    .superRefine((data, ctx) => {
        const value = data.identifier.trim();

        const isEmail = value.includes("@");
        const isPhone = value.startsWith("+") || /^[0-9]+$/.test(value);

        if (isEmail) {
            const emailCheck = z.string().email();
            const result = emailCheck.safeParse(value.toLowerCase());

            if (!result.success) {
                ctx.addIssue({
                    code: "custom",
                    path: ["identifier"],
                    message: "Please enter a valid mobile number",
                });
            }

            if (!data.password) {
                ctx.addIssue({
                    code: "custom",
                    path: ["password"],
                    message: "Password is required",
                });
            } else if (!passwordRegex.test(data.password)) {
                ctx.addIssue({
                    code: "custom",
                    path: ["password"],
                    message:
                        "Password must contain uppercase, lowercase, number and special character",
                });
            }

            if (data.password !== data.confirmPassword) {
                ctx.addIssue({
                    code: "custom",
                    path: ["password"],
                    message: "Password is required",
                });
            }
        }

        if (!isEmail && !isPhone) {


            ctx.addIssue({
                code: "custom",
                path: ["identifier"],
                message: "Please enter a valid mobile number",
            });
        }
    });
