import {ErrorException} from "./error-exception";
import type {ErrorRequestHandler} from "express";


export const errorHandlerMiddleware: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof ErrorException) {
    return res.status(err.statusCode).json({
      isSuccess: false,
      error: err.error
    })
  }
  return res.status(500).json({
    isSuccess: false,
    error: err.message
  })
}