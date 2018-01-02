import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import * as _ from "lodash";
import * as firebase from "firebase-admin";
import { BaseService, Log } from "./base.service";
import { CollectionWrap, UserTagModel, UserPackageModel, DeviceModel, ExceptionModel, SessionModel, UserModel } from "../models";
import { DELETE_STATUS, JWT_WEB_TOKEN, PASSWORD_LENGTH, PROPERTIES, ROLE } from "../libs/constants";
import { ErrorCode, HttpStatus, Utils, FirebaseAdmin, JsonWebToken, Mailer } from "../libs";
import { USER_TAG_TABLE_SCHEMA } from "./../data/sql/schema";
import {
    DeviceRepository,
    RoleRepository,
    SessionRepository,
    UserPackageRepository,
    UserRepository,
    UserTagRepository,
} from "../data";
import { injectable, inject } from "inversify";

@injectable()
export class UserService extends BaseService<UserModel, UserRepository> {
    constructor(private device: DeviceRepository,
        private firebase: FirebaseAdmin,
        private jwt: JsonWebToken,
        private mailer: Mailer,
        private session: SessionRepository,
        private userPackage: UserPackageRepository,
        private userTag: UserTagRepository,
        repo: UserRepository,
        @inject("Logger") log?: Log) {
        super(repo, log);
    }

    /**
     * MOBILE verify email
     * @param email
     * @returns {Bluebird<boolean>}
     */
    public verifyRegisterEmail(email: string): Promise<boolean> {
        return Promise.resolve()
            .then(() => {
                return this.repo.findByEmail(email);
            })
            .then(user => {
                if (user !== null) {
                    return Promise.reject(new ExceptionModel(
                        ErrorCode.RESOURCE.EMAIL_IS_USED.CODE,
                        ErrorCode.RESOURCE.EMAIL_IS_USED.MESSAGE,
                        false,
                        HttpStatus.BAD_REQUEST,
                    ));
                }
                return true;
            });
    }

    /**
     * Search User
     * @param searchParams
     * @param offset
     * @param limit
     * @param related
     * @param filters
     * @returns {any}
     */
    public search(searchParams: any, offset?: number, limit?: number, related = [], filters = []): Promise<CollectionWrap<UserModel>> {
        return this.repo.search(searchParams, offset, limit, related, filters);
    }

    /**
     * verifyLoginPrudential
     * @param email
     * @param password
     * @param filters
     * @returns {Bluebird<U>}
     */
    public verifyLoginPrudential(email: string, password: string, filters = []): Promise<UserModel> {
        return this.repo.findByEmail(email, ["role"], filters)
            .then(object => {
                if (object == null) {
                    return Promise.reject(new ExceptionModel(
                        ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND.CODE,
                        ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND.MESSAGE,
                        false,
                        HttpStatus.NOT_FOUND,
                    ));
                }
                let isCorrect = Utils.compareHash(password, object.password);
                if (isCorrect) {
                    return object;
                }
                return Promise.reject(new ExceptionModel(
                    ErrorCode.AUTHENTICATION.WRONG_USER_NAME_OR_PASSWORD.CODE,
                    ErrorCode.AUTHENTICATION.WRONG_USER_NAME_OR_PASSWORD.MESSAGE,
                    false,
                    HttpStatus.BAD_REQUEST,
                ));
            });
    }

    /**
     * create User
     * @param user
     * @param related
     * @param filters
     * @returns {any}
     */
    public create(user: UserModel, related = [], filters = []): Promise<UserModel> {
        let userPackage: any;
        user.password = Utils.hashPassword(user.password);
        return Promise.resolve()
            .then(() => {
                if (user.parentId) {
                    return this.userPackage.getInfoByUserId(user.parentId);
                }
                return Promise.resolve(null);
            })
            .then((object) => {
                if (object) {
                    userPackage = object;
                }
                if (user.parentId) {
                    return this.repo.countByQuery(q => {
                        q.where(Schema.USER_TABLE_SCHEMA.FIELDS.IS_DELETED, false);
                        q.where(Schema.USER_TABLE_SCHEMA.FIELDS.PARENT_ID, user.parentId);
                    });
                }
            })
            .then((totalAccount) => {
                if (totalAccount) {
                    if (totalAccount >= userPackage.numberAccount) {
                        return Promise.reject(new ExceptionModel(
                            ErrorCode.RESOURCE.MAXIMUM_CREATE_USER.CODE,
                            ErrorCode.RESOURCE.MAXIMUM_CREATE_USER.MESSAGE,
                            false,
                            HttpStatus.BAD_REQUEST,
                        ));
                    }
                }
                return this.verifyRegisterEmail(user.email);
            })
            .then(success => {
                return this.insert(user);
            })
            .then(object => {
                if (user.roleId === ROLE.PRESENTER) {
                    if (_.isArray(user.tags) && user.tags.length) {
                        user.tags.forEach(tagId => {
                            let obj = new UserTagModel();
                            obj.userId = object.id;
                            obj.tagId = tagId;
                            // insert user tag
                            this.userTag.insert(obj);
                        });
                    }
                }
                return object;
            })
            .then((object) => {
                return this.findOne(object.id, related, filters);
            });
    }

