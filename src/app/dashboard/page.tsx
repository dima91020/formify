import Link from "next/link";
import {auth} from "@/auth";
import {redirect} from "next/navigation";
import {prisma} from "@/lib/prisma";
import FormCard from "@/components/form/FormCard";
import CreateDraftFormButton from "@/components/form/CreateDraftFormButton";

export default async function DashboardPage() {
    const session = await auth();

    if (!session?.user?.id) {
        redirect('/login');
    }

    const forms = await prisma.form.findMany({
        where: {
            userId: session?.user?.id,
        },
        orderBy: {
            createdAt: "desc",
        }
    });

    return (
        <div className="h-full w-full bg-gray-50 p-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">My Forms</h1>
                        <p className="mb-6 text-gray-500">Welcome back, {session?.user?.name}</p>
                    </div>
                    <CreateDraftFormButton />
                    {/*<Link href='/builder' className="text-center bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">*/}
                    {/*    Create Form*/}
                    {/*</Link>*/}
                </div>
                {forms.length === 0 ? (
                    <div className="text-center bg-white shadow-sm p-12 rounded-lg">
                        <h1 className="text-2xl mb-2 text-gray-800">No forms found</h1>
                        <p className="mb-6 text-gray-500">Create your first survey to start collecting feedback.</p>
                        <Link href='/builder' className="text-center bg-gray-800 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
                            Create Form
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {forms.map((form) => (
                            <FormCard key={form.id} form={form} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}