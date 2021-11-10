import { RequiredFieldError } from '@/application/errors'
import { badRequest, HttpResponse } from '@/application/helpers'

type HttpRequest = { file: { buffer: Buffer, mimetype: string } }
type Model = Error

class SavePictureController {
  async handle ({ file }: HttpRequest): Promise<HttpResponse<Model> | undefined> {
    if (file === undefined || file === null) return badRequest(new RequiredFieldError('file'))
    if (file.buffer.length === 0) return badRequest(new RequiredFieldError('file'))
    if (!['image/png', 'image/jpg', 'image/jpeg'].includes(file.mimetype)) return badRequest(new InvalidMimeTypeError(['png', 'jpeg']))
  }
}

class InvalidMimeTypeError extends Error {
  constructor (allowed: string[]) {
    super(`Unsupported type. Allowed type: ${allowed.join(', ')}`)
    this.name = 'InvalidMimeTypeError'
  }
}

describe('SavePictureController', () => {
  let buffer: Buffer
  let mimetype: string
  let sut: SavePictureController

  beforeAll(() => {
    buffer = Buffer.from('any_buffer')
    mimetype = 'image/png'
  })

  beforeEach(() => {
    sut = new SavePictureController()
  })

  it('should return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file is not provided', async () => {
    const httpResponse = await sut.handle({ file: undefined as any })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file is empty', async () => {
    const httpResponse = await sut.handle({ file: { buffer: Buffer.from(''), mimetype } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new RequiredFieldError('file')
    })
  })

  it('should return 400 if file type is invalid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimetype: 'invalid_type' } })

    expect(httpResponse).toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })

  it('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimetype: 'image/png' } })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })

  it('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimetype: 'image/jpg' } })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })

  it('should not return 400 if file type is valid', async () => {
    const httpResponse = await sut.handle({ file: { buffer, mimetype: 'image/jpeg' } })

    expect(httpResponse).not.toEqual({
      statusCode: 400,
      data: new InvalidMimeTypeError(['png', 'jpeg'])
    })
  })
})
