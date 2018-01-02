/**
 * Created by phuongho on 15/08/17.
 */
import * as express from "express";
import { devOpsService } from "../interactors";
import * as Schema from "../data/sql/schema";
import { ExceptionModel } from "../models";
import { Utils, ErrorCode, HttpStatus } from "../libs";
import { HEADERS, PLATFORM } from "../libs/constants";

export const checkVersion = (): express.RequestHandler => {
    return (req: express.Request, res: express.Response, next: express.NextFunction): any => {
        let platform = req.headers[HEADERS.DEVICE_OS];
        let version: number;

        if (platform === PLATFORM.IOS || platform === PLATFORM.ANDROID) {
            version = parseInt(req.headers[HEADERS.APP_VERSION] as string);
            if (isNaN(version)) {
                return next(new ExceptionModel(
                    ErrorCode.PRIVILEGE.INVALID_VERSION.CODE,
                    ErrorCode.PRIVILEGE.INVALID_VERSION.MESSAGE,
                    false,
                    HttpStatus.BAD_REQUEST
                ));
            }
            return devOpsService.findAppVersion(platform, version)
                .then(app => {
                    if (!app) {
                        return next(new ExceptionModel(
                            ErrorCode.PRIVILEGE.VERSION_NOT_FOUND.CODE,
                            ErrorCode.PRIVILEGE.VERSION_NOT_FOUND.MESSAGE,
                            false,
                            HttpStatus.BAD_REQUEST
                        ));
                    }
                    if (app.forceUpdate) {
                        return next(new ExceptionModel(
                            ErrorCode.PRIVILEGE.FORCE_UPDATE.CODE,
                            ErrorCode.PRIVILEGE.FORCE_UPDATE.MESSAGE,
                            false,
                            HttpStatus.BAD_REQUEST
                        ));
                    }
                    return next();
                });
        } else {
            next();
        }
    };
};

export default checkVersion;
