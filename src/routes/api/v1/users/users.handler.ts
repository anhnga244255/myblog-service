import * as Promise from "bluebird";
import * as express from "express";
import { BaseHandler } from "../base.handler";
import { ErrorCode, HttpStatus, Utils, jwt, JsonWebToken, mailer, JsonMapper, BookshelfMapper, logger } from "../../../../libs";
import { ExceptionModel, StateModel, UserModel, SessionModel, DeviceModel } from "../../../../models";
import { FIREBASE_ONLINE_STATUS } from "./../../../../libs/constants";
import { PROPERTIES, ROLE, MESSAGE_INFO, PASSWORD_LENGTH, EMAIL_TEMPLATE } from "../../../../libs/constants";
import { database } from "firebase-admin";
import { firebase as FirebaseAdmin } from "./../../../../libs";
import { sessionService, userService, deviceService } from "../../../../interactors";

export class UserHandler extends BaseHandler {
    /**
    * logout
    * @param req
    * @param res
    * @param next
    */
    public static logout(req: express.Request, res: express.Response, next: express.NextFunction): void {
        try {
            let session = res.locals.session || SessionModel.empty();
            let deviceModel = DeviceModel.fromRequest(req.headers, session.userId);

            sessionService.deleteSessionByUserId(session.userId, session.hash)
                .then(() => {
                    let sdk = FirebaseAdmin.getInstance();

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
        } catch (err) {
            next(err);
        }
    }


    public static list(req: express.Request, res: express.Response, next: express.NextFunction) {
        let session = res.locals.session || SessionModel.empty();
        let offset = parseInt(req.query.offset, 10) || null;
        let limit = parseInt(req.query.limit, 10) || null;
        let queryParams = req.query || null;

        if (session.roleId === ROLE.COMPANY_ADMIN) {
            queryParams.parentId = session.userId;
        }
        if (session.roleId === ROLE.OPERATOR) {
            if (!queryParams.parentId) {
                return next(new ExceptionModel(
                    ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                    ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                    false,
                    HttpStatus.BAD_REQUEST,
                ));
            }
        }
        queryParams.currentUserId = session.userId;
        return userService.search(queryParams, offset, limit, ["role", "userPackage.package", "userTag"], ["password"])
            .then(users => {
                res.header(PROPERTIES.HEADER_TOTAL, users.total.toString(10));
                if (offset != null) {
                    res.header(PROPERTIES.HEADER_OFFSET, offset.toString(10));
                }
                if (limit != null) {
                    res.header(PROPERTIES.HEADER_LIMIT, limit.toString(10));
                }

                res.status(HttpStatus.OK);
                res.json(JsonMapper.serialize(users.data));
            })
            .catch(err => {
                next(err);
            });
    }

    public static detail(req: express.Request, res: express.Response, next: express.NextFunction) {
        return userService.detailById(req.params.id, [], ["password", "isDeleted"])
            .then(user => {
                res.status(HttpStatus.OK);
                res.json(JsonMapper.serialize(user));
            })
            .catch(err => {
                next(err);
            });
    }

    /**
     * checkConstraintField
     * @param data
     * @param isUpdated
     * @returns {boolean}
     */
    public static checkConstraintField(data: UserModel): boolean {
        let result = true;
        if (!data.id) {
            if (!data.password) {
                result = false;
            }
        }

        if (!data.firstName || !data.lastName || !data.roleId || !data.email) {
            result = false;
        }

        if (data.roleId === ROLE.OPERATOR || data.roleId === ROLE.PRESENTER) {
            if (!data.parentId) {
                result = false;
            }
        }

        return result;
    }

    /**
     * Create user in portal
     * @param req
     * @param res
     * @param next
     * @returns {any}
     */
    public static create(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let session = res.locals.session || SessionModel.empty();
        let user = JsonMapper.deserialize(UserModel, req.body);

        if (UserHandler.checkConstraintField(user) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        if (!Utils.validateEmail(user.email)) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.INVALID_EMAIL_FORMAT.CODE,
                ErrorCode.RESOURCE.INVALID_EMAIL_FORMAT.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        if (user.roleId !== ROLE.OPERATOR && user.roleId !== ROLE.PRESENTER) {
            user.parentId = undefined;
        }

        if (user.roleId !== ROLE.PRESENTER) {
            user.tags = undefined;
        }
        return userService.create(user)
            .then(object => {
                res.status(HttpStatus.OK);
                res.json(StateModel.createSuccessful(object.id));
            })
            .catch(err => {
                next(err);
            });
    }

    /**
     * forgot password
     * @param req
     * @param res
     * @param next
     * @returns {any}
     */
    public static forgotPassword(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let email = req.body.email || "";
        if (email === "") {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.EMPTY_EMAIL.CODE,
                ErrorCode.RESOURCE.EMPTY_EMAIL.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }
        let link = `${req.protocol}://${req.get("host")}/api/v1/users/forgotpassword`;
        return userService.forgotPassword(email, link)
            .then((object) => {
                if (object === true) {
                    res.status(HttpStatus.OK);
                    res.json(StateModel.resetPasswordSuccessful());
                }
            })
            .catch(err => {
                next(err);
            });
    }

    public static resetPassword(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let message = {
            body: {
                name: "",
                intro: MESSAGE_INFO.MI_RESET_PASSWORD_TOKEN_INVALID
            }
        };
        res.header("Content-Type", "text/html; charset=UTF-8");

        let token = req.params.token || "";
        let password = `${Utils.randomPassword(PASSWORD_LENGTH)}`;
        let email: string;
        let userId = "";
        return Promise.resolve()
            .then(() => {
                if (jwt.verify(token, JsonWebToken.DEFAULT_CLIENT)) {
                    let jwtObject = jwt.decode(token);
                    let current = Date.now();
                    if (current < jwtObject.exp) {
                        let userId = jwtObject.payload.userId;
                        return userService.findOne(userId);
                    }
                    message.body.intro = MESSAGE_INFO.MI_RESET_PASSWORD_EXPIRED;
                }
                return Promise.reject(false);
            })
            .then(user => {
                if (user == null) {
                    return Promise.reject(false);
                }
                userId = user.id;
                message.body.name = user.name;
                email = user.email;
                return userService.setPassword(user.id, password);
            })
            .then(object => {
                // send new password to user
                let user = BookshelfMapper.deserialize(UserModel, object);
                mailer.sendNewPassword(user, password);
                message.body.intro = MESSAGE_INFO.MI_CHECK_EMAIL_FOR_NEW_PASSWORD;

                mailer.generateCustomHtml({
                    template: EMAIL_TEMPLATE.SEND_CUSTOM_EMAIL,
                    data: {
                        name: message.body.name,
                        content: message.body.intro,
                    }
                }).then((data: any) => {
                    res.send(data.html);
                });
            })
            .catch(() => {
                mailer.generateCustomHtml({
                    template: EMAIL_TEMPLATE.SEND_CUSTOM_EMAIL,
                    data: {
                        name: message.body.name,
                        content: message.body.intro,
                    }
                }).then((data: any) => {
                    res.send(data.html);
                });
            });
    }
    /**
     * Edit user: use for super admin and condo manage
     * @param req
     * @param res
     * @param next
     * @returns {any}
     */
    public static edit(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let user = JsonMapper.deserialize(UserModel, req.body);
        user.id = req.params.id;

        if (UserHandler.checkConstraintField(user) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        if (!Utils.validateEmail(user.email)) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.INVALID_EMAIL_FORMAT.CODE,
                ErrorCode.RESOURCE.INVALID_EMAIL_FORMAT.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        if (user.roleId !== ROLE.OPERATOR && user.roleId !== ROLE.PRESENTER) {
            user.parentId = undefined;
        }

        if (user.roleId !== ROLE.PRESENTER) {
            user.tags = undefined;
        }

        return Promise.resolve(true)
            .then(() => {
                if (user.password) { // if admin change password user, user have to re-login
                    return sessionService.deleteSessionByUserId(user.id);
                }
            })
            .then(() => {
                return userService.update(user);
            })
            .then(object => {
                res.status(HttpStatus.OK);
                res.json(StateModel.updateSuccessful(object.id));
            })
            .catch(err => {
                next(err);
            });
    }

    /**
     * remove user, delete
     * @param req
     * @param res
     * @param next
     * @returns {any}
     */
    public static delete(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let userId = req.params.id || "";

        return userService.removeById(userId)
            .then((object) => {
                res.status(HttpStatus.OK);
                res.json(StateModel.deleteSuccessful());
            })
            .catch(err => {
                next(err);
            });
    }
}

export default UserHandler;
