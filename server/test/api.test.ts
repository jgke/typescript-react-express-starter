import {} from 'jest';
import * as supertest from 'supertest';
import {apiObject} from "../src/api/base";

const request = supertest('http://localhost:3000');

describe('GET /api', () => {
    it('should return 200 OK', () =>
        request
            .get('/api/api')
            .expect(200));
});

describe('Check api typing', () => {
    it('should be correctly typed', () =>
        Object.keys(apiObject).every(path =>
            Object.keys(apiObject[path]).every(method => (
                apiObject[path][method].method === method &&
                apiObject[path][method].path === path) ||
                fail(`Api at ${path}:${method} doesn't have equal paths and methods`) ||
                false))
            ? undefined
            : fail("Api is not correctly typed")
    )
});