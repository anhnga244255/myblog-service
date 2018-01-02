/**
 * Created by phuongho on 15/08/17.
 */
import * as express from "express";
import { TagHandler } from "./tags.handler";
import { isAuthenticated, hasPrivilege, hasCache } from "../../../../middlewares";
import { ROLE } from "../../../../libs/constants";

const router = express.Router();

router.route("/:id")
    .get(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN]), TagHandler.detail)
    .put(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN]), TagHandler.edit)
    .delete(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN]), TagHandler.delete);

router.route("/")
    .get(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN]), TagHandler.list)
    .post(isAuthenticated, hasPrivilege([ROLE.SYSTEM_ADMIN, ROLE.MANAGER, ROLE.COMPANY_ADMIN]), TagHandler.create);

export default router;
