import * as Promise from "bluebird";
import * as express from "express";
import { BaseHandler } from "../base.handler";
import { ErrorCode, HttpStatus, jwt, mailer, JsonMapper } from "../../../../libs";
import { CategoryModel, ExceptionModel, StateModel, SessionModel } from "../../../../models";
import { PROPERTIES } from "../../../../libs/constants";
import { roleService, categoryService } from "../../../../interactors";

export class CategoryHandler extends BaseHandler {

    public static list(req: express.Request, res: express.Response, next: express.NextFunction) {
        let session = res.locals.session || SessionModel.empty();
        let offset = parseInt(req.query.offset, 10) || null;
        let limit = parseInt(req.query.limit, 10) || null;
        let queryParams = req.query || null;
        queryParams.roleId = session.roleId;

        return categoryService.search(queryParams, offset, limit, [], ["isDeleted"])
            .then(category => {
                res.header(PROPERTIES.HEADER_TOTAL, category.total.toString(10));
                if (offset != null) {
                    res.header(PROPERTIES.HEADER_OFFSET, offset.toString(10));
                }
                if (limit != null) {
                    res.header(PROPERTIES.HEADER_LIMIT, limit.toString(10));
                }

                res.status(HttpStatus.OK);
                res.json(category.data);
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
    public static checkConstraintField(data: CategoryModel): boolean {
        let result = true;

        if (!data.name) {
            result = false;
        }

        return result;
    }


    public static create(req: express.Request, res: express.Response, next: express.NextFunction) {

        let session = res.locals.session || SessionModel.empty();
        let obj = JsonMapper.deserialize(CategoryModel, req.body);

        if (CategoryHandler.checkConstraintField(obj) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        return categoryService.create(obj)
            .then(object => {
                res.status(HttpStatus.OK);
                res.json(StateModel.createSuccessful(object.id));
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

        return categoryService.removeById(roleId)
            .then((object) => {
                res.status(HttpStatus.OK);
                res.json(StateModel.deleteSuccessful());
            })
            .catch(err => {
                next(err);
            });
    }

    /**

        * @param req
        * @param res
        * @param next
        * @returns {any}
        */
    public static update(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let session = res.locals.session || SessionModel.empty();
        let obj = JsonMapper.deserialize(CategoryModel, req.body);
        obj.id = req.params.id;

        if (CategoryHandler.checkConstraintField(obj) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        return Promise.resolve(true)
            .then(() => {
                return categoryService.update(obj, [], ["isDeleted"]);
            })
            .then(object => {
                res.status(HttpStatus.OK);
                res.json(StateModel.updateSuccessful(object.id));
            })
            .catch(err => {
                next(err);
            });
    }

}


