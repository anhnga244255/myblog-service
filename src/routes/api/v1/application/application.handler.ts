import * as Promise from "bluebird";
import * as Schema from "../../../../data/sql/schema";
import * as express from "express";
import { ErrorCode, HttpStatus, JsonMapper } from "../../../../libs";
import { ExceptionModel, StateModel, ApplicationModel } from "../../../../models";
import { PROPERTIES } from "../../../../libs/constants";
import { QueryBuilder } from "knex";
import { devOpsService } from "../../../../interactors";

export class ApplicationHandler {
    /**
     * get list
     * @param req
     * @param res
     * @param next
     * @returns {any}
     */
    public static list(req: express.Request, res: express.Response, next: express.NextFunction) {
        let offset = parseInt(req.query.offset, 10) || null;
        let limit = parseInt(req.query.limit, 10) || null;
        let params = req.query || {};
        return devOpsService.listAppVersion(params, offset, limit, ["isDeleted", "isEnable", "createdDate", "updatedDate"])
            .then(result => {
                res.header(PROPERTIES.HEADER_TOTAL, result.total.toString(10));
                if (offset != null) {
                    res.header(PROPERTIES.HEADER_OFFSET, offset.toString(10));
                }
                if (limit != null) {
                    res.header(PROPERTIES.HEADER_LIMIT, limit.toString(10));
                }
                res.status(HttpStatus.OK);
                res.json(result.data);
            })
            .catch(err => {
                next(err);
            });
    }

    public static create(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let application = JsonMapper.deserialize(ApplicationModel, req.body);

        return devOpsService.insert(application)
            .then(object => {
                res.status(HttpStatus.OK);
                res.json(StateModel.createSuccessful(object.id));
            })
            .catch(err => {
                if (!(err instanceof ExceptionModel)) {
                    err = new ExceptionModel(
                        ErrorCode.RESOURCE.GENERIC.CODE,
                        err.message,
                        false,
                        HttpStatus.BAD_GATEWAY
                    );
                }
                next(err);
            });
    }

    public static update(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let application = JsonMapper.deserialize(ApplicationModel, req.body);
        application.id = req.params.id;

        if (!application.id) {
            return next(new ExceptionModel(
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.CODE,
                ErrorCode.RESOURCE.MISSING_REQUIRED_FIELDS.MESSAGE,
                false,
                HttpStatus.BAD_REQUEST,
            ));
        }

        return devOpsService.update(application)
            .then(result => {
                res.status(HttpStatus.OK);
                res.json(StateModel.updateSuccessful(application.id));
            })
            .catch(err => {
                next(err);
            });
    }

    public static delete(req: express.Request, res: express.Response, next: express.NextFunction): any {
        let applicationId = req.params.id;

        return devOpsService.forceDelete(applicationId)
            .then((success) => {
                res.status(HttpStatus.OK);
                res.json(StateModel.deleteSuccessful(applicationId));
            })
            .catch(err => {
                next(err);
            });
    }
}

export default ApplicationHandler;

