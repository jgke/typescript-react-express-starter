import {ApiMap, apiObject, ApiResponse, HTTPMethod} from './base';

const baseAddress = 'http://localhost:3000';

function apiCall<QueryParams, Body, Res>(path: string, queryParams: QueryParams,
                                         method: string, body: Body): Promise<Res> {
    const address = new URL(`${baseAddress}/${path}`);
    Object.keys(queryParams || {})
        .forEach(key => address.searchParams.append(key, queryParams[key]));

    return fetch(address.toString(), {body: body && JSON.stringify({message: body}),
                                      method,
                                      headers: { 'Content-Type': 'application/json'}})
        .then(val => val.json())
        .then((message: ApiResponse<Res>) => new Promise<Res>(resolve => resolve(message.message)));
}

// tslint:disable:no-any

/* Wrap the argument object so that path.method.fn makes requests to the server */
function wrapApi(prefix: string[], api: any): ApiMap {
    const wrapped: any = {};

    Object.keys(api).forEach((path: string) => {
        wrapped[path] = {};
        if (typeof api[path] !== 'object') {
            const method: HTTPMethod = path as HTTPMethod;
            if (method === 'GET') {
                wrapped[path] = (params: any) =>
                    apiCall(prefix.join('/'), params, method, undefined);
            } else {
                wrapped[path] = (body: any, queryParams: any = {}) =>
                    apiCall(prefix.join('/'), queryParams, method, body);
            }
        } else {
            wrapped[path] = wrapApi(prefix.concat([path]), api[path]);
        }
    });

    return wrapped;
}

// tslint:enable:no-any

export const apiMap = wrapApi(['api'], apiObject);
