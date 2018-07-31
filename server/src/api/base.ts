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

function zero<T>(returns: T) {
    return (() => true) as any as () => ApiResponse<T>;
}

function one<R, T>(takes: R, returns: T) {
    return ((t: any) => (takes as any)(t)) as any as (p: R) => ApiResponse<T>;
}

// tslint:enable:no-any

export const apiObject = {
    str: {
        GET: zero(str()),
        POST: one(obj({message: str()}), str())
    },
    num: {
        nested: {
            GET: zero(num()),
            PUT: one(obj({msg: num()}), num())
        }
    },
};

export type ApiMap = typeof apiObject;
