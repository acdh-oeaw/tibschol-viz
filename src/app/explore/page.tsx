/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import SearchBar from "../components/Search";
import rawData from "../../data/relations.json";
import { RawRow, DataRow, GraphNode } from "@/types/data";
import { useState, useRef, useMemo, useEffect } from 'react'
import { Cosmograph } from '@cosmograph/react'

const data: DataRow[] = (rawData as RawRow[]).map(row => ({
    ...row,
    source: String(row.source),
    target: String(row.target),
}));
const labelColors: Record<string, string> = {
    person: "brown",
    work: "#3366CC",
    instance: "cyan",
    place: "darkgreen",
};

function Legend({
    enabledTypes,
    toggleType,
}: {
  enabledTypes: Record<string, boolean>,
  toggleType: (type: string) => void
}) {
  return (
    <div className="absolute my-20 top-0 right-0 bg-gray shadow p-4 rounded text-sm space-y-2 z-10">
      {Object.entries(labelColors).map(([label, color]) => (
        <div key={label} className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={enabledTypes[label]}
            onChange={() => toggleType(label)}
          />
          <span className="w-4 h-4 rounded-full" style={{ backgroundColor: color }} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function buildGraph(data: DataRow[]) {
    const nodes = new Map<string, GraphNode>();
    const links: DataRow[] = [];
    const degree = new Map<string, number>();

    for (const row of data) {
        const source_colour = labelColors[row.source_type] || "#cccccc";
        const target_colour = labelColors[row.target_type] || "#cccccc";

        nodes.set(row.source, {
            id: row.source,
            label: row.source_label,
            type: row.source_type,
            colour: source_colour,
        });
        nodes.set(row.target, {
            id: row.target,
            label: row.target_label,
            type: row.target_type,
            colour: target_colour,
        });

        links.push({
            source: row.source,
            target: row.target,
            direction: false,
            source_label: row.source_label,
            source_type: row.source_type,
            target_label: row.target_label,
            target_type: row.target_type,
            forward: row.forward,
            reverse: row.reverse
        });

        // Count degrees
        degree.set(row.source, (degree.get(row.source) ?? 0) + 1);
        degree.set(row.target, (degree.get(row.target) ?? 0) + 1);
    }

    // Assign sizes
    for (const node of nodes.values()) {
        //node.size = 4 + Math.log2((degree.get(node.id) ?? 1) + 1); //logarithmic scale for size
        node.size = 4 + Math.sqrt(degree.get(node.id) ?? 1);
        //node.size = Math.min(20, 10 + Math.sqrt(degree.get(node.id) ?? 1)); // capped size

    }

    return { nodes: [...nodes.values()], links };
}

export default function Explorer() {
    const cosmographRef = useRef(null)
    const graphRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
    graphRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);

    const [results, setResults] = useState<DataRow[]>([]);
    const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
    const [connectedDescriptions, setConnectedDescriptions] = useState<string[]>([]);

    const selectedType = "work";

    const [enabledTypes, setEnabledTypes] = useState<Record<string, boolean>>(
        () =>
            Object.fromEntries(
                Object.keys(labelColors).map(type => [type, type === selectedType])
            )
    );

    const handleResults = (newResults: DataRow[]) => {
        setResults(newResults);
        graphRef.current?.scrollIntoView({ behavior: 'smooth' });
        setSelectedNode(null);
        setConnectedDescriptions([]);
    };
    const playPause = () => {
        if ((cosmographRef.current as any)?.isSimulationRunning) {
            (cosmographRef.current as any)?.pause();
        } else {
            (cosmographRef.current as any)?.start();
        }
    }
    const fitView = () => {
        (cosmographRef.current as any)?.fitView();
    }
    const resetView = () => {
        handleResults([]);
    }

    const handleNodeClick = (node: GraphNode) => {
        setSelectedNode(node);
        const connected = data
            .filter(link => link.source === node?.id || link.target === node?.id)

        const relations_list = connected.map(link => {
                if (link.source === node?.id) {
                    return `${link.forward} <strong>${link.target_label}</strong>`;
                } else {
                    return `${link.reverse} <strong>${link.source_label}</strong>`;
                }
        }).sort((a, b) => a.localeCompare(b));

        setConnectedDescriptions(relations_list);

    };


    const graph = useMemo(() => buildGraph(results.length > 0 ? results : data), [results]);
    const graphNodeMap = useMemo(
        () => Object.fromEntries(graph.nodes.map(n => [n.id, n])),
        [graph.nodes]
    );

    const filteredGraph = useMemo(
        () => ({
            nodes: graph.nodes.filter(node => enabledTypes[node.type]),
            links: graph.links.filter(
                link =>
                    enabledTypes[graphNodeMap[link.source].type] &&
                    enabledTypes[graphNodeMap[link.target].type]
            ),
        }),
        [graph.nodes, graph.links, graphNodeMap, enabledTypes]
    );
    const toggleType = (type: string) => {
        setEnabledTypes(prev => ({ ...prev, [type]: !prev[type] }));
    };

    return (
        <div className="mt-2 relative left-1/2 right-1/2 -mx-[50vw] w-[99.5vw]" >
            < SearchBar data={data} onResults={handleResults} />
            {results.length > 0 && (
                <p className="flex max-w-4xl mx-auto gap-2 font-semibold">
                    Found {results.length} matches.
                    <button
                        onClick={() => {
                            const csvContent = results.map(row => Object.values(row).join(",")).join("\n");
                            const blob = new Blob([csvContent], { type: "text/csv" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = "results.csv";
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                        className="bg-green-600 text-white rounded px-1">
                        Export
                    </button>
                </p>
            )}
            <div ref={graphRef}>

                <Cosmograph
                    ref={cosmographRef}
                    nodes={filteredGraph.nodes}
                    links={filteredGraph.links}
                    linkArrows={false}
                    nodeColor={(d) => d.colour ?? "#cccccc"}
                    nodeLabelColor={(d) => d.colour ?? "#cccccc"}
                    nodeLabelAccessor={(d: GraphNode) => d.label}
                    linkWidth={2}
                    className="w-full"
                    scaleNodesOnZoom={false}
                    focusedNodeRingColor={'yellow'}
                    nodeSize={(d: GraphNode) => d.size ?? 5}
                    simulationGravity={0.25}
                    simulationRepulsion={1}
                    simulationRepulsionTheta={1.15}
                    simulationLinkDistance={10}
                    simulationFriction={0.85}
                    backgroundColor="#002b36"
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    onLabelClick={handleNodeClick}
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    onClick={handleNodeClick}

                />
                <div className="absolute mx-5 my-20  top-5 left-0 flex space-x-2 z-10 ">
                    <button
                        onClick={resetView}
                        className="px-4 py-1 bg-white border border-gray-300 text-gray-800 rounded bg-yellow-500 hover:bg-yellow-300"
                    >
                        Reset
                    </button>
                    <button
                        onClick={playPause}
                        className="px-4 py-1 bg-white border border-gray-300 text-gray-800 rounded hover:bg-gray-100"
                    >
                        Pause/Play
                    </button>
                    <button
                        onClick={fitView}
                        className="px-4 py-1 bg-white border border-gray-300 text-gray-800 rounded hover:bg-gray-100"
                    >
                        Fit
                    </button>

                    <div className="absolute left-0 top-full mt-1 w-64 text-white p-3 rounded shadow-lg text-xs">
                        {selectedNode ? (
                            <div>
                                <h2 className="text-lg font-bold mb-2">{selectedNode.label}</h2>
                                <p><strong>ID:</strong>{selectedNode.id} ({selectedNode.type})</p>
                                <ul className="list-disc pl-5">
                                    {connectedDescriptions.map((desc, index) => (
                                        <li key={index} dangerouslySetInnerHTML={{ __html: desc }} />
                                    ))}
                                </ul>
                            </div>
                        ) : (
                            <p>Select a node to see details</p>
                        )}
                    </div>

                </div>
                <Legend enabledTypes={enabledTypes} toggleType={toggleType} />
            </div>
        </div >
    );
}
