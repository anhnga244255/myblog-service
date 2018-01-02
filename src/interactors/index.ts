import { ArticlesService } from "./articles.service";
import { CategoryService } from "./category.service";
import { CommentService } from "./comment.service";
/**
 * Created by phuongho on 15/08/17.
 */
import { AssignPresentationService } from "./assign_presentation.service";
import { CacheService } from "./cache.service";
import { DeviceService } from "./device.service";
import { DevOpsService } from "./devops.service";
import { LanguageService } from "./language.service";
import { MediaService } from "./media.service";
import { NotificationService } from "./notification.service";
import { PackageService } from "./package.service";
import { PresentationService } from "./presentation.service";
import { RoleService } from "./role.service";
import { SessionService } from "./session.service";
import { SettingService } from "./setting.service";
import { TagService } from "./tag.service";
import { UserCodeService } from "./user_code.service";
import { UserPackageService } from "./user_package.service";
import { UserPresentationService } from "./user_presentation.service";
import { UserService } from "./user.service";
import { UserTagService } from "./user_tag.service";
import {
    ApplicationRepository,
    AssignPresentationRepository,
    DeviceRepository,
    LanguageRepository,
    MediaRepository,
    PackageRepository,
    PresentationRepository,
    RoleRepository,
    SessionRepository,
    SettingRepository,
    TagRepository,
    UserCodeRepository,
    UserPackageRepository,
    UserPresentationRepository,
    UserRepository,
    UserTagRepository,
    CategoryRepository,
    ArticlesRepository,
    CommentRepository,
} from "../data";
import { FCMPush, FirebaseAdmin, JsonWebToken, Logger, Mailer } from "../libs";
import { fcm, firebase, jwt, logger, mailer } from "../libs";
import { Container } from "inversify";

export const IoC = new Container();

// register static libraries
IoC.bind<FCMPush>(FCMPush).toConstantValue(fcm);
IoC.bind<FirebaseAdmin>(FirebaseAdmin).toConstantValue(firebase);
IoC.bind<JsonWebToken>(JsonWebToken).toConstantValue(jwt);
IoC.bind<Logger>(Logger).toConstantValue(logger);
IoC.bind<Logger>("Logger").toConstantValue(logger);
IoC.bind<Mailer>(Mailer).toConstantValue(mailer);

// register repositories
IoC.bind<ApplicationRepository>(ApplicationRepository).toSelf();
IoC.bind<AssignPresentationRepository>(AssignPresentationRepository).toSelf();
IoC.bind<DeviceRepository>(DeviceRepository).toSelf();
IoC.bind<LanguageRepository>(LanguageRepository).toSelf();
IoC.bind<MediaRepository>(MediaRepository).toSelf();
IoC.bind<PackageRepository>(PackageRepository).toSelf();
IoC.bind<PresentationRepository>(PresentationRepository).toSelf();
IoC.bind<RoleRepository>(RoleRepository).toSelf();
IoC.bind<SessionRepository>(SessionRepository).toSelf();
IoC.bind<SettingRepository>(SettingRepository).toSelf();
IoC.bind<TagRepository>(TagRepository).toSelf();
IoC.bind<UserCodeRepository>(UserCodeRepository).toSelf();
IoC.bind<UserPackageRepository>(UserPackageRepository).toSelf();
IoC.bind<UserPresentationRepository>(UserPresentationRepository).toSelf();
IoC.bind<UserRepository>(UserRepository).toSelf();
IoC.bind<UserTagRepository>(UserTagRepository).toSelf();
IoC.bind<CategoryRepository>(CategoryRepository).toSelf();
IoC.bind<ArticlesRepository>(ArticlesRepository).toSelf();
IoC.bind<CommentRepository>(CommentRepository).toSelf();

// register services
IoC.bind<AssignPresentationService>(AssignPresentationService).toSelf();
IoC.bind<CacheService>(CacheService).toSelf();
IoC.bind<DeviceService>(DeviceService).toSelf();
IoC.bind<DevOpsService>(DevOpsService).toSelf();
IoC.bind<LanguageService>(LanguageService).toSelf();
IoC.bind<MediaService>(MediaService).toSelf();
IoC.bind<NotificationService>(NotificationService).toSelf();
IoC.bind<PackageService>(PackageService).toSelf();
IoC.bind<PresentationService>(PresentationService).toSelf();
IoC.bind<RoleService>(RoleService).toSelf();
IoC.bind<SessionService>(SessionService).toSelf();
IoC.bind<SettingService>(SettingService).toSelf();
IoC.bind<TagService>(TagService).toSelf();
IoC.bind<UserCodeService>(UserCodeService).toSelf();
IoC.bind<UserPackageService>(UserPackageService).toSelf();
IoC.bind<UserPresentationService>(UserPresentationService).toSelf();
IoC.bind<UserService>(UserService).toSelf();
IoC.bind<UserTagService>(UserTagService).toSelf();
IoC.bind<CategoryService>(CategoryService).toSelf();
IoC.bind<ArticlesService>(ArticlesService).toSelf();
IoC.bind<CommentService>(CommentService).toSelf();

export default IoC;

// Will be remove when support upper layer
export const assignPresentationService = IoC.get<AssignPresentationService>(AssignPresentationService);
export const cacheService = IoC.get<CacheService>(CacheService);
export const deviceService = IoC.get<DeviceService>(DeviceService);
export const devOpsService = IoC.get<DevOpsService>(DevOpsService);
export const languageService = IoC.get<LanguageService>(LanguageService);
export const mediaService = IoC.get<MediaService>(MediaService);
export const notificationService = IoC.get<NotificationService>(NotificationService);
export const packageService = IoC.get<PackageService>(PackageService);
export const presentationService = IoC.get<PresentationService>(PresentationService);
export const roleService = IoC.get<RoleService>(RoleService);
export const sessionService = IoC.get<SessionService>(SessionService);
export const settingService = IoC.get<SettingService>(SettingService);
export const tagService = IoC.get<TagService>(TagService);
export const userCodeService = IoC.get<UserCodeService>(UserCodeService);
export const userPackageService = IoC.get<UserPackageService>(UserPackageService);
export const userPresentationService = IoC.get<UserPresentationService>(UserPresentationService);
export const userService = IoC.get<UserService>(UserService);
export const userTagService = IoC.get<UserTagService>(UserTagService);
export const categoryService = IoC.get<CategoryService>(CategoryService);
export const articlesService = IoC.get<ArticlesService>(ArticlesService);
export const commentService = IoC.get<CommentService>(CommentService);
