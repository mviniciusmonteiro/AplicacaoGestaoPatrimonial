import { Express } from "express";
import { FileFilterCallback } from "multer";

const multer = require('multer');

type DestinationCallback = (error: Error | null, destination: String) => void;

type FileNameCallback = (error: Error | null, filename: String) => void;

export const imageStorage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb: DestinationCallback) => {
        cb(null, process.env.UPLOADS_PATH +  '/images');
    },
    filename: (req: Request, file: Express.Multer.File, cb: FileNameCallback) => {
        cb(null, file.originalname);
    }
});

export const imageFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

export const uploadImage = multer({storage: imageStorage});