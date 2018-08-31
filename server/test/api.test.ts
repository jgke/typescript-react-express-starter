import {} from 'jest';
import * as supertest from 'supertest';

const request = supertest('http://localhost:3000');

describe('GET /customers', () => {
    it('should return 200 OK', () =>
        request
            .get('/api/customers')
            .expect(200));
});
