export type PredicatePart = {
    and?: PredicatePart[];
    or?: PredicatePart[];
    not?: PredicatePart[];
    gt?: [string, number];
    gte?: [string, number];
    lt?: [string, number];
    lte?: [string, number];
    [key: string]: unknown;
};
