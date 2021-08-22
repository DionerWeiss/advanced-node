import { FacebookApi } from '@/infra/apis'
import { AxiosHttpClient } from '@/infra/http'
import { env } from '@/main/config/env'

describe('Facebook Api Integration Tests', () => {
  it('should return a Facebook User if token is valid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )

    const fbUser = await sut.loadUser({ token: 'EAAD6DuQj45EBAJAS2kF7SwoCZBPCFCUNf3FDaBfHfQSUEiJf8XZASRyOBuStEOImhxl9POYRFinhxGGLxNPB3vTLn4OTjAIvUusnPwyzxOZCRydo5wQCIRZB0wfdD2P3rUJduDW8zNlZAhLaQBd0sMrCG2laddn1l0rUzSw879iCd1vZB6MZCn9dRHR13sciIVRZCHY7bepKkxe80FmiqhJ2' })
    expect(fbUser).toEqual({
      facebookId: '102059075537688',
      email: 'eymehrenbs_1629658496@tfbnw.net',
      name: 'Dioner Teste'
    })
  })

  it('should return undefined if token is invalid', async () => {
    const axiosClient = new AxiosHttpClient()
    const sut = new FacebookApi(
      axiosClient,
      env.facebookApi.clientId,
      env.facebookApi.clientSecret
    )

    const fbUser = await sut.loadUser({ token: 'invalid' })
    expect(fbUser).toBeUndefined()
  })
})
