'use server'

import { prisma } from '@/lib/prisma';
import {CreateFormInput, createFormSchema} from '@/schemas/form.schema';
import { auth } from "@/auth";
import {revalidatePath} from "next/cache";

export async function createForm(data: CreateFormInput) {
    const validated = createFormSchema.safeParse(data);

    if (!validated.success) {
        return {
            success: false,
            error: validated.error.flatten().fieldErrors,
            message: 'Validation failed.',
        };
    }

    try {
        const session = await auth();

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", message: "You must be logged in to save a form." };
        }

        const form = await prisma.form.create({
            data: {...validated.data, userId: session.user.id},
        });

        revalidatePath("/dashboard")
        return {success: true, form};
    } catch (error) {
        return {
            success: false,
            error: 'Internal server error',
            message: 'Failed to save form to the database.'
        };
    }
}

export async function updateForm(newData: CreateFormInput, id: string) {
    const validated = createFormSchema.safeParse(newData);

    if (!validated.success) {
        return {
            success: false,
            error: validated.error.flatten().fieldErrors,
            message: 'Validation failed.',
        }
    }

    try {
        const session = await auth();

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", message: "You must be logged in to update a form." };
        }

        const existingForm = await prisma.form.findUnique({
            where: {id}
        })

        if (!existingForm || existingForm.userId !== session.user.id) {
            return { success: false, error: "Forbidden", message: "You do not have permission to edit this form." };
        }

        const form = await prisma.form.update({
            where: {
                id,
            },
            data: newData,
        })

        revalidatePath("/dashboard")
        return {success: true, form};
    } catch (error) {
        return {
            success: false,
            error: 'Internal server error',
            message: 'Failed to update form to the database.'
        }
    }
}

export async function deleteForm(id: string) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", message: "You must be logged in." };
        }

        // deleteMany видаляє всі записи, що відповідають умовам.
        // Якщо форма не існує або належить іншому користувачу,
        // база даних просто видалить 0 записів і не викине помилку.
        const result = await prisma.form.deleteMany({
            where: {
                id: id,
                userId: session.user.id,
            },
        });

        // Перевіряємо, чи реально щось було видалено
        if (result.count === 0) {
            return {
                success: false,
                error: "Forbidden",
                message: "Form not found or access denied."
            };
        }

        revalidatePath("/dashboard");
        return { success: true };
    } catch (error) {
        console.error("Delete error:", error);
        return {
            success: false,
            error: 'Internal server error',
            message: 'Failed to delete form.'
        };
    }
}

export async function togglePublishStatus(formId: string) {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", message: "You must be logged in." };
        }

        const existingForm = await prisma.form.findUnique({
            where: {
                id: formId,
            }
        })

        if (!existingForm || existingForm.userId !== session.user.id) {
            return { success: false, error: "Forbidden", message: "You do not have permission to edit this form." };
        }

       await prisma.form.update({
            where: {
                id: formId,
            },
            data: {
                published: !existingForm.published,
            }
        })

        revalidatePath("/dashboard");
        return { success: true};
    } catch (error) {
        return {
            success: false,
            error: 'Internal server error',
            message: 'Failed to update form.'
        };
    }
}

export async function createDraftForm() {
    try {
        const session = await auth();

        if (!session?.user?.id) {
            return { success: false, error: "Unauthorized", message: "You must be logged in to save a form." };
        }

        const form = await prisma.form.create({
            data: {
                title: "Untitled Form",
                schema: {
                    logic: [],
                    questions: [],
                },
                userId: session.user.id,
            }
        })

        revalidatePath("/dashboard");
        return {success: true, formId: form.id};
    } catch (error) {
        return {
            success: false,
            error: 'Internal server error',
            message: 'Failed to save form to the database.'
        };
    }
}