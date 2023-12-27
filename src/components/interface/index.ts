export type TToken = string;

export interface BearerParams {
    token: TToken
}

export type TPagination = {
    CurrentPage?: number,
    PageSize?: number,
    SortBy?: string,
    SortOrder?: string, // 0, 1
    FromDate?: number,
    ToDate?: number
}