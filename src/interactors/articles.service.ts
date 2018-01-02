/**
 * Created by Anh Nga on 13/10/2017
 */
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseService, Log } from "./base.service";
import { CollectionWrap, ExceptionModel, ArticlesModel } from "../models";
import { DELETE_STATUS } from "../libs/constants";
import { ErrorCode, HttpStatus, logger as Logger } from "../libs";
import { ArticlesRepository } from "../data";
import { injectable, inject } from "inversify";

@injectable()
export class ArticlesService extends BaseService<ArticlesModel, ArticlesRepository> {
    constructor(repo: ArticlesRepository, @inject("Logger") logger?: Log) {
        super(repo, logger);
    }
    /**
     * @param searchParams
     * @param offset
     * @param limit
     * @param related
     * @param filters
     */
    public search(searchParams: any, offset?: number, limit?: number, related = [], filters = []): Promise<CollectionWrap<ArticlesModel>> {
        return this.repo.search(searchParams, offset, limit, related, filters);
    }

    /**
     * @param data
     * @param related
     * @param filters
     */
    public create(data: ArticlesModel, related = [], filters = []): Promise<ArticlesModel> {
        let conditions: any = {};
        conditions[Schema.ARTICLES_TABLE_SCHEMA.FIELDS.TITLE] = data.title;// don't have id yet

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

export default ArticlesService;
