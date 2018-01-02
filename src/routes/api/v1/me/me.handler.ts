import * as Promise from "bluebird";
import * as express from "express";
import { BaseHandler } from "../base.handler";
import { ErrorCode, HttpStatus, Utils, JsonMapper } from "../../../../libs";
import { ExceptionModel, StateModel, SessionModel, DeviceModel, UserModel } from "../../../../models";
import { JWT_WEB_TOKEN } from "../../../../libs/constants";
import { userService, sessionService, deviceService } from "../../../../interactors";

export class MeHandler extends BaseHandler {

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public static profile(req: express.Request, res: express.Response, next: express.NextFunction) {
        let session = res.locals.session || SessionModel.empty();

        return userService.detailById(session.userId, ["role"], ["isDeleted", "password"])
            .then(role => {
                res.status(HttpStatus.OK);
                res.json(role);
            })
            .catch(err => {
                next(err);
            });
    }
    public static updateProfile(req: express.Request, res: express.Response, next: express.NextFunction): any {
        try {
            let session = res.locals.session || SessionModel.empty();
            let user = JsonMapper.deserialize(UserModel, req.body);
            user.id = session.userId;

            user.email = undefined;
            user.roleId = undefined;
            user.parentId = undefined;
            // Prevent change user password, if you wan to change, use changePassword() instead
            user.password = undefined;

            return userService.updateMyProfile(user)
                .then(object => {
                    res.status(HttpStatus.OK);
                    res.json(StateModel.updateSuccessful(object.id));
                })
                .catch(err => {
                    next(err);
                });
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
    public static changePassword(req: express.Request, res: express.Response, next: express.NextFunction): any {
        try {
            let session = res.locals.session || SessionModel.empty();
            let oldPassword = req.body.oldPassword || null;
            let newPassword = req.body.newPassword || null;

            let userInfo: UserModel;

            if (oldPassword == null || newPassword == null) {
                return next(new ExceptionModel(
                    ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                    ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                    false,
                    HttpStatus.BAD_REQUEST,
                ));
            }

            if (!Utils.validatePassword(newPassword)) {
                return next(new ExceptionModel(
                    ErrorCode.RESOURCE.INVALID_PASSWORD.CODE,
                    ErrorCode.RESOURCE.INVALID_PASSWORD.MESSAGE,
                    false,
                    HttpStatus.BAD_REQUEST,
                ));
            }

            let deviceModel = DeviceModel.fromRequest(req.headers, session.userId);
            return userService.changePassword(session.userId, oldPassword, newPassword, ["role"], ["password"])
                .then(obj => {
                    userInfo = obj;
                    if (deviceModel.deviceId != null && deviceModel.registrarId != null) {
                        return deviceService.create(deviceModel);
                    } else {
                        return deviceModel;
                    }
                })
                .then(() => {
                    return sessionService.create(userInfo.id, userInfo.roleId, JWT_WEB_TOKEN.DEFAULT_EXPIRE, deviceModel.deviceId, ["hash"]);
                })
                .then(session => {
                    UserModel.filters(userInfo, ["password"]);
                    session.user = userInfo;
                    res.status(HttpStatus.OK);
                    res.json(session);
                })
                .catch(err => {
                    next(err);
                });
        } catch (err) {
            next(err);
        }
    }

}

export default MeHandler;
