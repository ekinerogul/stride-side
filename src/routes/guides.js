const { guideService, sessionService } = require("../services");
const router = require("express").Router();
const registerBaseRoutes = require("./base-routes");

registerBaseRoutes(router, guideService, sessionService, "guide", "guideId", [
  "guidingExperience",
]);

module.exports = router;
