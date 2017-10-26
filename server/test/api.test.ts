import {} from 'jest';
import * as supertest from 'supertest';

const request = supertest('http://localhost:3000');

describe('GET /api', () => {
  it('should return 200 OK', () =>
    request
      .get('/api/api')
      .expect(200));
});
