export interface QueryArgs {
    paginator?: number;
    ids?: string[];
    tagFilters?: Record<string, any>;
    owners?: string[];
    cursor?: string;
    gateway: string;
    reduxCursor?: string;
    cursorObjectKey?: string;
}

export interface GQLResponse {
    data: any[];
    count: number;
    nextCursor: string | null;
    previousCursor: null;
}

export interface Status {
    success: boolean;
    processId: string | null;
    message: string;
}

export type MessageResult = {
    Output: any;
    Messages: any[];
    Spawns: any[];
    Error?: any;
};