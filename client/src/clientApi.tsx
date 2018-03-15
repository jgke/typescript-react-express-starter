import {ApiMap, apiObject, ApiResponse, ApiResponseValue, HTTPMethod, HTTPStatus} from './base';

const baseUrl = 'http://localhost:3000/';

export function doApiCall<Req>(path: string, requestBody: Req, httpMethod: HTTPMethod): Promise<Response> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const method = httpMethod;
    const body = JSON.stringify(requestBody);

    return fetch(baseUrl + path, {headers, method, body});
}

export function apiCallWrapper<Req, Res>(path: string, method: HTTPMethod, body: Req): ApiResponse<Res> {
    return doApiCall<Req>(path, body, method)
        .then(val => val.json()
            .then((message: Res) => new Promise<ApiResponseValue<Res>>(
                resolve => {
                    const response: ApiResponseValue<Res> = {status: val.status as HTTPStatus, message};
                    resolve(response);
                })
            ));
}

// tslint:disable:no-any

/* Wrap the argument object so that path.method.fn makes requests to the server */
function wrapApi(prefix: string[], api: any): ApiMap {
    const wrapped: any = {};

    Object.keys(api).forEach((path: string) => {
        wrapped[path] = {};
        if (typeof api[path] !== 'object') {
            const method: HTTPMethod = path as HTTPMethod;
            wrapped[path] = (body: any) => apiCallWrapper(prefix.join('/'), method, body);
        } else {
            wrapped[path] = wrapApi(prefix.concat([path]), api[path]);
        }
    });

    return wrapped;
}

// tslint:enable:no-any

export const apiMap = wrapApi(['api'], apiObject);
