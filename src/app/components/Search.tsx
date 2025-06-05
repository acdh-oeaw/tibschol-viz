"use client";

import { useState, useEffect } from "react";
import { DataRow } from "@/types/data";

type SearchBarProps = {
    data: DataRow[];
    onResults: (results: DataRow[], query: string) => void;
};

export default function Search({ data, onResults }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    useEffect(() => {
        if (!query) {
            setSuggestions([]);
            return;
        }
        const lowerQuery = query.toLowerCase();

        // Collect all matching strings from all fields
        const matches = data.flatMap(item => {
            const fields = [
                item.forward,
                item.reverse ?? "",
                item.source_label ?? "",
                item.target_label ?? "",
            ];
            return fields.filter(f => f.toLowerCase().includes(lowerQuery));
        });

        // Deduplicate strings
        const uniqueMatches = Array.from(new Set(matches)).slice(0, 10);

        // Convert back to DataRow-like objects with only forward property (or just strings)
        // For simplicity, use strings as suggestions here:
        setSuggestions(uniqueMatches);
    }, [query, data]);

    const handleSelect = (value: string) => {
        setQuery(value);
        setShowSuggestions(false);
    };

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
        setShowSuggestions(false);

    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSearch();
        }
    };
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQuery(e.target.value);
        setShowSuggestions(true);
    };


    return (
        <div className="flex flex-col w-full max-w-4xl mx-auto gap-2 mb-2 relative">
            <div className="flex">
                <input
                    type="text"
                    value={query}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => query && setShowSuggestions(true)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                    placeholder="Enter search term"
                    className="flex-grow border p-2"
                    autoComplete="off"
                />
                <button
                    onClick={handleSearch}
                    className="w-24 bg-blue-600 text-white px-4 py-2"
                >
                    Go
                </button>
            </div>

            {showSuggestions && suggestions.length > 0 && (
                <ul
                    className="absolute top-full left-0 right-0 bg-white border max-h-40 overflow-auto z-50"
                    style={{ listStyle: "none", margin: 0, padding: 0 }}
                >
                    {suggestions.map((s) => (
                        <li
                            key={s}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onMouseDown={() => handleSelect(s)}
                        >
                            {s}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