    /**
     * remove user, update is_deleted = true, delete logic
     * @param id
     * @param related
     * @param filters
     * @returns {Bluebird<U>}
     */
    public removeById(id: string, related = [], filters = []): Promise<boolean> {
        return this.deleteLogic(id)
            .then(object => {

                // Clear session;
                this.session.deleteByQuery(q => {
                    q.where(Schema.SESSION_TABLE_SCHEMA.FIELDS.USER_ID, object.id);
                }).catch(err => {
                    this.logger.error(err.message, err);
                });
                // Clear device;
                this.device.deleteByQuery(q => {
                    q.where(Schema.DEVICE_TABLE_SCHEMA.FIELDS.USER_ID, object.id);
                }).catch(err => {
                    this.logger.error(err.message, err);
                });

                return true;
            });
    }

    /**
     * full update
     * @param user
     * @param related(optional)
     * @param filters(optional)
     * @returns {any}
     */
    public update(user: UserModel, related = [], filters = []): Promise<any> {
        return this.findById(user.id, related, filters)
            .then(object => {
                if (!object || object.isDeleted) {
                    throw new ExceptionModel(
                        ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND.CODE,
                        ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND.MESSAGE,
                        false,
                        HttpStatus.BAD_REQUEST,
                    );
                }
                if (user.password) {
                    if (!Utils.validatePassword(user.password)) {
                        throw new ExceptionModel(
                            ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND.CODE,
                            ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND.MESSAGE,
                            false,
                            HttpStatus.BAD_REQUEST,
                        );
                    }
                    user.password = Utils.hashPassword(user.password);
                }
                if (user.email && user.email !== object.email) {
                    if (!Utils.validateEmail(user.email)) {
                        throw new ExceptionModel(
                            ErrorCode.RESOURCE.INVALID_EMAIL_FORMAT.CODE,
                            ErrorCode.RESOURCE.INVALID_EMAIL_FORMAT.MESSAGE,
                            false,
                            HttpStatus.BAD_REQUEST,
                        );
                    }
                    return this.repo.findByEmail(user.email)
                        .then(obj => {
                            if (obj) {
                                return Promise.reject(new ExceptionModel(
                                    ErrorCode.RESOURCE.EMAIL_IS_USED.CODE,
                                    ErrorCode.RESOURCE.EMAIL_IS_USED.MESSAGE,
                                    false,
                                    HttpStatus.BAD_REQUEST,
                                ));
                            }
                            return Promise.resolve(object);
                        });
                } else {
                    return Promise.resolve(object);
                }
            })
            .then(object => {
                return this.repo.update(user);
            })
            .tap(object => {
                // delete all user tag
                return this.userTag.deleteByQuery(q => {
                    q.where(Schema.USER_TAG_TABLE_SCHEMA.FIELDS.USER_ID, user.id);
                });
            })
            .then((object) => {
                if (user.roleId === ROLE.PRESENTER) {
                    if (_.isArray(user.tags) && user.tags.length) {
                        user.tags.forEach(tagId => {
                            let obj = new UserTagModel();
                            obj.userId = user.id;
                            obj.tagId = tagId;
                            // insert user tag
                            this.userTag.insert(obj);
                        });
                    }
                }
                return this.findById(user.id);
            })
            .tap((userInfo) => {
                if (this.firebase.getInstance() != null) {
                    this.firebase.getInstance()
                        .database()
                        .ref("/users")
                        .child(userInfo.id)
                        .update({
                            id: userInfo.id,
                            name: userInfo.firstName,
                            email: userInfo.email,
                            avatar: userInfo.avatarUrl != null ? userInfo.avatarUrl : "",
                            updatedDate: firebase.database.ServerValue.TIMESTAMP
                        })
                        .catch(err => this.logger.error(err.message, err));
                }
            });


    }

    /**
     * forgotPassword
     * @param email
     * @param url
     * @returns {Bluebird<boolean>}
     */
    public forgotPassword(email: string, url: string): Promise<boolean> {
        return Promise.resolve()
            .then(() => {
                return this.repo.findByEmail(email);
            })
            .then((object) => {
                if (object === null) {
                    return Promise.reject(new ExceptionModel(
                        ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND.CODE,
                        ErrorCode.AUTHENTICATION.ACCOUNT_NOT_FOUND.MESSAGE,
                        false,
                        HttpStatus.BAD_REQUEST,
                    ));
                }

                let token = this.jwt.encode({ userId: object.id }, JWT_WEB_TOKEN.RESET_PASSWORD_TIME_EXPIRED, JsonWebToken.DEFAULT_CLIENT);

                let link = `${url}/${token}`;
                // send mail reset password
                this.mailer.sendResetPassword(object, link);
                return true;
            });

    }

