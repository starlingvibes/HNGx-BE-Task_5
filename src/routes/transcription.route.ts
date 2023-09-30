import express from 'express';
const transcriptionController = require('../controllers/transcription.controller');
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/', transcriptionController.upload);

export default router;
