/**
 * Created by phuongho on 15/08/17.
 */
import { BaseRepository, Log } from "./base.repository";
import { MediaDto } from "./sql/models";
import { MediaModel } from "../models";
import { injectable, inject } from "inversify";

@injectable()
export class MediaRepository extends BaseRepository<MediaDto, MediaModel> {
    constructor( @inject("Logger") log?: Log) {
        super(MediaDto, MediaModel, log);
    }
}
export default MediaRepository;
