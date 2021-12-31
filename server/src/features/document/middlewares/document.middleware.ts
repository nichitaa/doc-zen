import { Request, Response, NextFunction } from 'express';
import { DocumentModel, IDocument } from '../model/Document';
import { isLocalEnv, isEmpty } from '../../../utils';
import { APIResponse, BaseParams } from '../../../types/api';

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
      return res.status(400).json({
        isSuccess: false,
        error: `missing some required fields`,
      });
    next();
  };

  public validateFileExists = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const file = req.file;

    if (!file)
      return res.status(400).json({
        isSuccess: false,
        error: `file is required`,
      });
    next();
  };

  public validateParentId = async (
    req: Request<unknown, any, IDocument>,
    res: Response<APIResponse<unknown>>,
    next: NextFunction
  ) => {
    if (req.body.isRevision) {
      if (isEmpty(req.body.parentId)) {
        return res.status(400).json({
          isSuccess: false,
          error: `the revision document must have a parent element selected`,
        });
      }
    } else {
      if (!isEmpty(req.body.parentId)) {
        return res.status(400).json({
          isSuccess: false,
          error: `the document with a parent must be a revision`,
        });
      }
    }
    next();
  };

  public populateUserId = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      req.userId = this.getUserId(req, res);
      next();
    } catch (e) {
      return res.status(401).json({ isSuccess: false, error: e.message });
    }
  };

  public populateDocument = async (
    req: Request<BaseParams>,
    res: Response<APIResponse<unknown>>,
    next: NextFunction
  ) => {
    try {
      const userId = this.getUserId(req, res);
      const document = await DocumentModel.findOne({
        _id: req.params.docId,
        userId: userId,
      }).exec();

      if (!document)
        return res.status(404).send({
          isSuccess: false,
          error: `document was not found`,
        });

      req.populatedDocument = document;
      next();
    } catch (e) {
      return res.status(401).json({ isSuccess: false, error: e.message });
    }
  };

  private getUserId = (
    req: Request<unknown>,
    res: Response<APIResponse<unknown>>
  ) => {
    if ((!req.user || !req.user.sub) && !isLocalEnv())
      throw Error('unauthorized');
    return this.isLocal ? 'userid' : req.user.sub.split('|')[1];
  };
}
