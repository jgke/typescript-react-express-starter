export type root = () => string;

export type HTTPMethod = 'GET' | 'POST' | 'PUT';

export enum HTTPStatus {
    OK = 200,
    InternalServerError = 500,
}

export interface ApiResponseValue<Res> {
    status: HTTPStatus;
    message: Res;
}

export type ApiResponse<Res> = Promise<ApiResponseValue<Res>>;

export type ApiHandler<RequestType, ResponseType> = (request: RequestType) => ApiResponse<ResponseType>;

export type ApiMethod<Method, RequestType, ResponseType> = [string, Method, ApiHandler<RequestType, ResponseType>];

// tslint:disable:prefer-method-signature
export interface ApiMap {
    '/api': {
        GET: {
            fn: () => ApiResponse<string>;
            method: 'GET'; path: '/api';
        };
        POST: {
            fn: (p: { message: string }) => ApiResponse<string>;
            method: 'POST'; path: '/api';
        };
    };
    '/other': {
        GET: {
            fn: () => ApiResponse<number>;
            method: 'GET'; path: '/other';
        };
        PUT: {
            fn: (p: { msg: number }) => ApiResponse<number>;
            method: 'PUT'; path: '/other';
        };
    };
}
