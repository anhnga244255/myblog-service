import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseService, Log } from "./base.service";
import { CollectionWrap, ExceptionModel, UserTagModel } from "../models";
import { DELETE_STATUS } from "../libs/constants";
import { ErrorCode, HttpStatus } from "../libs";
import { TagRepository, UserTagRepository } from "../data";
import { injectable, inject } from "inversify";

@injectable()
export class UserTagService extends BaseService<UserTagModel, UserTagRepository> {
    constructor(private tag: TagRepository, repo: UserTagRepository, @inject("Logger") log?: Log) {
        super(repo, log);
    }
    /**
     * @param searchParams
     * @param offset
     * @param limit
     * @param related
     * @param filters
     */
    public search(searchParams: any, offset?: number, limit?: number, related = [], filters = []): Promise<CollectionWrap<UserTagModel>> {
        return this.repo.search(searchParams, offset, limit, related, filters);
    }

    /**
     * @param data
     * @param related
     * @param filters
     */
    public create(data: UserTagModel, related = [], filters = []): Promise<UserTagModel> {
        return this.tag.findById(data.tagId)
            .then(object => {
                if (object === null) {
                    return Promise.reject(new ExceptionModel(
                        ErrorCode.RESOURCE.NOT_FOUND.CODE,
                        ErrorCode.RESOURCE.NOT_FOUND.MESSAGE,
                        false,
                        HttpStatus.NOT_FOUND,
                    ));
                }
                return this.insert(data);
            });

    }
}

export default UserTagService;
