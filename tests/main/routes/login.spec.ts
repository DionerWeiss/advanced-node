import { PgUser } from '@/infra/repos/postgres/entities'
import { app } from '@/main/config/app'
import { UnauthorizedError } from '@/application/errors'
import { makeFakeDb } from '@/tests/infra/repos/postgress/mocks'

import { IBackup } from 'pg-mem'
import request from 'supertest'
import { PgConnection } from '@/infra/repos/postgres/helpers'

describe('Login Routes', () => {
  describe('POST /login/facebook', () => {
    let backup: IBackup
    let connection: PgConnection
    const loadUserSPy = jest.fn()

    jest.mock('@/infra/gateways/facebook-api', () => ({
      FacebookApi: jest.fn().mockReturnValue({
        loadUser: loadUserSPy
      })
    }))

    beforeAll(async () => {
      connection = PgConnection.getInstance()
      const db = await makeFakeDb([PgUser])
      backup = db.backup()
    })

    beforeEach(() => {
      backup.restore()
    })

    afterAll(async () => {
      await connection.disconnect()
    })

    it('should return 200 with AccessToken', async () => {
      loadUserSPy.mockResolvedValueOnce({ facebookId: 'any_id', name: 'any_name', email: 'any_email' })

      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'valid_token' })

      expect(status).toBe(200)
      expect(body.accessToken).toBeDefined()
    })

    it('should return 401 with UnauthorizedError', async () => {
      const { status, body } = await request(app)
        .post('/api/login/facebook')
        .send({ token: 'invalid_token' })

      expect(status).toBe(401)
      expect(body.error).toBe(new UnauthorizedError().message)
    })
  })
})
