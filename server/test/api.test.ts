import {} from 'jest';
import * as supertest from 'supertest';

const request = supertest('http://localhost:3000');

describe('GET /str', () => {
    it('should return 200 OK', () =>
        request
            .get('/api/str')
            .expect(200));
});
