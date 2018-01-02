import { ROLE } from "./../../../../libs/constants";
import * as Promise from "bluebird";
import * as UUID from "uuid";
import * as express from "express";
import { BaseHandler } from "../base.handler";
import { ErrorCode, HttpStatus, JsonMapper } from "../../../../libs";
import { ExceptionModel, StateModel, UserCodeModel, SessionModel } from "../../../../models";
import { PROPERTIES } from "../../../../libs/constants";
import { userCodeService } from "../../../../interactors";

export class UserCodeHandler extends BaseHandler {

    public static list(req: express.Request, res: express.Response, next: express.NextFunction) {
        let session = res.locals.session || SessionModel.empty();
        let offset = parseInt(req.query.offset, 10) || null;
        let limit = parseInt(req.query.limit, 10) || null;
        let queryParams = req.query || null;

        if (session.roleId === ROLE.COMPANY_ADMIN) {
            queryParams.userId = session.userId;
        }

        if (session.roleId === ROLE.OPERATOR) {
            if (!queryParams.userId) {
                return next(new ExceptionModel(
                    ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                    ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                    false,
                    HttpStatus.BAD_REQUEST,
                ));
            }
        }

        return userCodeService.search(queryParams, offset, limit, [], ["isDeleted"])
            .then(UserCodes => {
                res.header(PROPERTIES.HEADER_TOTAL, UserCodes.total.toString(10));
                if (offset != null) {
                    res.header(PROPERTIES.HEADER_OFFSET, offset.toString(10));
                }
                if (limit != null) {
                    res.header(PROPERTIES.HEADER_LIMIT, limit.toString(10));
                }

                res.status(HttpStatus.OK);
                res.json(UserCodes.data);
            })
            .catch(err => {
                next(err);
            });
    }

    public static detail(req: express.Request, res: express.Response, next: express.NextFunction) {
        return userCodeService.detailById(req.params.id, [], ["isDeleted"])
            .then(role => {
                res.status(HttpStatus.OK);
                res.json(role);
            })
            .catch(err => {
                next(err);
            });
    }

    /**
     * Create role
     * @param req
     * @param res
     * @param next
     * @returns {any}
     */
    public static create(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let session = res.locals.session || SessionModel.empty();
        let obj = JsonMapper.deserialize(UserCodeModel, req.body);

        obj.code = UUID.v4();
        if (UserCodeHandler.checkConstraintField(obj) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        return userCodeService.create(obj)
            .then(object => {
                res.status(HttpStatus.OK);
                res.json(StateModel.createSuccessful(object.id));
            })
            .catch(err => {
                next(err);
            });
    }

    /**
     * Edit role: use for super admin and condo manage
     * @param req
     * @param res
     * @param next
     * @returns {any}
     */
    public static edit(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let session = res.locals.session || SessionModel.empty();
        let obj = JsonMapper.deserialize(UserCodeModel, req.body);
        obj.id = req.params.id;

        if (UserCodeHandler.checkConstraintField(obj) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        return Promise.resolve(true)
            .then(() => {
                return userCodeService.update(obj);
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
     * remove role, delete
     * @param req
     * @param res
     * @param next
     * @returns {any}
     */
    public static delete(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let roleId = req.params.id || "";

        return userCodeService.removeById(roleId)
            .then((object) => {
                res.status(HttpStatus.OK);
                res.json(StateModel.deleteSuccessful());
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
    public static checkConstraintField(data: UserCodeModel): boolean {
        let result = true;

        if (!data.name || !data.userId) {
            result = false;
        }

        return result;
    }
}

export default UserCodeHandler;
