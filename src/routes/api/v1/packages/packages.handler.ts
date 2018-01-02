import * as Promise from "bluebird";
import * as express from "express";
import { BaseHandler } from "../base.handler";
import { ErrorCode, HttpStatus, JsonMapper } from "../../../../libs";
import { ExceptionModel, StateModel, PackageModel, SessionModel, UserPackageModel } from "../../../../models";
import { PROPERTIES } from "../../../../libs/constants";
import { packageService, userPackageService } from "../../../../interactors";

export class PackageHandler extends BaseHandler {

    public static list(req: express.Request, res: express.Response, next: express.NextFunction) {
        let session = res.locals.session || SessionModel.empty();
        let offset = parseInt(req.query.offset, 10) || null;
        let limit = parseInt(req.query.limit, 10) || null;
        let queryParams = req.query || null;

        return packageService.search(queryParams, offset, limit, [], ["isDeleted"])
            .then(packages => {
                res.header(PROPERTIES.HEADER_TOTAL, packages.total.toString(10));
                if (offset != null) {
                    res.header(PROPERTIES.HEADER_OFFSET, offset.toString(10));
                }
                if (limit != null) {
                    res.header(PROPERTIES.HEADER_LIMIT, limit.toString(10));
                }

                res.status(HttpStatus.OK);
                res.json(JsonMapper.serialize(packages.data));
            })
            .catch(err => {
                next(err);
            });
    }

    public static detail(req: express.Request, res: express.Response, next: express.NextFunction) {
        return packageService.detailById(req.params.id, [], ["isDeleted"])
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
        let obj = JsonMapper.deserialize(PackageModel, req.body);

        if (PackageHandler.checkConstraintField(obj) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        return packageService.create(obj)
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
        let obj = JsonMapper.deserialize(PackageModel, req.body);
        obj.id = req.params.id;

        if (PackageHandler.checkConstraintField(obj) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        return Promise.resolve(true)
            .then(() => {
                return packageService.update(obj);
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

        return packageService.removeById(roleId)
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
    public static checkConstraintField(data: PackageModel): boolean {
        let result = true;

        if (!data.name || !data.numberAccount || !data.numberFile) {
            result = false;
        }

        return result;
    }


    public static userPackages(req: express.Request, res: express.Response, next: express.NextFunction) {
        let offset = parseInt(req.query.offset, 10) || null;
        let limit = parseInt(req.query.limit, 10) || null;
        let queryParams = req.query || null;

        return userPackageService.search(queryParams, offset, limit, ["package", "user"])
            .then(packages => {
                res.header(PROPERTIES.HEADER_TOTAL, packages.total.toString(10));
                if (offset != null) {
                    res.header(PROPERTIES.HEADER_OFFSET, offset.toString(10));
                }
                if (limit != null) {
                    res.header(PROPERTIES.HEADER_LIMIT, limit.toString(10));
                }

                res.status(HttpStatus.OK);
                res.json(JsonMapper.serialize(packages.data));
            })
            .catch(err => {
                next(err);
            });
    }

    public static createUserPackage(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let session = res.locals.session || SessionModel.empty();
        let obj = JsonMapper.deserialize(UserPackageModel, req.body);

        if (PackageHandler.checkConstraintUserPackageField(obj) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        return userPackageService.create(obj)
            .then(object => {
                res.status(HttpStatus.OK);
                res.json(StateModel.createSuccessful(object.id));
            })
            .catch(err => {
                next(err);
            });
    }

    public static updateUserPackage(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let session = res.locals.session || SessionModel.empty();
        let obj = JsonMapper.deserialize(UserPackageModel, req.body);
        obj.id = req.params.id;

        if (PackageHandler.checkConstraintUserPackageField(obj) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        return userPackageService.update(obj)
            .then(object => {
                res.status(HttpStatus.OK);
                res.json(StateModel.updateSuccessful(object.id));
            })
            .catch(err => {
                next(err);
            });
    }

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public static deleteUserPackage(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let roleId = req.params.id || "";

        return userPackageService.removeById(roleId)
            .then((object) => {
                res.status(HttpStatus.OK);
                res.json(StateModel.deleteSuccessful());
            })
            .catch(err => {
                next(err);
            });
    }

    public static checkConstraintUserPackageField(data: UserPackageModel): boolean {
        let result = true;

        if (!data.userId || !data.packageId) {
            result = false;
        }

        return result;
    }
}

export default PackageHandler;
