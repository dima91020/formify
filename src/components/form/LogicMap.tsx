import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";
import { Background, Controls, ReactFlow } from "@xyflow/react";
import QuestionNode from "@/components/form/QuestionNode";
import dagre from "@dagrejs/dagre";

const nodeTypes = {
    questionCard: QuestionNode,
};

export default function LogicMap() {
    const questions = useAppSelector((state) => state.form.questions);

    const initialNodes = useMemo(() => questions
            .map((q) => (
                {
                    id: q.id,
                    position: { x: 0, y: 0 },
                    type: "questionCard",
                    data: {
                        title: q.title,
                        type: q.type,
                        options: q.options,
                    }
                }
            ))
        , [questions]);

    const initialEdges = useMemo(() => questions
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
        , [questions]);

    const { layoutedNodes, layoutedEdges } = useMemo(() => {
        const graph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));

        const nodeWidth = 300;
        const nodeHeight = 200;

        graph.setGraph({ rankdir: 'LR' });

        initialNodes.forEach((node) => {
            graph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
        });

        initialEdges.forEach((edge) => {
            graph.setEdge(edge.source, edge.target);
        });

        dagre.layout(graph);

        const newNodes = initialNodes.map((node) => {
            const nodeWithPosition = graph.node(node.id);

            return {
                ...node,
                position: {
                    x: nodeWithPosition.x - nodeWidth / 2,
                    y: nodeWithPosition.y - nodeHeight / 2,
                }
            };
        });

        return { layoutedNodes: newNodes, layoutedEdges: initialEdges };
    }, [initialNodes, initialEdges]);

    return (
        <div className="w-full h-full">
            <ReactFlow
                nodes={layoutedNodes}
                edges={layoutedEdges}
                nodeTypes={nodeTypes}
                fitView
            >
                <Background />
                <Controls />
            </ReactFlow>
        </div>
    );
}