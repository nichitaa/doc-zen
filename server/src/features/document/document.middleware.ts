import { NextFunction, Request, Response } from 'express';
import { DocumentModel, IDocument } from './model/Document';
import { isEmpty, isLocalEnv } from '../../utils';
import { APIResponse, BaseParams } from '../../types/api';
import { ErrorException } from '../error-handler/error-exception';

export default class DocumentMiddleware {
  private readonly isLocal: boolean = isLocalEnv();

  public constructor() {}

  public validateDocumentFields = async (
    req: Request<unknown, unknown, { data: string }>,
    res: Response<APIResponse<unknown>>,
    next: NextFunction
  ) => {
    const doc: IDocument = JSON.parse(req.body.data);
    if (
      isEmpty(doc.name) ||
      isEmpty(doc.description) ||
      isEmpty(doc.documentType)
    )
      throw new ErrorException(400, `missing some required fields`);
    next();
  };

  public validateFileExists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const file = req.file;

    if (!file) throw new ErrorException(400, `missing file`);

    next();
  };

  public validateParentId = async (
    req: Request<unknown, any, IDocument>,
    res: Response<APIResponse<unknown>>,
    next: NextFunction
  ): Promise<any> => {
    if (req.body.isRevision) {
      if (isEmpty(req.body.parentId))
        throw new ErrorException(
          400,
          `the revision document must have a parent element selected`
        );
    } else {
      if (!isEmpty(req.body.parentId)) {
        throw new ErrorException(
          400,
          `the document with a parent must be a revision`
        );
      }
    }
    next();
  };

  public populateUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    req.userId = this.getUserId(req);
    next();
  };

  public populateDocument = async (
    req: Request<BaseParams>,
    res: Response<APIResponse<unknown>>,
    next: NextFunction
  ): Promise<any> => {
    const userId = this.getUserId(req);
    const document = await DocumentModel.findOne({
      _id: req.params.docId,
      userId: userId,
    }).exec();

    if (!document) throw new ErrorException(404, `document not found`);

    req.populatedDocument = document;
    next();
  };

  private getUserId = (req: Request<unknown>) => {
    if ((!req.user || !req.user.sub) && !isLocalEnv())
      throw new ErrorException(401, `unauthorized`);
    return this.isLocal ? 'userid' : req.user.sub.split('|')[1];
  };
}
