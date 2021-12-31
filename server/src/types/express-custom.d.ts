import { IDocument } from '../features/document/model/Document';

declare global {
  declare namespace Express {
    export interface Request {
      populatedDocument: IDocument;
      userId: string;
      user: {
        sub: string;
      };
    }
  }
}
