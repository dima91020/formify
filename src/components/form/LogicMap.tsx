import {useMemo} from "react";
import {useAppSelector} from "@/store/hooks";
import {ReactFlow, Background, Controls} from "@xyflow/react"
import QuestionNode from "@/components/form/QuestionNode";
// import dagre from "@dagrejs/dagre";

export default function LogicMap() {
    const questions = useAppSelector((state) => state.form.questions);
    // const graph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    //
    // const nodeWidth = 132;
    // const nodeHeight = 36;
    //
    // graph.setGraph({ rankdir: 'LR' });


    const questionNode = {
        questionCard: QuestionNode,
    }

    const nodes = useMemo(() => questions
        .map((q, index) => (
            { id: q.id,
                position: { x: index * 250, y: 0 },
                type: "questionCard",
                data: {
                    title: q.title,
                    type: q.type,
                    options: q.options,
                }
            }
        ))
        , [questions]
    );
    const edges = useMemo(() => questions
            .flatMap((q) => {
                if (!q.condition) return [];

                return [{
                    id: `${q.condition.targetQuestionId}-${q.id}`,
                    source: q.condition.targetQuestionId,
                    target: q.id,
                    label: `If equals to: ${q.condition.expectedValue}`,
                    animated: true,
                }];
            })
        , [questions]
    );

    return (
        <div className="w-full h-full">
            <ReactFlow nodes={nodes} edges={edges} fitView nodeTypes={questionNode}>
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}