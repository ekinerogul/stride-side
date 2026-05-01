const { sessionService } = require("../services");
const router = require("express").Router();
const auth = require("../middleware/auth");

router.post("/", auth, async (req, res, next) => {
  try {
    const { date, hour, location, distance, description } = req.body;

    if (!date || !hour || !location || !distance) {
      return res.status(400).json({
        error: {
          message: "date, hour, location and distance are required",
          status: 400,
        },
      });
    }

    const sessionData = { date, hour, location, distance, description };

    if (req.user.type === "athlete") {
      sessionData.athlete = req.user.id;
      sessionData.createdBy = req.user.id;
      sessionData.createdByType = "Athlete";
    } else if (req.user.type === "guide") {
      sessionData.guide = req.user.id;
      sessionData.createdBy = req.user.id;
      sessionData.createdByType = "Guide";
    }

    const session = await sessionService.insert(sessionData);
    res.status(201).json(session);
  } catch (e) {
    next(e);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const { location, date, status } = req.query;
    const query = {};
    if (location) query.location = location;
    if (date) query.date = date;
    if (status) query["status.current"] = status;
    res.json(await sessionService.query(query));
  } catch (e) {
    next(e);
  }
});

router.get("/:sessionId", async (req, res, next) => {
  try {
    const session = await sessionService.find(req.params.sessionId);
    if (!session)
      return res
        .status(404)
        .json({ error: { message: "Cannot find session", status: 404 } });
    res.json(session);
  } catch (e) {
    next(e);
  }
});

router.delete("/:sessionId", auth, async (req, res, next) => {
  try {
    const session = await sessionService.find(req.params.sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ error: { message: "Cannot find session", status: 404 } });
    }
    const ownerId =
      session.createdBy?._id?.toString() || session.createdBy?.toString();
    if (req.user.id !== ownerId) {
      return res
        .status(403)
        .json({ error: { message: "Unauthorized", status: 403 } });
    }
    await sessionService.removeBy("_id", req.params.sessionId);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (e) {
    next(e);
  }
});

router.patch("/:sessionId/apply", auth, async (req, res, next) => {
  try {
    const session = await sessionService.apply(
      req.params.sessionId,
      req.user.id,
      req.user.type,
    );
    res.json(session);
  } catch (e) {
    next(e);
  }
});

router.patch("/:sessionId/review", auth, async (req, res, next) => {
  try {
    const { rating, note } = req.body;
    const session = await sessionService.addReview(
      req.params.sessionId,
      rating,
      note,
      req.user.id,
      req.user.type,
    );
    res.json(session);
  } catch (e) {
    next(e);
  }
});

router.patch("/:sessionId/status", auth, async (req, res, next) => {
  try {
    const session = await sessionService.find(req.params.sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ error: { message: "Cannot find session", status: 404 } });
    }
    const ownerId =
      session.createdBy?._id?.toString() || session.createdBy?.toString();
    if (req.user.id !== ownerId) {
      return res.status(403).json({
        error: {
          message: "Only the session owner can update status",
          status: 403,
        },
      });
    }
    const { status } = req.body;
    const validStatuses = [
      "open",
      "applied",
      "confirmed",
      "completed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res
        .status(400)
        .json({ error: { message: "Invalid status value", status: 400 } });
    }
    const allowedTransitions = {
      open: ["cancelled"],
      applied: ["confirmed", "cancelled"],
      confirmed: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };
    if (!allowedTransitions[session.status.current]?.includes(status)) {
      return res.status(400).json({
        error: {
          message: `Cannot transition from '${session.status.current}' to '${status}'`,
          status: 400,
        },
      });
    }
    if (status === "confirmed") {
      const updated = await sessionService.confirm(req.params.sessionId);
      return res.json(updated);
    }
    const updated = await sessionService.updateStatus(
      req.params.sessionId,
      status,
    );
    res.json(updated);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
