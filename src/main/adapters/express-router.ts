import { Controller } from '@/application/controllers'

import { RequestHandler } from 'express'

type Adapter = (controller: Controller) => RequestHandler

export const adaptExpressRoute: Adapter = controller => async (req, res) => {
  const { data, statusCode } = await controller.handle({ ...req.body, ...req.locals })
  if (statusCode >= 200 && statusCode <= 299) {
    res.status(statusCode).json(data)
  } else {
    res.status(statusCode).json({ error: data.message })
  }
}
