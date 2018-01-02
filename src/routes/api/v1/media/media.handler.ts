import * as Promise from "bluebird";
import * as UUID from "uuid";
import * as express from "express";
import * as formidable from "formidable";
import { BaseHandler } from "../base.handler";
import { ErrorCode, HttpStatus, uploader, JsonMapper } from "../../../../libs";
import { MediaModel, ExceptionModel } from "../../../../models";
import { mediaService } from "../../../../interactors";

export class MediaHandler extends BaseHandler {
    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public static checkHash(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            return Promise.resolve()
                .then(() => {
                    return mediaService.findByHash(req.query.hash);
                })
                .then((wrapper) => {
                    res.json(wrapper.data);
                })
                .catch(err => next(err));
        } catch (err) {
            next(err);
        }
    }
    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public static update(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            let media = JsonMapper.deserialize(MediaModel, req.body);
            return Promise.resolve()
                .then(() => {
                    return mediaService.make(media);
                })
                .then(() => {
                    res.end();
                })
                .catch(err => next(err));
        } catch (err) {
            next(err);
        }
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public static newFile(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            let form = new formidable.IncomingForm();

            form.parse(req, (err: any, fields: formidable.Fields, files: formidable.Files) => {
                let file = files["file"];

                if (file == null || file.path == null || file.name == null || !fields.type) {
                    return next(new ExceptionModel(
                        ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                        ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                        false,
                        HttpStatus.BAD_REQUEST
                    ));
                }
                return Promise.resolve()
                    .then(() => {
                        let fileName = file.name.split(".");
                        let ext = fileName[fileName.length - 1];
                        if (fields && fields.type) {
                            if (fields.type !== ext) {
                                return next(new ExceptionModel(
                                    ErrorCode.RESOURCE.INVALID_FILE_UPLOAD.CODE,
                                    ErrorCode.RESOURCE.INVALID_FILE_UPLOAD.MESSAGE,
                                    false,
                                    HttpStatus.BAD_REQUEST,
                                ));
                            }
                        }
                        let name = UUID.v4();
                        return uploader.uploadFile(file.path, `${name}.${ext}`);
                    })
                    .then(object => {
                        let media = MediaModel.fromDataS3(object);
                        return mediaService.make(media, [], ["isEnable", "isDeleted"]);
                    })
                    .then(object => {
                        res.status(HttpStatus.OK);
                        res.json(object);
                    })
                    .catch(err => {
                        next(err);
                    });
            });
        } catch (err) {
            next(err);
        }
    }
}

export default MediaHandler;
