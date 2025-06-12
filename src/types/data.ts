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
    direction?: boolean;
    start_date_from?: string | Date| null;
    start_date_to?: string | Date| null;
    start_date_sort?: string | Date| null;
    end_date_from?: string | Date| null;
    end_date_to?: string | Date| null;
    end_date_sort?: string | Date| null;
    topics?: string[];
};

export interface GraphNode {
    id: string;
    label: string;
    type: string;
    colour: string;
    size?: number;
};

export type RawRow = {
  source: string | number;
  target: string | number;
  forward: string,
  reverse: string,
  source_type: string
  source_label:string,
  target_type: string,
  target_label: string
  direction?: boolean;
  start_date_from?: string | Date| null;
  start_date_to?: string | Date| null;
  start_date_sort?: string | Date| null;
  end_date_from?: string | Date| null;
  end_date_to?: string | Date| null;
  end_date_sort?: string | Date| null;
  topics?: string[];
};

export type WorkRow = {
  name: string;
  pk: string;
  alternative_names: string;
  external_links: string;
  comments: string;
  review: boolean;
  notes: string;
  author: string;
  date_of_composition: string| null;
  topics: string[];
}

export type RawWorkRow = {
  name: string;
  pk: string| number;
  alternative_names: string;
  external_links: string;
  comments: string;
  review: boolean;
  notes: string;
  author: string;
  date_of_composition: string| null;
  topics: string[];
}
