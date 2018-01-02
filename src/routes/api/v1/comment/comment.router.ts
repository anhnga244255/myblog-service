import { isAuthenticated } from "./../../../../middlewares/index";
import * as express from "express";
import { CommentHandler } from "./comment.handler";
const router = express.Router();

router.route("/")
    .get(CommentHandler.list)
    .post(CommentHandler.create);

router.route("/:id")
    .delete(CommentHandler.delete)
    .put(CommentHandler.update);

export default router;

