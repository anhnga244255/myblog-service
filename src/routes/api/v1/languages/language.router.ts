import { isAuthenticated } from "./../../../../middlewares/index";
import { Language } from "./../../../../libs/languages/language";
import * as express from "express";
import { LanguageHandler } from "./language.handler";
const router = express.Router();

router.route("/")
    .get(isAuthenticated, LanguageHandler.list)
    .post(isAuthenticated, LanguageHandler.create);

router.route("/:id")
    .delete(isAuthenticated, LanguageHandler.delete)
    .put(isAuthenticated, LanguageHandler.update);

export default router;

