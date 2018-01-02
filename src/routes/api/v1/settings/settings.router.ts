/**
 * Created by davidho on 2/12/17.
 */

import { SettingHandler } from "./settings.handler";
import * as express from "express";
import { isAuthenticated, hasPrivilege, hasCache } from "../../../../middlewares";
import { ROLE } from "../../../../libs/constants";

const router = express.Router();
router.route("/:id")
    .put(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN]), SettingHandler.edit)
    .delete(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN]), SettingHandler.remove);

router.route("/")
    .get(isAuthenticated, SettingHandler.list)
    .post(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN]), SettingHandler.create);

export default router;
