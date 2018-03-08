// tslint:disable
function str(): string {
    return ((p: any) => typeof p === 'string') as any as string;
}

function num(): number {
    return ((p: any) => typeof p === 'number') as any as number;
}

function obj<T>(p: T): T {
    return ((inner: T) => console.log(inner, p) ||
            Object.keys(p).every(
                (checkme: keyof T) => (p as any)[checkme](inner[checkme]))
    ) as any as T;
}

function zero<T>(returns: T) {
    return (() => true) as any as () => ApiResponse<T>
}

function one<R, T>(takes: R, returns: T) {
    return ((t: any) => (takes as any)(t)) as any as (p: R) => ApiResponse<T>
}

// tslint:enable

export type root = () => string;

export type HTTPMethod = 'GET' | 'POST' | 'PUT';

export enum HTTPStatus {
    OK = 200,
    Arg = 400,
    InternalServerError = 500
}

export interface ApiResponseValue<Res> {
    status: HTTPStatus;
    message: Res;
}

export type ApiResponse<Res> = Promise<ApiResponseValue<Res>>;

/**
 * The whole application API goes here. It should be in the form
 * { [path: string]: {
 *   [method: HTTPMethod]:
 *     fn: RequestType => ApiResponse<ResponseType>,
 *     method: HTTPMethod, path: string
 *   }
 * }
 */
// tslint:disable:prefer-method-signature
export const apiObject = {
    '/api': {
        GET: {
            fn: zero(str()),
            method: 'GET' as 'GET',
            path: '/api' as '/api'
        },
        POST: {
            fn: one(obj({message: str()}), str()),
            method: 'POST' as 'POST',
            path: '/api' as '/api'
        }
    },
    '/other': {
        GET: {
            fn: zero(num()),
            method: 'GET' as 'GET',
            path: '/other' as '/other'
        },
        PUT: {
            fn: one(obj({msg: num()}), num()),
            method: 'PUT' as 'PUT',
            path: '/other' as '/other'
        }
    },
};

export type ApiMap = typeof apiObject;
