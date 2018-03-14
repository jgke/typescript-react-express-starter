import {ApiResponse, HTTPStatus} from '../api/base';

function makeResponse<Res>(status: HTTPStatus, message: Res): ApiResponse<Res> {
    return new Promise(resolve => {
        resolve({status, message});
    });
}

let data = '';

export function getApi() {
    return makeResponse(HTTPStatus.OK, data);
}

export function postApi(msg: {message: typeof data}) {
    data = msg.message;

    return makeResponse(HTTPStatus.OK, data);
}

let num = 0;

export function getNumber() {
    return makeResponse(HTTPStatus.OK, num);
}

export function postNumber(msg: {msg: typeof num}) {
    num = msg.msg;

    return makeResponse(HTTPStatus.OK, num);
}
