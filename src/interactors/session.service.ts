import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import * as UUID from "uuid";
import * as firebase from "firebase-admin";
import * as momentTz from "moment-timezone";
import { BaseService, Log } from "./base.service";
import { ERROR_CODE, HTTP_STATUS, BearerObject, FirebaseAdmin, JsonWebToken } from "../libs";
import { ExceptionModel, SessionModel, UserModel, DeviceModel, } from "../models";
import { FIREBASE_ONLINE_STATUS } from "../libs/constants";
import { SessionRepository, UserRepository } from "../data";
import { injectable, inject } from "inversify";
/**
 * Created by phuongho on 15/08/17.
 */
@injectable()
export class SessionService extends BaseService<SessionModel, SessionRepository> {
    constructor(private user: UserRepository,
        private firebase: FirebaseAdmin,
        private jwt: JsonWebToken,
        repo: SessionRepository,
        @inject("Logger") log?: Log) {
        super(repo, log);
    }


    public createFirebaseToken(userId: string, user?: UserModel, device?: DeviceModel): Promise<string> {
        if (userId == null) {
            return Promise.resolve(null);
        }

        let sdk = this.firebase.getInstance();
        if (sdk == null) {
            return Promise.reject(new ExceptionModel(
                ERROR_CODE.OPERATION.FIREBASE_DISABLE.CODE,
                ERROR_CODE.OPERATION.FIREBASE_DISABLE.MESSAGE,
                false,
                HTTP_STATUS.INTERNAL_SERVER_ERROR,
            ));
        }

        return Promise.resolve()
            .then(() => {
                if (user == null) {
                    return this.user.findOne(userId);
                }
                return user;
            })
            .tap((userModel) => {
                sdk.auth().getUser(userId)
                    .catch(err => this.logger.warn("Account does not exist on Firebase, create one"))
                    .then((firebaseUser) => {
                        if (firebaseUser == null) {
                            return sdk.auth().createUser({
                                uid: userId,
                                email: userModel.email,
                                emailVerified: true,
                                displayName: `${userModel.firstName}`,
                                disabled: false,
                            });
                        }
                    })
                    .catch(err => {
                        this.logger.error(err.message, err);
                        return null;
                    });
            })
            .tap(userInfo => {
                Promise.resolve(sdk.database()
                    .ref("/users")
                    .child(userInfo.id)
                    .update({
                        id: userInfo.id,
                        name: userInfo.firstName,
                        email: userInfo.email,
                        avatar: userInfo.avatarUrl != null ? userInfo.avatarUrl : "",
                        isReceivePushChat: true,
                        online: FIREBASE_ONLINE_STATUS.ONLINE,
                        updatedDate: firebase.database.ServerValue.TIMESTAMP
                    }))
                    .then(() => {
                        if (device != null && device.registrarId != null) {
                            return sdk.database()
                                .ref("/devices")
                                .child(userInfo.id)
                                .update({
                                    [`${device.deviceId}`]: device.registrarId,
                                })
                                .catch(err => this.logger.error(err.message, err));
                        }
                    })
                    .catch(err => this.logger.error(err.message, err));
            })
            .then((firebaseUser) => {
                return sdk.auth().createCustomToken(userId);
            });
    }

    public create(userId: string, roleId: string, expire: number, deviceId: string, filters = []): Promise<SessionModel> {
        if (userId == null || expire === 0 || deviceId == null) {
            return Promise.reject(new ExceptionModel(
                ERROR_CODE.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ERROR_CODE.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HTTP_STATUS.BAD_REQUEST
            ));
        }
        let current = Date.now();
        let session = new SessionModel();
        session.userId = userId;
        session.roleId = roleId;
        session.hash = UUID.v4();
        session.expire = momentTz.tz(new Date(current + expire), "UTC");
        session.token = this.jwt.encode(Object.assign({}, session), expire, deviceId);
        return this.repo.insert(session)
            .then((object) => {
                return this.repo.findOne(object.id, null, filters);
            });
    }

    public deleteSessionByUserId(userId: string, hash?: string, ignoreHashes?: string[]): Promise<any> {
        if (userId != null) {
            return this.repo.deleteByQuery(q => {
                q.where(Schema.SESSION_TABLE_SCHEMA.FIELDS.USER_ID, userId);
                if (hash != null) {
                    q.where(Schema.SESSION_TABLE_SCHEMA.FIELDS.HASH, hash);
                }
                if (ignoreHashes != null && ignoreHashes.length > 0) {
                    q.whereNotIn(Schema.SESSION_TABLE_SCHEMA.FIELDS.HASH, ignoreHashes);
                }
            });
        }
        return Promise.resolve(null);
    }

    public verifyToken(jwtObject: BearerObject, token: string): Promise<any> {
        let exception;
        if (token == null || token === "") {
            exception = new ExceptionModel(ERROR_CODE.RESOURCE.INVALID_PARAMETER.CODE, ERROR_CODE.RESOURCE.INVALID_PARAMETER.MESSAGE, false);
            exception.HTTP_STATUS = HTTP_STATUS.BAD_REQUEST;
            return Promise.reject(exception);
        }

        let session;
        return this.repo.findOneByQuery(q => {
            q.where(Schema.SESSION_TABLE_SCHEMA.FIELDS.TOKEN, token);
            q.andWhere(Schema.SESSION_TABLE_SCHEMA.FIELDS.USER_ID, jwtObject.userId);
        })
            .then(object => { // fix with reddit
                if (object != null) {
                    session = object;
                    return this.user.findOne(object.userId);
                }
                return null;
            })
            .then(object => {
                session.roleId = object.roleId;
                return session;
            })
            .catch(err => {
                return Promise.reject(err);
            });
    }
}

export default SessionService;
