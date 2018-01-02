import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseService, Log } from "./base.service";
import { CollectionWrap, ExceptionModel, RoleModel } from "../models";
import { DELETE_STATUS, ROLE } from "../libs/constants";
import { ErrorCode, HttpStatus, logger as Logger } from "../libs";
import { RoleRepository } from "../data";
import { injectable, inject } from "inversify";
/**
 * Created by phuongho on 05/10/17.
 */
@injectable()
export class RoleService extends BaseService<RoleModel, RoleRepository> {
    constructor(repo: RoleRepository, @inject("Logger") log?: Log) {
        super(repo, log);
    }
    /**
     * @param searchParams
     * @param offset
     * @param limit
     * @param related
     * @param filters
     */
    public search(searchParams: any, offset?: number, limit?: number, related = [], filters = []): Promise<CollectionWrap<RoleModel>> {
        return this.repo.search(searchParams, offset, limit, related, filters);
    }

    /**
     * @param role
     * @param related
     * @param filters
     */
    public create(role: RoleModel, related = [], filters = []): Promise<RoleModel> {
        let conditions: any = {};
        conditions[Schema.ROLE_TABLE_SCHEMA.FIELDS.ID] = role.id;
        conditions[Schema.ROLE_TABLE_SCHEMA.FIELDS.IS_DELETED] = false;

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
                return this.insert(role);
            });
    }
}

export default RoleService;
