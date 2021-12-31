import { model, Schema, Model } from 'mongoose';

export enum DocumentTypesEnum {
  IDENTITY_CARD = 'IDENTITY_CARD',
  MILITARY_BOOKLET = 'MILITARY_BOOKLET',
  BIRTH_CERTIFICATE = 'BIRTH_CERTIFICATE',
  LABOR_CONTRACT = 'LABOR_CONTRACT',
  INVOICE = 'INVOICE',
  OTHERS = 'OTHERS',
  BEAVER_CERTIFICATE = 'BEAVER_CERTIFICATE',
}

export interface IDocument {
  _id: string;
  userId: string;
  name: string;
  description: string;
  documentType: DocumentTypesEnum;
  password?: string;
  isRevision: boolean;
  parentId?: string;
  publicReferenceId: string | null;
  fileName: string;
}

const documentSchema: Schema = new Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    documentType: {
      enum: DocumentTypesEnum,
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    isRevision: {
      type: Boolean,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    parentId: {
      type: Schema.Types.ObjectId,
      ref: 'Document',
    },
    fileName: {
      type: String,
      required: true,
    },
    publicReferenceId: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const DocumentModel: Model<IDocument> = model('Document', documentSchema);

export { DocumentModel };
