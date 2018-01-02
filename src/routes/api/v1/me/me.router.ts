/**
 * Created by phuongho on 15/08/17.
 */
import * as express from "express";
import { MeHandler } from "./me.handler";
import { isAuthenticated, hasPrivilege, hasCache } from "../../../../middlewares";
import { ROLE } from "../../../../libs/constants";

const router = express.Router();

router.route("/password")
.put(isAuthenticated, MeHandler.changePassword);

router.route("/")
    .get(isAuthenticated, MeHandler.profile)
    .put(isAuthenticated, MeHandler.updateProfile);

export default router;
