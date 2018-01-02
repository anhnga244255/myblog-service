import { UserPackageModel } from "./../models/user_package.model";
import { PackageDto } from "./../data/sql/models";
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { CollectionWrap, ExceptionModel, PackageModel } from "../models";
import { PackageRepository } from "../data";
import { BaseService, Log } from "./base.service";
import { ErrorCode, HttpStatus, logger as Logger } from "../libs";
import { DELETE_STATUS } from "../libs/constants";
import { injectable, inject } from "inversify";
/**
 * Created by phuongho on 05/10/17.
 */
@injectable()
export class PackageService extends BaseService<PackageModel, PackageRepository> {
    constructor(repo: PackageRepository, @inject("Logger") log?: Log) {
        super(repo, log);
    }
    /**
     * @param searchParams
     * @param offset
     * @param limit
     * @param related
     * @param filters
     */
    public search(searchParams: any, offset?: number, limit?: number, related = [], filters = []): Promise<CollectionWrap<PackageModel>> {
        return this.repo.search(searchParams, offset, limit, related, filters);
    }

    /**
     * @param data
     * @param related
     * @param filters
     */
    public create(data: PackageModel, related = [], filters = []): Promise<PackageDto> {
        let conditions: any = {};
        conditions[Schema.PACKAGE_TABLE_SCHEMA.FIELDS.NAME] = data.name;
        conditions[Schema.PACKAGE_TABLE_SCHEMA.FIELDS.IS_DELETED] = false;

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

export default PackageService;
