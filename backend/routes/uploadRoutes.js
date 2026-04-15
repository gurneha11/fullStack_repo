import express from 'express';
import multer from 'multer';
import { handleUpload } from '../controllers/uploadController.js';

const router = express.Router();
//const upload = multer({ dest: 'uploads/' });
const upload = multer({ dest: "/tmp/uploads" });


router.post(
    '/',
    upload.fields([
        { name: 'existing' },
        { name: 'new' },
        { name: 'sales' }
    ]),
    handleUpload
);

export default router;