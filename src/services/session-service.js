const BaseService = require("./base-service");
const Session = require("../models/session");

class SessionService extends BaseService {
  async findByGuide(guideId) {
    return this.findBy("guide", guideId);
  }

  async findByAthlete(athleteId) {
    return this.findBy("athlete", athleteId);
  }

  async updateStatus(sessionId, status) {
    return this.update(sessionId, { "status.current": status });
  }

  async confirm(sessionId) {
    const session = await this.find(sessionId);
    if (!session) throw new Error("Session not found.");

    const update = { "status.current": "confirmed" };

    if (session.status.applicantType === "athlete") {
      update.athlete = session.status.applicant;
    } else if (session.status.applicantType === "guide") {
      update.guide = session.status.applicant;
    }

    return this.update(sessionId, update);
  }

  async apply(sessionId, applicantId, applicantType) {
    const session = await this.find(sessionId);

    if (!session) throw new Error("Session not found.");
    if (session.status.current !== "open")
      throw new Error("Session is not open.");

    if (session.athlete?._id?.toString() === applicantId) {
      throw new Error("You cannot apply to your own session.");
    }
    if (session.guide?._id?.toString() === applicantId) {
      throw new Error("You cannot apply to your own session.");
    }

    return this.update(sessionId, {
      "status.current": "applied",
      "status.applicant": applicantId,
      "status.applicantType": applicantType === "athlete" ? "athlete" : "guide",
    });
  }

  async addReview(sessionId, rating, note, reviewerId, reviewerType) {
    const session = await this.find(sessionId);
    if (!session) throw new Error("Session not found.");
    if (session.status.current !== "completed") {
      throw new Error("Cannot add review to a session that is not completed.");
    }

    const athleteId = session.athlete?._id?.toString();
    const guideId = session.guide?._id?.toString();
    if (reviewerId !== athleteId && reviewerId !== guideId) {
      throw new Error("You are not a participant of this session.");
    }

    const update = {};
    if (reviewerType === "athlete") {
      update.athleteReview = note;
      update.athleteRating = rating;
    } else if (reviewerType === "guide") {
      update.guideReview = note;
      update.guideRating = rating;
    }
    return this.update(sessionId, update);
  }

  async insert(sessionData) {
    if (!sessionData.guide && !sessionData.athlete) {
      throw new Error("Session must have either a guide or an athlete.");
    }
    return await this.model.create(sessionData);
  }
}

module.exports = new SessionService(Session);
