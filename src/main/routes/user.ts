import { auth } from '@/main/middlewares/authentication'
import { Router } from 'express'

export default (router: Router): void => {
  router.delete('/users/picture', auth)
}
