import * as Promise from "bluebird";
import * as express from "express";
import { BaseHandler } from "../base.handler";
import { ErrorCode, HttpStatus, jwt, mailer, JsonMapper } from "../../../../libs";
import { ArticlesModel, ExceptionModel, StateModel, SessionModel } from "../../../../models";
import { PROPERTIES } from "../../../../libs/constants";
import { roleService, articlesService } from "../../../../interactors";

export class ArticlesHandler extends BaseHandler {

    public static list(req: express.Request, res: express.Response, next: express.NextFunction) {
        let session = res.locals.session || SessionModel.empty();
        let offset = parseInt(req.query.offset, 10) || null;
        let limit = parseInt(req.query.limit, 10) || null;
        let queryParams = req.query || null;
        queryParams.roleId = session.roleId;

        return articlesService.search(queryParams, offset, limit, [], ["isDeleted"])
            .then(articles => {
                res.header(PROPERTIES.HEADER_TOTAL, articles.total.toString(10));
                if (offset != null) {
                    res.header(PROPERTIES.HEADER_OFFSET, offset.toString(10));
                }
                if (limit != null) {
                    res.header(PROPERTIES.HEADER_LIMIT, limit.toString(10));
                }

                res.status(HttpStatus.OK);
                res.json(articles.data);
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
    public static checkConstraintField(data: ArticlesModel): boolean {
        let result = true;

        if (!data.title) {
            result = false;
        }

        return result;
    }


    public static create(req: express.Request, res: express.Response, next: express.NextFunction) {

        let session = res.locals.session || SessionModel.empty();
        let obj = JsonMapper.deserialize(ArticlesModel, req.body);

        if (ArticlesHandler.checkConstraintField(obj) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        return articlesService.create(obj)
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

        return articlesService.removeById(roleId)
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
        let obj = JsonMapper.deserialize(ArticlesModel, req.body);
        obj.id = req.params.id;

        if (ArticlesHandler.checkConstraintField(obj) === false) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        return Promise.resolve(true)
            .then(() => {
                return articlesService.update(obj, [], ["isDeleted"]);
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


