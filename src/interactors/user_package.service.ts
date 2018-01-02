/**
 * Created by phuongho on 05/10/17.
 */
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseService, Log } from "./base.service";
import { CollectionWrap, ExceptionModel, UserPackageModel } from "../models";
import { DELETE_STATUS } from "../libs/constants";
import { ErrorCode, HttpStatus, logger as Logger } from "../libs";
import { PackageRepository, UserPackageRepository } from "../data";
import { injectable, inject } from "inversify";

@injectable()
export class UserPackageService extends BaseService<UserPackageModel, UserPackageRepository> {
    constructor(private pack: PackageRepository, repo: UserPackageRepository, @inject("Logger") log?: Log) {
        super(repo, log);
    }
    /**
     * @param searchParams
     * @param offset
     * @param limit
     * @param related
     * @param filters
     */
    public search(searchParams: any, offset?: number, limit?: number, related = [], filters = []): Promise<CollectionWrap<UserPackageModel>> {
        return this.repo.search(searchParams, offset, limit, related, filters);
    }

    /**
     * @param data
     * @param related
     * @param filters
     */
    public create(data: UserPackageModel, related = [], filters = []): Promise<UserPackageModel> {
        return this.pack.findById(data.packageId)
            .then(object => {
                if (object === null) {
                    return Promise.reject(new ExceptionModel(
                        ErrorCode.RESOURCE.NOT_FOUND.CODE,
                        ErrorCode.RESOURCE.NOT_FOUND.MESSAGE,
                        false,
                        HttpStatus.NOT_FOUND,
                    ));
                }
                data.numberAccount = object.numberAccount;
                data.numberFile = object.numberFile;
                data.price = object.price;
                return this.insert(data);
            });

    }
}

export default UserPackageService;
