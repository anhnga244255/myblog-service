import { Language } from "./../../../libs/languages/language";
/**
 * Created by phuongho on 15/08/17.
 */
import * as express from "express";
import application from "./application/application.router";
import auth from "./auth/auth.router";
import country from "./country/country.router";
import health from "./health/health.router";
import me from "./me/me.router";
import media from "./media/media.router";
import packages from "./packages/packages.router";
import presentations from "./presentations/presentation.router";
import roles from "./roles/roles.router";
import settings from "./settings/settings.router";
import tags from "./tags/tags.router";
import userCode from "./user_code/user_code.router";
import users from "./users/users.router";
import languages from "./languages/language.router";
import category from "./category/category.router";
import articles from "./articles/articles.router";
import comment from "./comment/comment.router";

const router = express.Router();

router.use("/application", application);
router.use("/auth", auth);
router.use("/country", country);
router.use("/health", health);
router.use("/me", me);
router.use("/media", media);
router.use("/packages", packages);
router.use("/presentations", presentations);
router.use("/roles", roles);
router.use("/settings", settings);
router.use("/tags", tags);
router.use("/user_codes", userCode);
router.use("/users", users);
router.use("/languages", languages);
router.use("/category", category);
router.use("/articles", articles);
router.use("/comment", comment);

export default router;