    /**
     * set password when reset password
     * @param userId
     * @param newPassword
     * @param related
     * @param filters
     */
    public setPassword(userId: string, newPassword: string, related = [], filters = []): Promise<boolean> {
        return this.repo.findOne(userId)
            .then(user => {
                if (user === null) {
                    return Promise.reject(new ExceptionModel(
                        ErrorCode.RESOURCE.NOT_FOUND.CODE,
                        ErrorCode.RESOURCE.NOT_FOUND.MESSAGE,
                        false,
                        HttpStatus.NOT_FOUND,
                    ));
                } else {
                    user.password = Utils.hashPassword(newPassword);
                    return this.repo.update(user);
                }
            })
            .then(user => {
                // Clear session;
                this.session.deleteByQuery(q => {
                    q.where(Schema.SESSION_TABLE_SCHEMA.FIELDS.USER_ID, userId);
                }).catch(err => {
                    this.logger.error(err.message, err);
                });
                // Clear device;
                this.device.deleteByQuery(q => {
                    q.where(Schema.DEVICE_TABLE_SCHEMA.FIELDS.USER_ID, userId);
                }).catch(err => {
                    this.logger.error(err.message, err);
                });
                return user;
            });
    }

    /**
     * change password
     * @param userId
     * @param oldPassword
     * @param newPassword
     * @param related
     * @param filters
     * @returns {Bluebird<U>}
     */
    public changePassword(userId: string, oldPassword: string, newPassword: string, related = [], filters = []) {
        return this.findById(userId)
            .then(user => {
                if (user === null) {
                    return Promise.reject(new ExceptionModel(
                        ErrorCode.RESOURCE.NOT_FOUND.CODE,
                        ErrorCode.RESOURCE.NOT_FOUND.MESSAGE,
                        false,
                        HttpStatus.NOT_FOUND,
                    ));
                } else {
                    if (Utils.compareHash(oldPassword, user.password) === false) {
                        return Promise.reject(new ExceptionModel(
                            ErrorCode.AUTHENTICATION.WRONG_PASSWORD.CODE,
                            ErrorCode.AUTHENTICATION.WRONG_PASSWORD.MESSAGE,
                            false,
                            HttpStatus.BAD_REQUEST,
                        ));
                    } else if (Utils.compareHash(oldPassword, Utils.hashPassword(newPassword)) === true) {
                        return Promise.reject(new ExceptionModel(
                            ErrorCode.RESOURCE.PASSWORD_USE_BEFORE.CODE,
                            ErrorCode.RESOURCE.PASSWORD_USE_BEFORE.MESSAGE,
                            false,
                            HttpStatus.BAD_REQUEST,
                        ));
                    } else {
                        user.password = Utils.hashPassword(newPassword);
                        return this.repo.update(user);
                    }
                }
            })
            .then(user => {
                // Clear session;
                this.session.deleteByQuery(q => {
                    q.where(Schema.SESSION_TABLE_SCHEMA.FIELDS.USER_ID, userId);
                }).catch(err => {
                    this.logger.error(err.message, err);
                });

                // Clear device;
                this.device.deleteByQuery(q => {
                    q.where(Schema.DEVICE_TABLE_SCHEMA.FIELDS.USER_ID, userId);
                }).catch(err => {
                    this.logger.error(err.message, err);
                });
                return user;
            })
            .then(object => {
                return this.findById(userId, ["role"], ["password", "isDeleted"]);
            });
    }

    /**
 * Update My Profile
 * @param user
 * @param related
 * @param filters
 * @returns {Bluebird<U>}
 */
    public updateMyProfile(user: UserModel, related = [], filters = []): Promise<UserModel> {
        return this.repo.update(user)
            .then((object) => {
                return this.findById(object.id, related, filters);
            })
            .tap((userInfo) => {
                if (this.firebase.getInstance() != null) {
                    this.firebase.getInstance()
                        .database()
                        .ref("/users")
                        .child(userInfo.id)
                        .update({
                            avatar: userInfo.avatarUrl != null ? userInfo.avatarUrl : "",
                            createdDate: firebase.database.ServerValue.TIMESTAMP,
                            email: userInfo.email,
                            firstName: userInfo.firstName,
                            id: userInfo.id,
                            lastName: userInfo.lastName,
                            online: false,
                            phoneNumber: userInfo.phone != null ? userInfo.phone : "",
                            updatedDate: firebase.database.ServerValue.TIMESTAMP
                        })
                        .catch(err => this.logger.error(err.message, err));
                }
            });
    }

}

export default UserService;
