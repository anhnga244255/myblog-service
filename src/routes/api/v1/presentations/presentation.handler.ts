import * as Promise from "bluebird";
import * as express from "express";
import { BaseHandler } from "../base.handler";
import { ErrorCode, HttpStatus, JsonMapper } from "../../../../libs";
import { ExceptionModel, AssignPresentationModel, StateModel, PresentationModel, SessionModel } from "../../../../models";
import { presentationService, assignPresentationService } from "../../../../interactors";
import { ROLE, PROPERTIES } from "../../../../libs/constants";

export class PresentationHandler extends BaseHandler {

    public static list(req: express.Request, res: express.Response, next: express.NextFunction) {
        let session = res.locals.session || SessionModel.empty();
        let offset = parseInt(req.query.offset, 10) || null;
        let limit = parseInt(req.query.limit, 10) || null;
        let queryParams = req.query || null;
        queryParams.roleId = session.roleId;

        if (session.roleId === ROLE.COMPANY_ADMIN || session.roleId === ROLE.PRESENTER) {
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

        return presentationService.search(queryParams, offset, limit, [], ["isDeleted"])
            .then(Presentations => {
                res.header(PROPERTIES.HEADER_TOTAL, Presentations.total.toString(10));
                if (offset != null) {
                    res.header(PROPERTIES.HEADER_OFFSET, offset.toString(10));
                }
                if (limit != null) {
                    res.header(PROPERTIES.HEADER_LIMIT, limit.toString(10));
                }

                res.status(HttpStatus.OK);
                res.json(Presentations.data);
            })
            .catch(err => {
                next(err);
            });
    }

    public static detail(req: express.Request, res: express.Response, next: express.NextFunction) {
        return presentationService.detailById(req.params.id, [], ["isDeleted"])
            .then(role => {
                res.status(HttpStatus.OK);
                res.json(role);
            })
            .catch(err => {
                next(err);
            });
    }

    /**
     * Create presentation
     * @param req
     * @param res
     * @param next
     * @returns {any}
     */
    public static create(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let session = res.locals.session || SessionModel.empty();
        let obj = JsonMapper.deserialize(PresentationModel, req.body);

        if (PresentationHandler.checkConstraintField(obj) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        return presentationService.create(obj)
            .then(object => {
                res.status(HttpStatus.OK);
                res.json(StateModel.createSuccessful(object.id));
            })
            .catch(err => {
                next(err);
            });
    }

    /**
     * Edit presentation
     * @param req
     * @param res
     * @param next
     * @returns {any}
     */
    public static edit(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let session = res.locals.session || SessionModel.empty();
        let obj = JsonMapper.deserialize(PresentationModel, req.body);
        obj.id = req.params.id;


        if (PresentationHandler.checkConstraintField(obj) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        obj.userId = undefined;
        obj.userCode = undefined;

        return Promise.resolve(true)
            .then(() => {
                return presentationService.update(obj);
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
     * remove presentation, delete
     * @param req
     * @param res
     * @param next
     * @returns {any}
     */
    public static delete(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let roleId = req.params.id || "";

        return presentationService.removeById(roleId)
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
    public static checkConstraintField(data: PresentationModel): boolean {
        let result = true;

        if (!data.title || !data.userId || !data.userCode || !data.numberPage || !data.pageTiming || !data.fileUrl || !data.imageUrl) {
            result = false;
        }

        return result;
    }

    public static assign(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let session = res.locals.session || SessionModel.empty();
        let obj = JsonMapper.deserialize(AssignPresentationModel, req.body);
        obj.presentationId = req.params.id;

        if (PresentationHandler.checkAssignConstraintField(obj) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        return assignPresentationService.create(obj)
            .then(object => {
                res.status(HttpStatus.OK);
                res.json(StateModel.createSuccessful(object.id));
            })
            .catch(err => {
                next(err);
            });
    }

    /**
     *
     * @param data
     */
    public static checkAssignConstraintField(data: AssignPresentationModel): boolean {
        let result = true;

        if (!data.presentationId || (!data.tags && !data.country) || !data.users) {
            result = false;
        }

        return result;
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public static assignDetail(req: express.Request, res: express.Response, next: express.NextFunction) {
        return assignPresentationService.detailByPresentaionId(req.params.id, [], ["isDeleted"])
            .then(object => {
                res.status(HttpStatus.OK);
                res.json(object ? object : {} );
            })
            .catch(err => {
                next(err);
            });
    }
}

export default PresentationHandler;
