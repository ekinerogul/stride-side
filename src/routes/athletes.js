const { athleteService, sessionService } = require("../services");
const router = require("express").Router();
const registerBaseRoutes = require("./base-routes");

registerBaseRoutes(
  router,
  athleteService,
  sessionService,
  "athlete",
  "athleteId",
  ["disabilityType", "disabilityLevel", "usesGuideDog"],
);

module.exports = router;
