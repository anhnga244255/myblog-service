/**
 * Created by phuongho on 15/08/17.
 */
import * as dotEnv from "dotenv";
import * as sourceMapSupport from "source-map-support";
import Application from "./app";
import { config, logger } from "./libs";

if (process.env.NODE_ENV !== "production") {
    sourceMapSupport.install();
}
dotEnv.config({ });
// Bootstrap new app
new Application(logger, logger.getTransportLogger()).listen(config.port);
