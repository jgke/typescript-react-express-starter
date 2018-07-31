export type HTTPMethod = 'GET' | 'POST' | 'PUT';

export enum HTTPStatus {
    OK = 200,
    BadRequest = 400,
    InternalServerError = 500
}

export interface ApiResponseValue<Res> {
    status: HTTPStatus;
    message: Res;
}

export type ApiResponse<Res> = Promise<ApiResponseValue<Res>>;

// tslint:disable:no-any

function num(): number {
    return ((p: any) => typeof p === 'number') as any as number;
}

function str(): string {
    return ((p: any) => typeof p === 'string') as any as string;
}

function obj<T>(p: T): T {
    return ((inner: T) =>
            Object.keys(p).every(
                (checkme: string) =>
                    (p as any)[checkme]((inner as any)[checkme]))
    ) as any as T;
}

// This could be TS extends any[] but since we can take a maximum of one parameter
// for a HTTP method (the body) let's restrict this to one
function fun<T, TS extends [any?]>(returns: T, ...takes: TS) {
    return ((...t: TS) => takes.every((validator, i) => validator(t[i]))) as any as (...t: TS) => ApiResponse<T>;
}

// tslint:enable:no-any

export const apiObject = {
    str: {
        GET: fun(str()),
        POST: fun(str(), obj({message: str()}))
    },
    num: {
        nested: {
            GET: fun(num()),
            PUT: fun(num(), obj({msg: num()}))
        }
    },
};

export type ApiMap = typeof apiObject;
