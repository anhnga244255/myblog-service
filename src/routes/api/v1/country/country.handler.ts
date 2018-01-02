const cityLib = require("cities/locations");
import * as Promise from "bluebird";
import * as _ from "lodash";
import * as countryLib from "countryjs";
import * as express from "express";
import { BaseHandler } from "../base.handler";
import { CountryModel } from "../../../../models";
import { ErrorCode, HttpStatus } from "../../../../libs";

export class CountryHandler extends BaseHandler {

    /**
     *
     * @param req
     * @param res
     * @param next
     */
    public static listCountry(req: express.Request, res: express.Response, next: express.NextFunction) {
        let countryJson = countryLib.all();

        Promise.resolve()
            .then(() => {
                return countryLib.all();
            })
            .then(objects => {
                let arr: CountryModel[] = [];
                for (let i = 0; i < objects.length; i++) {
                    if (objects[i].name != null) {
                        let temp = new CountryModel();
                        temp.name = objects[i].name;
                        temp.code = objects[i].ISO.alpha2.toString().toLowerCase();
                        arr.push(temp);
                    }
                }
                res.status(HttpStatus.OK);
                res.json(arr);
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
    public static listStates(req: express.Request, res: express.Response, next: express.NextFunction) {
        let countryCode: string = req.params.countryCode;
        countryCode = countryCode.toString().toUpperCase();

        Promise.resolve()
            .then(() => {
                return countryLib.states(countryCode);
            })
            .then(objects => {
                res.status(HttpStatus.OK);
                if (objects == null) {
                    res.json([]);
                } else {
                    res.json(objects);
                }
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
    public static listProvinces(req: express.Request, res: express.Response, next: express.NextFunction) {
        let stateCode: string = req.params.stateCode;

        Promise.resolve()
            .then(() => {
                return _.filter(cityLib, { state: stateCode });
            })
            .then(objects => {
                let ret: any = [];
                objects.forEach((item: any) => {
                    if (item.city && ret.indexOf(item.city) === -1) {
                        ret.push(item.city);
                    }
                });
                res.status(HttpStatus.OK);
                res.json(ret);
            })
            .catch(err => {
                next(err);
            });
    }
}
