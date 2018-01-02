import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseService, Log } from "./base.service";
import { CollectionWrap, ExceptionModel, UserCodeModel } from "../models";
import { DELETE_STATUS } from "../libs/constants";
import { ErrorCode, HttpStatus, logger as Logger } from "../libs";
import { UserCodeRepository } from "../data";
import { injectable, inject } from "inversify";
/**
 * Created by phuongho on 05/10/17.
 */
@injectable()
export class UserCodeService extends BaseService<UserCodeModel, UserCodeRepository> {
    constructor(repo: UserCodeRepository, @inject("Logger") log?: Log) {
        super(repo, log);
    }
    /**
     * @param searchParams
     * @param offset
     * @param limit
     * @param related
     * @param filters
     */
    public search(searchParams: any, offset?: number, limit?: number, related = [], filters = []): Promise<CollectionWrap<UserCodeModel>> {
        return this.repo.search(searchParams, offset, limit, related, filters);
    }

    /**
     * @param UserCode
     * @param related
     * @param filters
     */
    public create(obj: UserCodeModel, related = [], filters = []): Promise<UserCodeModel> {
        let conditions: any = {};
        conditions[Schema.USER_CODE_TABLE_SCHEMA.FIELDS.NAME] = obj.name;
        conditions[Schema.USER_CODE_TABLE_SCHEMA.FIELDS.USER_ID] = obj.userId;
        conditions[Schema.USER_CODE_TABLE_SCHEMA.FIELDS.IS_DELETED] = false;

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
                return this.insert(obj);
            });
    }
}

export default UserCodeService;
