import { Request } from 'express';

export interface IMetaPaginator {
    total: number,
    currentPage: number,
    lastPage: number,
    perPage: number,
}

export interface IPaginatorResponse {
    items: any[],
    meta: IMetaPaginator
}

export class Paginator {
    readonly limit: number;
    readonly offset: number;
    readonly currentPage: number;

    constructor(private request: Request, options = { limit: 20}) {
        const { query } = request;
        this.limit = Number(query.limit) || options.limit;
        this.currentPage =  Number(query.page) > 0 ? Number(query.page) : 1;
        this.offset = this.limit * (this.currentPage - 1);
    }

    getOptionQueryString() {
        return { limit: this.limit, offset: this.offset, currentPage: this.currentPage };
    }

    buildResponse(total, data): IPaginatorResponse {
        return {
            items: data,
            meta: {
                total,
                perPage: this.limit,
                currentPage: this.currentPage,
                lastPage: Math.ceil(total / this.limit),
            }
        }
    }
}