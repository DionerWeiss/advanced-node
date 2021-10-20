import { UploadFile, UUIDGenerator } from '@/domain/contracts/gateways'
import { LoadUserProfile, SaveUserPicture } from '@/domain/contracts/repos'
import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases/change-profile-picture'
import { mock, MockProxy } from 'jest-mock-extended'

describe('ChangeProfilePicture', () => {
  let uuid: string
  let file: Buffer
  let fileStorage: MockProxy<UploadFile>
  let crypto: MockProxy<UUIDGenerator>
  let userProfileRepo: MockProxy<SaveUserPicture & LoadUserProfile>
  let sut: ChangeProfilePicture

  beforeAll(() => {
    uuid = 'any_unique_id'
    file = Buffer.from('any_buffer')
    fileStorage = mock()
    fileStorage.upload.mockResolvedValue('any_url')
    crypto = mock()
    userProfileRepo = mock()
    userProfileRepo.load.mockResolvedValue({ name: 'Dioner Weiss' })
    crypto.uuid.mockReturnValue(uuid)
  })

  beforeEach(() => {
    sut = setupChangeProfilePicture(fileStorage, crypto, userProfileRepo)
  })

  it('should call UploadFile with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(fileStorage.upload).toBeCalledWith({ file, key: uuid })
    expect(fileStorage.upload).toBeCalledTimes(1)
  })

  it('should not call UploadFile when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(fileStorage.upload).not.toBeCalled()
  })

  it('should call SaveUserPicture with correct input', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.savePicture).toBeCalledWith({ pictureUrl: 'any_url', initial: undefined })
    expect(userProfileRepo.savePicture).toBeCalledTimes(1)
  })

  it('should call SaveUserPicture with correct input when file is undefined', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toBeCalledWith({ pictureUrl: undefined, initials: 'DW' })
    expect(userProfileRepo.savePicture).toBeCalledTimes(1)
  })

  it('should call SaveUserPicture with uppercase', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: 'dioner weiss' })

    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toBeCalledWith({ pictureUrl: undefined, initials: 'DW' })
    expect(userProfileRepo.savePicture).toBeCalledTimes(1)
  })

  it('should call SaveUserPicture with first name', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: 'Dioner' })

    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toBeCalledWith({ pictureUrl: undefined, initials: 'DI' })
    expect(userProfileRepo.savePicture).toBeCalledTimes(1)
  })

  it('should call SaveUserPicture with first letter', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: 'D' })

    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toBeCalledWith({ pictureUrl: undefined, initials: 'D' })
    expect(userProfileRepo.savePicture).toBeCalledTimes(1)
  })

  it('should call SaveUserPicture with correct input when file is undefined', async () => {
    userProfileRepo.load.mockResolvedValueOnce({ name: undefined })
    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.savePicture).toBeCalledWith({ pictureUrl: undefined, initials: undefined })
    expect(userProfileRepo.savePicture).toBeCalledTimes(1)
  })

  it('should call LoadUserProfile with correct input ', async () => {
    await sut({ id: 'any_id', file: undefined })

    expect(userProfileRepo.load).toBeCalledWith({ id: 'any_id' })
    expect(userProfileRepo.load).toBeCalledTimes(1)
  })

  it('should call LoadUserProfile if file exists', async () => {
    await sut({ id: 'any_id', file })

    expect(userProfileRepo.load).not.toBeCalled()
  })
})
