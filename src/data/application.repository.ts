/**
 * Created by phuongho on 15/08/17.
 */
import * as Promise from "bluebird";
import * as Schema from "../data/sql/schema";
import { ApplicationDto } from "./sql/models";
import { ApplicationModel } from "../models";
import { BaseRepository, Log } from "./base.repository";
import { injectable, inject } from "inversify";

@injectable()
export class ApplicationRepository extends BaseRepository<ApplicationDto, ApplicationModel> {
    constructor( @inject("Logger") log?: Log) {
        super(ApplicationDto, ApplicationModel, log);
    }
}

export default ApplicationRepository;
