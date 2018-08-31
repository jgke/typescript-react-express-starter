export type HTTPMethod = 'GET' | 'POST' | 'PUT';

export enum HTTPStatus {
    OK = 200,
    BadRequest = 400,
    InternalServerError = 500
}

export interface ApiResponse<Res> {
    message: Res;
}

// tslint:disable:no-any
// tslint:disable:max-line-length

const num = ((p: any) => typeof p === 'number') as any as number;
const str = ((p: any) => typeof p === 'string') as any as string;

function fun<T, TS extends [any?, any?]>(returns: T, ...takes: TS) {
    return ((...t: TS) => takes.every((validator, i) => (validator)(t[i]))) as any as (...t: TS) => Promise<T>;
}

function optional<T>(param: T) {
    return ((t?: T) => (t === undefined) || (param as any)(t)) as any as (T | undefined);
}

function arr<T>(param: T) {
    return ((p: T[]) => (p.every(t => (param as any)(t)))) as any as T[];
}

function obj<T extends object>(p: T) {
    return ((inner: T) => (typeof inner === 'object') &&
        Object.keys(p).every(
            (checkme: string) => (p as any)[checkme]((inner as any)[checkme]))
    ) as any as T;
}

// tslint:enable:no-any

const customer = obj({id: num, name: str});
export type Customer = typeof customer;
const partialCustomer = obj({id: optional(num), name: optional(str)}) as Partial<Customer>;
export const apiObject = {
    customers: {
        GET: fun(arr(customer)),
        POST: fun(customer, str)
    },
    search: {
        GET: fun(arr(customer), partialCustomer)
    },
};

export type ApiMap = typeof apiObject;
