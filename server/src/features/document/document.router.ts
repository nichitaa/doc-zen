import { AppRouter } from '../../routes/routes';
import { Router } from 'express';
import multer from 'multer';
import DocumentMiddleware from './document.middleware';
import DocumentController from './document.controller';

export class DocumentRouter implements AppRouter {
  private readonly router: Router;
  private readonly middleware: DocumentMiddleware;

  public constructor(private controller: DocumentController) {
    this.router = Router();
    this.middleware = new DocumentMiddleware();
    this.initRoutes();
  }

  private initRoutes = (): void => {
    this.router
      .route(`/document`)
      .all(this.middleware.populateUserId)
      .get(this.controller.getAllDocuments)
      .post(
        multer().single(`file`),
        this.middleware.validateParentId,
        this.middleware.validateFileExists,
        this.middleware.validateDocumentFields,
        this.controller.createDocument
      );

    this.router
      .route(`/document/:docId`)
      .all(this.middleware.populateUserId, this.middleware.populateDocument)
      .get(this.controller.findDocument)
      .patch(this.middleware.validateParentId, this.controller.updateDocument)
      .delete(this.middleware.validateParentId, this.controller.deleteDocument);

    this.router
      .route(`/document/download/:docId`)
      .all(this.middleware.populateUserId, this.middleware.populateDocument)
      .get(this.controller.downloadDocument);

    this.router.route(`/shared`).get(this.controller.getSharedDocument);
  };

  public get Router(): Router {
    return this.router;
  }
}
