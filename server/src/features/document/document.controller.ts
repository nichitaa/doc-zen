import {Request, Response} from 'express';
import {DocumentModel, IDocument} from './model/Document';
import * as bcrypt from 'bcrypt';
import {AzureBlobService} from '../../services/AzureBlobService/AzureBlobService';
import {config} from 'dotenv';
import {isLocalEnv} from '../../utils';
import {APIResponse, BaseParams} from '../../types/api';

config();

export default class DocumentController {
  private readonly azureBlobService: AzureBlobService;
  private readonly isLocal: boolean;

  public constructor() {
    this.azureBlobService = AzureBlobService.getInstance();
    this.isLocal = isLocalEnv();
  }

  public getSharedDocument = async (
    req: Request<unknown,
      unknown,
      unknown,
      {
        pass?: string;
        refId: string;
      }>,
    res: Response
  ) => {
    try {
      const refId = req.query.refId;
      const pass = req.query.pass;

      if (!refId) throw Error(`reference ID is required`)

      const document = await DocumentModel.findOne({
        publicReferenceId: refId,
      }).exec();

      if (!document) throw Error(`no document found with reference ID ${refId}`)

      if (document?.password) {
        if (!pass) throw Error(`document requires a password`)

        const match = await bcrypt.compare(pass, document.password);

        if (!match) throw Error(`invalid password`)
      }

      const stream = await this.azureBlobService.downloadFile(
        document!.userId,
        document!.fileName
      );

      res.set('Access-Control-Expose-Headers', 'fileName');
      res.set('fileName', document!.fileName);
      res.attachment(document!.fileName);
      return stream.pipe(res);
    } catch (e) {
      return res.status(500).json({
        isSuccess: false,
        error: e.message,
      });
    }
  };

  public getAllDocuments = async (
    req: Request,
    res: Response<APIResponse<IDocument[]>>
  ) => {
    try {
      const documents = await DocumentModel.find({userId: req.userId}).exec();
      return res.status(200).json({
        isSuccess: true,
        data: documents,
        message: `found ${documents.length} documents`,
      });
    } catch (e) {
      return res.status(500).json({
        isSuccess: false,
        error: e.message,
      });
    }
  };

  public createDocument = async (
    req: Request,
    res: Response<APIResponse<never>>
  ) => {
    try {
      const userId = req.userId;
      const file = req.file!;

      const payload: IDocument = JSON.parse(req.body.data);
      const {password} = payload;
      const hasPassword = password && password !== '';
      let hashedPassword: string;
      if (hasPassword) {
        hashedPassword = await bcrypt.hash(password, 10);
      }
      await this.azureBlobService.uploadFile(userId, file);
      await new DocumentModel({
        ...payload,
        password: hasPassword ? hashedPassword! : null,
        userId,
        fileName: file.originalname,
      }).save();

      return res.send({
        isSuccess: true,
        message: `successfully uploaded new document`,
      });
    } catch (e) {
      return res.send({isSuccess: false, error: e.message});
    }
  };

  public downloadDocument = async (
    req: Request<BaseParams, unknown, unknown, { pass?: string }>,
    res: Response<APIResponse<never>>
  ) => {
    try {
      const userId = req.userId;
      const pass = req.query.pass;
      const fileName = req.populatedDocument.fileName;
      const hashedPassword = req.populatedDocument.password;

      if (hashedPassword) {
        if (!pass) throw Error(`password is required`);

        const match = await bcrypt.compare(pass, hashedPassword);

        if (!match) throw Error(`invalid password`)
      }

      const stream = await this.azureBlobService.downloadFile(userId, fileName);

      res.set('Access-Control-Expose-Headers', 'fileName');
      res.set('fileName', fileName);
      res.attachment(fileName);
      return stream.pipe(res);
    } catch (e) {
      return res.status(500).json({
        isSuccess: false,
        error: e.message,
      });
    }
  };

  public findDocument = (
    req: Request<BaseParams>,
    res: Response<APIResponse<IDocument>>
  ) => {
    return res.status(200).json({
      isSuccess: true,
      data: req.populatedDocument,
      message: ``,
    });
  };

  public deleteDocument = async (
    req: Request<BaseParams>,
    res: Response<APIResponse<unknown>>
  ) => {
    try {
      const userId = req.userId;
      const doc = req.populatedDocument;

      await DocumentModel.deleteOne({userId, _id: doc._id});
      await this.azureBlobService.deleteFile(userId, doc.fileName);
      return res.send({
        isSuccess: true,
        message: `Document was successfully deleted`,
      });
    } catch (e) {
      return res.status(500).json({
        isSuccess: false,
        error: e.message,
      });
    }
  };

  public updateDocument = async (
    req: Request<BaseParams>,
    res: Response<APIResponse<unknown>>
  ) => {
    try {
      const userId = req.userId;
      const docId = req.params.docId;
      await DocumentModel.updateOne({userId, _id: docId}, {...req.body});
      return res.status(200).json({
        isSuccess: true,
        message: `document with id: ${docId}, was successfully updated`,
      });
    } catch (e) {
      return res.status(500).json({
        isSuccess: false,
        error: e.message,
      });
    }
  };
}
