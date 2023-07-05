import { Request } from "express";

const validFileExtensions = [ "jpg", "jpeg", "png", "gif" ];

export const fileFilter = (req: Request, file: Express.Multer.File, cb: Function) => {

    if (!file) return cb(new Error("File is empty"), false);

    const fileExtension = file.mimetype.split("/")[1];

    if ( validFileExtensions.includes(fileExtension) ) {
        return cb(null, true);
    };

    cb(null,false);
}