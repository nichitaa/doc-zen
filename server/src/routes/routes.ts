import { Router } from 'express';
import { DocumentRouter } from '../features/document/routes/document.router';
import DocumentController from '../features/document/controllers/document.controller';

export interface AppRouter {
  Router: Router;
}

export const routes: AppRouter[] = [
  new DocumentRouter(new DocumentController()),
];
