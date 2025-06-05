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
    start_date_from?: string | Date;
    start_date_to?: string | Date;
    start_date_sort?: string | Date;
    end_date_from?: string | Date;
    end_date_to?: string | Date;
    end_date_sort?: string | Date;
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
  start_date_from?: string | Date;
  start_date_to?: string | Date;
  start_date_sort?: string | Date;
  end_date_from?: string | Date;
  end_date_to?: string | Date;
  end_date_sort?: string | Date;
  topics?: string[];
};
