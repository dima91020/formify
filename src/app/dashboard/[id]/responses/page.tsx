import {prisma} from "@/lib/prisma";
import {notFound} from "next/navigation";
import {FormContent, Question} from "@/schemas/form.schema";
import {Answers} from "@/actions/response.actions";

export default async function ResponsesPage({params}: {params: Promise<{id: string}>}) {
    const { id } = await params;

    const form = await prisma.form.findUnique({
        where: {
            id,
        },
        include: {
            responses: true,
        }
    })

    if (!form) {
        return notFound();
    }

    function findQuestionById(answerId: string): Question | undefined {
       return (form?.schema as FormContent).questions.find((question) => question.id === answerId);
    }

    return (
        <div className="flex flex-col gap-6 bg-white w-full h-screen items-center  text-black p-6">
            <div className="flex-none mb-6 p-2 text-center">
                <h1 className="text-2xl font-bold">{form.title}</h1>
                <p className="text-gray-500">{form.responses.length} responses</p>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full max-w-4xl overflow-y-auto">
                {form.responses.map(response => (
                    <div key={response.id} className="bg-gray-300 rounded-lg px-4 py-6 text-black w-full">
                        <p className="">{`${response.createdAt.toLocaleDateString('UK-ua')}, ${response.createdAt.toLocaleTimeString('UK-ua')}`}</p>
                        <div>{response.answers && Object.entries(response.answers as Answers).map(([id, answer]) => {
                            const answerBody = Array.isArray(answer) ?  answer.join(', ') : answer;

                            return (
                                <div key={id}>
                                    <h2>{findQuestionById(id)?.title}</h2>
                                    <p>{answerBody}</p>
                                </div>
                            );
                        })}</div>
                    </div>
                ))}
            </div>
        </div>
    );

}