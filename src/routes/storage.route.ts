import express from 'express';
import multer from 'multer';
const uploadController = require('../controllers/storage.controller');
const { verifyAdmin, verifyBoth } = require('../middlewares/auth.middleware');

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/upload', uploadController.upload);
// router.get('/download/:fileName', verifyBoth, uploadController.download);
// router.get(
//   '/download/:folderName/:fileName',
//   verifyBoth,
//   uploadController.download
// );
// router.delete('/delete/:fileName', verifyBoth, uploadController.deleteFile);
router.get('/list', uploadController.listFiles);
// router.get('/list', verifyBoth, uploadController.listFiles);
// router.post('/compress', verifyBoth, uploadController.compressFile);

// Admin-only routes
// router.get('/fetch-files', verifyAdmin, uploadController.fetchAllFiles);
// router.get('/fetch-files', uploadController.fetchAllFiles);

export default router;
