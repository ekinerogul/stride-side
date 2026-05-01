const UserService = require("./user-service");
const Athlete = require("../models/athlete");

class AthleteService extends UserService {
  async findByDisabilityType(disabilityType) {
    return this.findBy("disabilityType", disabilityType);
  }

  async findByDisabilityLevel(disabilityLevel) {
    return this.findBy("disabilityLevel", disabilityLevel);
  }

  async findByGuideDogUsage(usesGuideDog) {
    return this.findBy("usesGuideDog", usesGuideDog);
  }
}
module.exports = new AthleteService(Athlete);
