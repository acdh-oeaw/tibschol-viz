// types/data.ts
export type DataRow = {
    source: string,
    target: string,
    forward: string,
    reverse: string,
    source_type: string
    source_label:string,
    target_type: string,
    target_label: string
};

export interface GraphNode {
    id: string;
    label: string;
    type: string;
    colour: string;
    size: number;
}
