import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import FormBuilder from "@/components/builder/FormBuilder";

export default async function EditPage({ params }: { params: Promise<{ id: string }>}) {
    const session = await auth();
    const { id: editingId } = await params;

    if (!session?.user?.id) {
        redirect('/login');
    }

    const editingForm = await prisma.form.findFirst({
        where: {
            id: editingId,
            userId: session.user.id,
        }
    });

    if (!editingForm) {
        notFound();
    }

    return (
        <FormBuilder initialData={editingForm}/>
    );
}