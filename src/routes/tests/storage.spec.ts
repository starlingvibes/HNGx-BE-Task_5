import express, { Request, Response, NextFunction } from 'express';
import storageRouter from '../storage.route';

jest.mock('../../controllers/auth.controller', () => ({
  upload: jest.fn(),
  download: jest.fn(),
  markUnsafeAndDelete: jest.fn(),
  createFolder: jest.fn(),
}));

const app = express();
app.use('/', storageRouter);

describe('Cloud storage routes for the application', () => {
  test.skip('should call upload function when POST /upload', () => {});
});
