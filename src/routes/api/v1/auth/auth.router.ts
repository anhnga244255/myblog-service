/**
 * Created by phuongho on 15/08/17.
 */

import * as express from "express";
import { AuthHandler } from "./auth.handler";
import { isAuthenticated, hasPrivilege } from "../../../../middlewares";
import { ROLE } from "../../../../libs/constants";

const router = express.Router();

router.route("/login")
    .post(AuthHandler.login);

router.route("/register")
    .post(AuthHandler.register);

router.route("/firebase")
    .post(isAuthenticated, AuthHandler.firebaseLogin);

router.route("/logout")
    .post(isAuthenticated, hasPrivilege([ROLE.USER]), AuthHandler.logout);

export default router;
