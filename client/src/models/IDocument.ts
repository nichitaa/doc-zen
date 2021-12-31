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
  _id: string; // record id
  userId: string;
  name: string;
  description: string;
  documentType: DocumentTypesEnum;
  password?: string;
  isRevision: boolean;
  parentId?: string;
  publicReferenceId: string | null;
  createdAt: string;
}
