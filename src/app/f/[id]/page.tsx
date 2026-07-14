import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FormRenderer from "@/components/form/FormRenderer";
import {CreateFormInput} from "@/schemas/form.schema";
import {auth} from "@/auth";

export default async function PublicFormPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const session = await auth();

    const form = await prisma.form.findUnique({
        where: {
            id: id,
        }
    });

    if (!form || (!form.published && session?.user?.id !== form.userId)) {
        notFound();
    }

    const formSchema = form.schema as CreateFormInput["schema"];

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
            <div className="max-w-2xl w-full bg-white p-8 rounded-xl shadow-sm border">
                <h1 className="text-3xl font-medium text-gray-900 mb-6">{form.title}</h1>
                <FormRenderer questions={formSchema.questions} formId={id} />
            </div>
        </div>
    );
}