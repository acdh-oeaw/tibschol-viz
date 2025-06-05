"use client";
import { useState } from "react";
import { DataRow,RawRow } from "@/types/data";
import SearchBar from "../components/Search";
import rawData from "../../data/relations.json";
import { useEffect, useRef } from 'react';

const data: DataRow[] = (rawData as RawRow[]).map(row => ({
    ...row,
    source: String(row.source),
    target: String(row.target),
}));

interface WordTreeChart {
    draw: (data: google.visualization.DataTable, options: object) => void;
}


declare global {
    interface Window {
    google: typeof google;
  }
}

function WordTree({ data, rootWord }: { data: string[][]; rootWord: string }) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!data.length || !rootWord) return;

    const loadGoogleCharts = () => {
      window.google.charts.load("current", { packages: ["wordtree"] });
      window.google.charts.setOnLoadCallback(drawChart);
    };


      const drawChart = () => {
          const chartData = window.google.visualization.arrayToDataTable([
              ["Phrases"],
              ...data,
          ]);

     const chart = new (window.google.visualization as unknown as {
         WordTree: new (element: HTMLElement) => WordTreeChart;
        }).WordTree(chartRef.current!);
     chart.draw(chartData, {
         wordtree: {
             backgroundColor: "#002b36",
             colors: ['#2aa198', '#2aa198', '#2aa198'],
             format: "implicit",
             type: "double",
             word: rootWord,
             wordSeparator: /(?=<)|(?<=>)/g
         },
     });
      };

    if (!window.google || !window.google.charts) {
      const script = document.createElement("script");
      script.src = "https://www.gstatic.com/charts/loader.js";
      script.onload = loadGoogleCharts;
      document.head.appendChild(script);
    } else {
      loadGoogleCharts();
    }
  }, [data, rootWord]);

  return (
        <div
            ref={chartRef}
            className="w-full h-[80vh]"
            style={{
                backgroundColor: "#002b36",
                width: "100vw",  // Full viewport width
                padding: "1rem", // Optional: adds spacing
                boxSizing: "border-box", // Ensures padding doesn't shrink content
            }}
        />
    );

}




export default function Relations() {
  const [rootWord, setRootWord] = useState("");

  const handleResults = (_: DataRow[], query:string) => {
        setRootWord(`<${query.trim()}>`);
    }


    return (
        <div className="mt-2 relative left-1/2 right-1/2 -mx-[50vw] w-[99.5vw]" >
            <SearchBar data={data} onResults={handleResults}  />
            <div
                className="mt-2 relative left-1/2 right-1/2 -mx-[50vw] w-[100vw] h-screen"
            >
                <WordTree
                    data={data.flatMap(row => [
                        [`<${row.source_label}> <${row.forward}> <${row.target_label}>`],
                        [`<${row.target_label}> <${row.reverse}> <${row.source_label}>`],
                    ])}
                    rootWord={rootWord || "<is quoted without name by>"}
                />
            </div>


        </div >
    );
}
