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
        const tokens = lowerQuery.split(/\s+/);
        const lastToken = tokens[tokens.length - 1];

        const matches = data.flatMap(item => {
            const fields = [
                item.forward,
                item.reverse ?? "",
                item.source_label ?? "",
                item.target_label ?? "",
            ];
            return fields.filter(f =>
                f.toLowerCase().includes(lastToken)
            );
        });

        const uniqueMatches = Array.from(new Set(matches)).slice(0, 20);
        setSuggestions(uniqueMatches);
    }, [query, data]);

    const handleSelect = (value: string) => {
        const tokens = query.trim().split(/\s+/);
        tokens[tokens.length - 1] = value;
        setQuery(tokens.join(" ") + " ");
        setShowSuggestions(false);
    };

const handleSearch = () => {
    const normalize = (str: string) =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    const tokens = query.trim().split(/\s+/);
    if (tokens.length === 0) {
        onResults([], query);
        return;
    }

    // Parse phrases and operators
    const phrases: string[] = [];
    const operators: string[] = [];
    let currentPhrase: string[] = [];

    for (const token of tokens) {
        const upper = token.toUpperCase();
        if (["AND", "OR", "NOT"].includes(upper)) {
            if (currentPhrase.length > 0) {
                phrases.push(currentPhrase.join(" "));
                currentPhrase = [];
            }
            operators.push(upper);
        } else {
            currentPhrase.push(token);
        }
    }
    if (currentPhrase.length > 0) {
        phrases.push(currentPhrase.join(" "));
    }

    // Now apply logic to each row
    const results = data.filter(row => {
        const text = normalize(Object.values(row).join(" "));

        let result = operators[0] === "NOT" ? true : false;

        for (let i = 0; i < phrases.length; i++) {
            const phrase = normalize(phrases[i]);
            const op = operators[i - 1] || "OR"; // default to OR
            const contains = text.includes(phrase);

            if (op === "OR") {
                result = result || contains;
            } else if (op === "AND") {
                result = result && contains;
            } else if (op === "NOT") {
                result = result && !contains;
            }
        }

        return result;
    });

    onResults(results, query);
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
