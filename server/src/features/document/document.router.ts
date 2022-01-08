import { AppRouter } from '../../routes/routes';
import { Router } from 'express';
import multer from 'multer';
import DocumentMiddleware from './document.middleware';
import DocumentController from './document.controller';
import asyncErrorHandler from 'express-async-handler';

export class DocumentRouter implements AppRouter {
  private readonly router: Router;
  private readonly middleware: DocumentMiddleware;

  public constructor(private controller: DocumentController) {
    this.router = Router();
    this.middleware = new DocumentMiddleware();
    this.initRoutes();
  }

  public get Router(): Router {
    return this.router;
  }

  private initRoutes = (): void => {
    /**
     * asyncErrorHandler - is a required wrapper, that will catch our thrown Exceptions
     * and pass them to next() middleware so that express could catch it too and pass it
     * to custom error handlers
     */
    this.router
      .route(`/document`)
      .all(asyncErrorHandler(this.middleware.populateUserId))
      .get(asyncErrorHandler(this.controller.getAllDocuments))
      .post(
        multer().single(`file`),
        asyncErrorHandler(this.middleware.validateParentId),
        asyncErrorHandler(this.middleware.validateFileExists),
        asyncErrorHandler(this.middleware.validateDocumentFields),
        asyncErrorHandler(this.controller.createDocument)
      );

    this.router
      .route(`/document/:docId`)
      .all(
        asyncErrorHandler(asyncErrorHandler(this.middleware.populateUserId)),
        asyncErrorHandler(this.middleware.populateDocument)
      )
      .get(this.controller.findDocument)
      .patch(
        asyncErrorHandler(this.middleware.validateParentId),
        asyncErrorHandler(this.controller.updateDocument)
      )
      .delete(
        this.middleware.validateParentId,
        asyncErrorHandler(this.controller.deleteDocument)
      );

    this.router
      .route(`/document/download/:docId`)
      .all(
        asyncErrorHandler(this.middleware.populateUserId),
        asyncErrorHandler(this.middleware.populateDocument)
      )
      .get(asyncErrorHandler(this.controller.downloadDocument));

    this.router
      .route(`/shared`)
      .get(asyncErrorHandler(this.controller.getSharedDocument));
  };
}
