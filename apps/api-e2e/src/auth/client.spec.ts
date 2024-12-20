import request from 'supertest';

import { INestApplication } from '@nestjs/common';

import { User } from '@owl-app/lib-contracts';
import { destroy } from '@owl-app/testing';
import { IJwtTokenService, Token } from '@owl-app/lib-api-core/passport/jwt-token.interface';

import { createTest } from '../create-test';

describe('Client (e2e)', () => {
  let app: INestApplication;
  let jwtTokenService: IJwtTokenService<User>;
  let token: Token;

  beforeAll(async () => {
    app = await createTest('client', );
    jwtTokenService = app.get<IJwtTokenService<User>>(IJwtTokenService);
    token = await jwtTokenService.getJwtToken('role_admin@wp.pl');
    console.log(token);
  });

  afterAll(async () => {
    await destroy(app);
  });

  it('should list clients', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/v1/clients')
      .set("Cookie", `access_token=${token.token}`)
      .set('Accept', 'application/json');

      console.log(response.body);

    expect(response.status).toEqual(200);
  });

  it('should create client', async () => {
    const partialBody = {
      name: 'test'
    }

    const response = await request(app.getHttpServer())
      .post('/api/v1/clients')
      .set("Cookie", `access_token=${token.token}`)
      .set('Accept', 'application/json')
      .send(partialBody)

      console.log(response.body);
      expect(response.status).toEqual(201);
      expect(response.body).toMatchObject({
        ...partialBody,
        email: null,
        address: null,
        description: null,
        id: response.body.id,
        createdAt: response.body.createdAt,
        updatedAt: response.body.updatedAt,
        archived: false
      });
  });
});
