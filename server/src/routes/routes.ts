import { Router } from 'express';
import { DocumentRouter } from '../features/document/document.router';
import DocumentController from '../features/document/document.controller';

export interface AppRouter {
  Router: Router;
}

export const routes: AppRouter[] = [
  new DocumentRouter(new DocumentController()),
];
