import * as z from "zod";

export const registerSchema = z.object({
    name: z.string()
    .min(2, "The name must contain at least 2 characters")
    .max(50, "The name must not exceed 50 characters."),
    email: z.string().email("Invalid email"),
    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, { message: "Needs an uppercase letter" })
        .regex(/[a-z]/, { message: "Needs a lowercase letter" })
        .regex(/\d/, { message: "Needs a number" })
        .regex(/[^a-zA-Z0-9]/, { message: "Must contain at least 1 special character" }),
});

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(1, "Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type loginInput = z.infer<typeof loginSchema>;