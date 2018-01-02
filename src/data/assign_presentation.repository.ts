import { Log } from "./../libs/logger";
import { ASSIGN_PRESENTATION_TABLE_SCHEMA } from "./sql/schema";
import { CollectionWrap } from "./../models/collections";
import { BaseRepository } from "./base.repository";
import { AssignPresentationDto } from "./sql/models";
import { AssignPresentationModel } from "../models";
import * as Schema from "../data/sql/schema";
import * as Promise from "bluebird";
import { injectable, inject } from "inversify";

@injectable()
export class AssignPresentationRepository extends BaseRepository<AssignPresentationDto, AssignPresentationModel> {
    constructor( @inject("Logger") log?: Log) {
        super(AssignPresentationDto, AssignPresentationModel, log);
    }
}
export default AssignPresentationRepository;
