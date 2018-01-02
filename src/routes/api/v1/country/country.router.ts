import * as express from "express";
import { CountryHandler } from "./country.handler";

const router = express.Router();

router.route("/states/:countryCode")
    .get(CountryHandler.listStates);

router.route("/provinces/:stateCode")
    .get(CountryHandler.listProvinces);

router.route("/")
    .get(CountryHandler.listCountry);

export default router;
