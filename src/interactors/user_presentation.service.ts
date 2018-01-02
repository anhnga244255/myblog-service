import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { BaseService, Log } from "./base.service";
import { CollectionWrap, ExceptionModel, UserPresentationModel } from "../models";
import { DELETE_STATUS } from "../libs/constants";
import { ErrorCode, HttpStatus, logger as Logger } from "../libs";
import { PresentationRepository, UserPresentationRepository } from "../data";
import { injectable, inject } from "inversify";

@injectable()
export class UserPresentationService extends BaseService<UserPresentationModel, UserPresentationRepository> {
    constructor(private present: PresentationRepository, repo: UserPresentationRepository, @inject("Logger") log?: Log) {
        super(repo, log);
    }
    /**
     * @param searchParams
     * @param offset
     * @param limit
     * @param related
     * @param filters
     */
    public search(searchParams: any, offset?: number, limit?: number, related = [], filters = []): Promise<CollectionWrap<UserPresentationModel>> {
        return this.repo.search(searchParams, offset, limit, related, filters);
    }

    /**
     * @param data
     * @param related
     * @param filters
     */
    public create(data: UserPresentationModel, related = [], filters = []): Promise<UserPresentationModel> {
        return this.present.findById(data.presentationId)
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

export default UserPresentationService;
