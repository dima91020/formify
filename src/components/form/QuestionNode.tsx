import {Handle, Position, NodeProps, Node} from "@xyflow/react"
import {Options} from "@/components/form/FormOptions";

export type QuestionNodeData = {
    title: string;
    type: Options;
    options?: {
        id: string,
        value: string,
    }[];
};

export default function QuestionNode({ data }: NodeProps<Node<QuestionNodeData>>) {
    return (
        <div className="">
            <Handle type="target" position={Position.Left} />
                <div className="flex flex-col gap-1 items-start shadow-md border justify-center text-md text-gray-700 p-3 rounded-md bg-white">
                    <h2 className="text-lg font-medium text-gray-800">{data.title}</h2>
                    <hr className="border-b border-0 w-full border-gray-300" />
                    <p>type: {data.type}</p>

                    {data.options && (
                        <div>
                            {data.options.length <= 3 ? (
                                <div>
                                    {data.options.map((opt) => (
                                        <div key={opt.id}>{opt.value}</div>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    <p>...</p>
                                    <p>- {Math.floor(data.options.length / 2) + 1}. {data.options[Math.floor(data.options.length / 2)].value}</p>
                                    <p>- ...</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            <Handle type="source" position={Position.Right} />
        </div>
    );
}