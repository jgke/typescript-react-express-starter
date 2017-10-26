import { ApiMap, ApiResponse, ApiResponseValue, HTTPMethod, HTTPStatus } from '../../server/src/api/base';

const baseUrl = 'http://localhost:3000/api';

export function doApiCall<Req>(path: string, requestBody: Req, httpMethod: HTTPMethod): Promise<Response> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const method = httpMethod;
    const body = JSON.stringify(requestBody);

    return fetch(baseUrl + path, { headers, method, body });
}

export function apiCallWrapper<Req, Res>(
    path: string, method: HTTPMethod, body: Req): ApiResponse<Res> {

    return doApiCall<Req>(path, body, method)
        .then(val => val.json()
            .then((message: Res) => new Promise<ApiResponseValue<Res>>(
                resolve => {
                    const response: ApiResponseValue<Res> = { status: val.status as HTTPStatus, message };
                    resolve(response);
                })
            ));
}

function wrapApi(simpleApi: ApiMap): ApiMap {
    // tslint:disable-next-line:no-any
    const api: any = {};

    Object.keys(simpleApi).forEach((path: keyof ApiMap) => {
        api[path] = {};
        Object.keys(simpleApi[path]).forEach((method: HTTPMethod) => {
            // tslint:disable-next-line:no-any
            api[path][method] = { fn: (p: any) => apiCallWrapper(path, method, p) };
        });
    });

    return api;
}

// tslint:disable:no-any
const GET: any = {};
const POST: any = {};
// tslint:enable:no-any

export const apiMap: ApiMap = wrapApi({
    '/api': { GET, POST },
    '/other': { GET, POST }
});
