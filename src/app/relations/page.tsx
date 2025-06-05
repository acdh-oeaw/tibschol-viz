"use client";
import SearchBar from "../components/Search";
import rawData from "../../data/relations.json";
import { useState, useRef, useMemo } from 'react'
import { DataRow, GraphNode } from "@/types/data";

const data: DataRow[] = rawData as DataRow[];

export default function WordTree() {
    const [results, setResults] = useState<DataRow[]>([]);
    const handleResults = (newResults: DataRow[]) => {
        setResults(newResults);
    };

    return (

        <div className="mt-2 relative left-1/2 right-1/2 -mx-[50vw] w-[99.5vw]" >
            < SearchBar data={data} onResults={handleResults} />
            {results.length > 0 && (

                <p className="flex max-w-4xl mx-auto gap-2 font-semibold">
                    Found {results.length} matches.
                </p>
            )}
        </div>
    );
}
