"use client";

import { useState } from "react";
import { DataRow } from "@/types/data";

type SearchBarProps = {
  data: DataRow[];
  onResults: (results: DataRow[], query: string) => void;
};

export default function Search({ data, onResults }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    const trimmed = query.trim();
    if (trimmed.length === 0) {
      onResults([], query);
      return;
    }

    const normalize = (str: string): string =>
      str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const normalizedQuery = normalize(trimmed);

    const searchResults = data.filter(row =>
      Object.values(row).some(value =>
        normalize(String(value)).includes(normalizedQuery)
      )
    );

    onResults(searchResults, query);
    };
    return (
        <div className="flex w-full max-w-4xl mx-auto gap-2 mb-2">
            <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                }}
                placeholder="Enter search term"
                className="flex-grow border p-2"
            />
            <button
                onClick={handleSearch}
                className="w-24 bg-blue-600 text-white px-4 py-2"
            >
                Go
            </button>
        </div>
    );
}
