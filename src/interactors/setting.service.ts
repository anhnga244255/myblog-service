import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseService, Log } from "./base.service";
import { CollectionWrap, ExceptionModel, SettingModel } from "../models";
import { DELETE_STATUS } from "../libs/constants";
import { ERROR_CODE, HTTP_STATUS } from "../libs";
import { SettingRepository } from "../data";
import { injectable, inject } from "inversify";
/**
 * Created by phuongho on 05/10/17.
 */
@injectable()
export class SettingService extends BaseService<SettingModel, SettingRepository> {
    constructor(repo: SettingRepository, @inject("Logger") log?: Log) {
        super(repo, log);
    }
    /**
     * @param searchParams
     * @param offset
     * @param limit
     * @param related
     * @param filters
     */
    public search(searchParams: any, offset?: number, limit?: number, related = [], filters = []): Promise<CollectionWrap<SettingModel>> {
        return this.repo.search(searchParams, offset, limit, related, filters);
    }

    /**
     * @param Setting
     * @param related
     * @param filters
     */
    public create(setting: SettingModel, related = [], filters = []): Promise<SettingModel> {
        let conditions: any = {};
        conditions[Schema.SETTING_TABLE_SCHEMA.FIELDS.KEYWORD] = setting.keyword;
        conditions[Schema.SETTING_TABLE_SCHEMA.FIELDS.IS_DELETED] = false;

        return this.repo.findOneByAtribute({ conditions: conditions })
            .then(object => {
                if (object != null) {
                    return Promise.reject(new ExceptionModel(
                        ERROR_CODE.RESOURCE.DUPLICATE_RESOURCE.CODE,
                        ERROR_CODE.RESOURCE.DUPLICATE_RESOURCE.MESSAGE,
                        false,
                        HTTP_STATUS.NOT_FOUND,
                    ));
                }
                return this.insert(setting);
            });
    }

}

export default SettingService;
