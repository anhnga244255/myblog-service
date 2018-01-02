/**
 * Created by Anh Nga on 13/10/2017
 */
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseService, Log } from "./base.service";
import { CollectionWrap, ExceptionModel, LanguageModel } from "../models";
import { DELETE_STATUS } from "../libs/constants";
import { ErrorCode, HttpStatus, logger as Logger } from "../libs";
import { LanguageRepository } from "../data";
import { injectable, inject } from "inversify";

@injectable()
export class LanguageService extends BaseService<LanguageModel, LanguageRepository> {
    constructor(repo: LanguageRepository, @inject("Logger") logger?: Log) {
        super(repo, logger);
    }
    /**
     * @param searchParams
     * @param offset
     * @param limit
     * @param related
     * @param filters
     */
    public search(searchParams: any, offset?: number, limit?: number, related = [], filters = []): Promise<CollectionWrap<LanguageModel>> {
        return this.repo.search(searchParams, offset, limit, related, filters);
    }

    /**
     * @param data
     * @param related
     * @param filters
     */
    public create(data: LanguageModel, related = [], filters = []): Promise<LanguageModel> {
        let conditions: any = {};
        conditions[Schema.LANGUAGE_TABLE_SCHEMA.FIELDS.NAME] = data.name;

        return this.repo.findOneByAtribute({ conditions: conditions })
            .then(object => {
                if (object != null) {
                    return Promise.reject(new ExceptionModel(
                        ErrorCode.RESOURCE.DUPLICATE_RESOURCE.CODE,
                        ErrorCode.RESOURCE.DUPLICATE_RESOURCE.MESSAGE,
                        false,
                        HttpStatus.NOT_FOUND,
                    ));
                }
                return this.insert(data);
            });
    }
}

export default LanguageService;
