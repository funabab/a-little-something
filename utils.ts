import { NextFunction, Request, RequestHandler, Response } from 'express'
import { validationResult } from 'express-validator'
import { ServerError } from './types'

export const validateRequest = (
  errorStatusCode: number = 400
): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      const err: ServerError = new Error()
      err.statusCode = errorStatusCode
      err.errors = errors
        .formatWith((error) => error.msg)
        .array({
          onlyFirstError: true,
        })
      next(err)
    }

    next()
  }
}
