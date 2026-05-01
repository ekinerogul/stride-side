const UserService = require("./user-service");
const Guide = require("../models/guide");

class GuideService extends UserService {}

module.exports = new GuideService(Guide);
