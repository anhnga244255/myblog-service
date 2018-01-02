import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseService, Log } from "./base.service";
import { CollectionWrap, ExceptionModel, TagModel } from "../models";
import { DELETE_STATUS } from "../libs/constants";
import { ErrorCode, HttpStatus, logger as Logger } from "../libs";
import { TagRepository } from "../data";
import { injectable, inject } from "inversify";
/**
 * Created by phuongho on 05/10/17.
 */
@injectable()
export class TagService extends BaseService<TagModel, TagRepository> {
    constructor(repo: TagRepository, @inject("Logger") log?: Log) {
        super(repo, log);
    }
    /**
     * @param searchParams
     * @param offset
     * @param limit
     * @param related
     * @param filters
     */
    public search(searchParams: any, offset?: number, limit?: number, related = [], filters = []): Promise<CollectionWrap<TagModel>> {
        return this.repo.search(searchParams, offset, limit, related, filters);
    }

    /**
     * @param Tag
     * @param related
     * @param filters
     */
    public create(tag: TagModel, related = [], filters = []): Promise<TagModel> {
        let conditions: any = {};
        conditions[Schema.TAG_TABLE_SCHEMA.FIELDS.NAME] = tag.name;
        conditions[Schema.TAG_TABLE_SCHEMA.FIELDS.USER_ID] = tag.userId;
        conditions[Schema.TAG_TABLE_SCHEMA.FIELDS.IS_DELETED] = false;

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
                return this.insert(tag);
            });
    }

}

export default TagService;
