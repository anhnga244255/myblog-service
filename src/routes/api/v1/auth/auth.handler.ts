import { } from "./../../../../libs/mapper/json.mapper";
import * as express from "express";
import { DeviceModel, ExceptionModel, SessionModel, UserModel, StateModel } from "../../../../models";
import { ErrorCode, HttpStatus, logger, firebase, JsonMapper } from "../../../../libs";
import { PROPERTIES, JWT_WEB_TOKEN, ROLE, FIREBASE_ONLINE_STATUS } from "../../../../libs/constants";
import { userService, deviceService, sessionService } from "../../../../interactors";
import { database } from "firebase-admin";
export class AuthHandler {

    public static firebaseLogin(req: express.Request, res: express.Response, next: express.NextFunction): void {
        let session: SessionModel = res.locals.session || SessionModel.empty();
        sessionService.createFirebaseToken(session.userId)
            .then((token) => {
                res.status(HttpStatus.OK);
                res.json({
                    token: token,
                });
            })
            .catch(err => next(err));
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public static login(req: express.Request, res: express.Response, next: express.NextFunction): void {
        let email = req.body.email || "";
        let password = req.body.password || "";

        let roleId: string;
        let userInfo: UserModel;
        let sessionInfo: SessionModel;
        let deviceModel: DeviceModel;

        if (AuthHandler.checkConstraintField(req.body) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        userService.verifyLoginPrudential(email, password, ["isEnable", "isDeleted"])
            .then(object => {
                userInfo = object;
                roleId = object.roleId;
                deviceModel = DeviceModel.fromRequest(req.headers, object.id);
                if (deviceModel.userAgent === PROPERTIES.MOBILE_USER_AGENT) {
                    return deviceService.create(deviceModel);
                } else {
                    return deviceModel;
                }
            })
            .then(object => {
                deviceModel = object;
                return sessionService.create(userInfo.id, userInfo.roleId, JWT_WEB_TOKEN.DEFAULT_EXPIRE, object.deviceId, ["hash"]);
            })
            .then(session => {
                UserModel.filters(userInfo, ["password"]);
                session.user = userInfo;
                sessionInfo = session;
                return sessionService.createFirebaseToken(userInfo.id, userInfo, deviceModel)
                    .catch(err => logger.error(err.message, err));
            })
            .then(token => {
                sessionInfo.firebaseToken = token;

                res.status(HttpStatus.OK);
                res.json(sessionInfo.toResponse());
            })
            .catch(err => {
                next(err);
            });
    }

    public static register(req: express.Request, res: express.Response, next: express.NextFunction) {
        let roleId: string;
        let user: UserModel;
        let session: SessionModel;
        let device: DeviceModel;

        if (AuthHandler.checkConstraintField(req.body) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        user = JsonMapper.deserialize(UserModel, req.body);
        user.roleId = ROLE.USER;
        userService.create(user, [], ["password"])
            .then(object => {
                user = object;
                device = DeviceModel.fromRequest(req.headers, user.id);
                if (device.userAgent === PROPERTIES.MOBILE_USER_AGENT) {
                    return deviceService.create(device);
                } else {
                    return device;
                }
            })
            .then(object => {
                device = object;
                return sessionService.create(user.id, user.roleId, JWT_WEB_TOKEN.DEFAULT_EXPIRE, object.deviceId, ["hash"]);
            })
            .then(object => {
                session = object;
                UserModel.filters(user, ["password"]);
                session.user = user;
                return sessionService.createFirebaseToken(user.id, user, device)
                    .catch(err => logger.error(err.message, err));
            })
            .then(token => {
                session.firebaseToken = token;

                res.status(HttpStatus.OK);
                res.json(session.toResponse());
            })
            .catch(err => {
                next(err);
            });
    }

    /**
     *
     * @param data
     * @param loginType
     * @returns {boolean}
     */
    private static checkConstraintField(data: any) {
        let result = true;

        if (data.email === "" || data.password === "") {
            result = false;
        }

        return result;
    }

    /**
     * logout
     * @param req
     * @param res
     * @param next
     */
    public static logout(req: express.Request, res: express.Response, next: express.NextFunction): void {
        let session = res.locals.session || SessionModel.empty();
        let deviceModel = DeviceModel.fromRequest(req.headers, session.userId);

        sessionService.deleteSessionByUserId(session.userId, session.hash)
            .then(() => {
                let sdk = firebase.getInstance();

                if (sdk != null) {
                    // Remove the device token into firebase.
                    if (deviceModel != null && deviceModel.deviceId != null && deviceModel.registrarId != null) {
                        sdk.database()
                            .ref("/devices")
                            .child(session.userId)
                            .child(`${deviceModel.deviceId}`)
                            .remove()
                            .catch(err => logger.error(err.message, err));
                    }

                    // Update online status for user after logout on firebase.
                    sdk.database()
                        .ref("/users")
                        .child(session.userId)
                        .update({
                            online: FIREBASE_ONLINE_STATUS.OFFLINE,
                            updatedDate: database.ServerValue.TIMESTAMP
                        })
                        .catch(err => logger.error(err.message, err));
                }

                return deviceService.deleteByUserId(session.userId, deviceModel.deviceId);
            })
            .then(() => {
                res.status(HttpStatus.OK);
                res.json(StateModel.deleteSuccessful());
            })
            .catch(error => {
                next(error);
            });
    }
}

export default AuthHandler;

