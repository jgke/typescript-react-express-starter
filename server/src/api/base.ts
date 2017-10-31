export type root = () => string;

export type HTTPMethod = 'GET' | 'POST' | 'PUT';

export enum HTTPStatus {
    OK = 200,
    InternalServerError = 500
}

export interface ApiResponseValue<Res> {
    status: HTTPStatus;
    message: Res;
}

export type ApiResponse<Res> = Promise<ApiResponseValue<Res>>;

export type ApiHandler<RequestType, ResponseType> = (request: RequestType) => ApiResponse<ResponseType>;

export type ApiMethod<Method, RequestType, ResponseType> = [string, Method, ApiHandler<RequestType, ResponseType>];

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
export interface ApiMap {
    '/api': {
        GET: {
            fn: () => ApiResponse<string>;
            // In order to get type checking working, these need to be duplicated
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
