'use server';

import { prisma } from "@/lib/prisma";
import { RegisterInput, registerSchema } from "@/schemas/auth.schema";
import bcrypt from "bcryptjs";

export async function registerUser(data: RegisterInput) {
    const validated = registerSchema.safeParse(data);

    if (!validated.success) {
        return {
            success: false,
            error: validated.error.flatten().fieldErrors,
            message: "Validation failed.",
        }
    }

    const { name, email, password } = validated.data;
    
    try {
        const isEmailUsed = await prisma.user.findUnique({
            where: {
                email,
            }
        });

        if (isEmailUsed) {
            return {
                success: false,
                message: "This email is already used.",
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            }
        });

        return { success: true, message: "User registered successfully." };
    } catch (error) {
        return {
            success: false,
            error: 'Internal server error',
            message: "Failed to register user.",
        }
    }
}