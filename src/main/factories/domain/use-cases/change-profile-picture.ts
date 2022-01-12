import { ChangeProfilePicture, setupChangeProfilePicture } from '@/domain/use-cases'
import { makeAwsS3FileStorage, makeUUIDHandler } from '@/main/factories/infra/gateways'
import { makePgUserProfileRepo } from '@/main/factories/infra/repos/postgress'

export const makeChangeProfilePicture = (): ChangeProfilePicture => {
  return setupChangeProfilePicture(
    makeAwsS3FileStorage(),
    makeUUIDHandler(),
    makePgUserProfileRepo()
  )
}
