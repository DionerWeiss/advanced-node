import { FacebookApi, AxiosHttpClient } from '@/infra/gateways'
import { env } from '@/main/config/env'

describe('Facebook Api Integration Tests', () => {
  let axiosClient: AxiosHttpClient
  let sut: FacebookApi

  beforeEach(() => {
    axiosClient = new AxiosHttpClient()
    sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )
  })

  it('should return a Facebook User if token is valid', async () => {
    const fbUser = await sut.loadUser({ token: env.facebookApi.token })
    expect(fbUser).toEqual({
      facebookId: '102059075537688',
      email: 'eymehrenbs_1629658496@tfbnw.net',
      name: 'Dioner Teste'
    })
  })

  it('should return undefined if token is invalid', async () => {
    const fbUser = await sut.loadUser({ token: 'invalid' })
    expect(fbUser).toBeUndefined()
  })
})
