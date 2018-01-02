/**
 * Created by davidho on 2/12/17.
 */
import * as Promise from "bluebird";
import * as express from "express";
import { BaseHandler } from "../base.handler";
import { ErrorCode, HttpStatus , JsonMapper} from "../../../../libs";
import { ExceptionModel, SessionModel } from "../../../../models";
import { ROLE, PROPERTIES } from "../../../../libs/constants";
import { SettingModel, StateModel } from "../../../../models";
import { settingService } from "../../../../interactors";

export class SettingHandler extends BaseHandler {
    /**
     * create
     * @param req
     * @param res
     * @param next
     * @returns {any}
     */
    public static create(req: express.Request, res: express.Response, next: express.NextFunction): any {
        try {
            let session = res.locals.session || SessionModel.empty();
            let obj = JsonMapper.deserialize(SettingModel, req.body);

            if (SettingHandler.checkConstraintField(obj) === false) {
                return next(new ExceptionModel(
                    ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                    ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                    false,
                    HttpStatus.BAD_REQUEST,
                ));
            }

            return settingService.create(obj)
                .then(object => {
                    res.status(HttpStatus.OK);
                    res.json(StateModel.createSuccessful(object.id));
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
    public static edit(req: express.Request, res: express.Response, next: express.NextFunction): any {
        try {
            let session = res.locals.session || SessionModel.empty();

            let obj = JsonMapper.deserialize(SettingModel, req.body);
            obj.id = req.params.id || "";

            if (SettingHandler.checkConstraintField(obj) === false) {
                return next(new ExceptionModel(
                    ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                    ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                    false,
                    HttpStatus.BAD_REQUEST,
                ));
            }
            obj.keyword = undefined; // ignore update keyword

            return settingService.update(obj)
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

    public static remove(req: express.Request, res: express.Response, next: express.NextFunction): any {
        try {
            let session = res.locals.session || SessionModel.empty();
            let id = req.params.id || "";

            return settingService.removeById(id)
                .then((object) => {
                    res.status(HttpStatus.OK);
                    res.json(StateModel.deleteSuccessful());
                })
                .catch(err => {
                    next(err);
                });
        } catch (err) {
            next(err);
        }
    }


    /**
     * get list
     * @param req
     * @param res
     * @param next
     * @returns {any}
     */
    public static list(req: express.Request, res: express.Response, next: express.NextFunction) {
        try {
            let session = res.locals.session || SessionModel.empty();
            let offset = parseInt(req.query.offset, 10) || null;
            let limit = parseInt(req.query.limit, 10) || null;
            let queryParams = req.query || null;

            return settingService.search(queryParams, offset, limit, null, ["isDeleted", "isEnable"])
                .then(users => {
                    res.header(PROPERTIES.HEADER_TOTAL, users.total.toString(10));

                    if (offset != null) {
                        res.header(PROPERTIES.HEADER_OFFSET, offset.toString(10));
                    }
                    if (limit != null) {
                        res.header(PROPERTIES.HEADER_LIMIT, limit.toString(10));
                    }

                    res.status(HttpStatus.OK);
                    res.json(users.data);
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
     * @param data
     * @returns {boolean}
     */
    public static checkConstraintField(data: SettingModel): boolean {
        let result = true;
        if (!data.keyword || !data.value || !data.desc) {
            result = false;
        }
        return result;
    }
}

export default SettingHandler;
