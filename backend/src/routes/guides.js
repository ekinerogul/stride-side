const { guideService, sessionService } = require("../services");
const router = require("express").Router();
const auth = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rate-limiter");
const bcrypt = require("bcrypt");

router.get("/", auth, async (req, res, next) => {
  try {
    res.json(await guideService.load());
  } catch (e) {
    next(e);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      location,
      languages,
      emergencyContact,
      notes,
      runningExperience,
    } = req.body;

    if (!name || !email || !password || !phone || !location) {
      return res.status(400).json({
        error: {
          message: "name, email, password, phone and location are required",
          status: 400,
        },
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json({ error: { message: "Invalid email format", status: 400 } });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: {
          message: "The password must be at least 6 characters long",
          status: 400,
        },
      });
    }

    const insertData = {
      name,
      email,
      password,
      phone,
      location,
      languages,
      emergencyContact,
      notes,
      runningExperience,
    };

    const guide = await guideService.insert(insertData);
    res.status(201).json(guide);
  } catch (e) {
    next(e);
  }
});

router.post("/login", loginLimiter, async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await guideService.login(email, password, "guide");
    if (!result)
      return res
        .status(401)
        .json({ error: { message: "Invalid credentials", status: 401 } });
    res.json(result);
  } catch (e) {
    next(e);
  }
});

router.get("/search", auth, async (req, res, next) => {
  try {
    const { name, rating, language, location } = req.query;
    const query = {};
    if (name)
      query.name = {
        $regex: name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    if (rating) query.rating = { $gte: Number(rating) };
    if (language) query.languages = language;
    if (location)
      query.location = {
        $regex: location.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
        $options: "i",
      };
    res.json(await guideService.query(query));
  } catch (e) {
    next(e);
  }
});

router.get("/:guideId", auth, async (req, res, next) => {
  try {
    const guide = await guideService.find(req.params.guideId);
    if (!guide)
      return res.status(404).json({
        error: { message: "Cannot find guide", status: 404 },
      });
    res.json(guide);
  } catch (e) {
    next(e);
  }
});

router.patch("/:guideId", auth, async (req, res, next) => {
  try {
    if (req.user.id !== req.params.guideId) {
      return res
        .status(403)
        .json({ error: { message: "Unauthorized", status: 403 } });
    }

    const {
      name,
      email,
      password,
      phone,
      location,
      languages,
      notes,
      runningExperience,
    } = req.body;

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res
          .status(400)
          .json({ error: { message: "Invalid email format", status: 400 } });
      }
    }

    if (password && password.length < 6) {
      return res.status(400).json({
        error: {
          message: "The password must be at least 6 characters long",
          status: 400,
        },
      });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;
    if (languages) updateData.languages = languages;
    if (notes) updateData.notes = notes;
    if (runningExperience) updateData.runningExperience = runningExperience;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    await guideService.update(req.params.guideId, updateData);
    res.status(200).json({ message: "Updated successfully" });
  } catch (e) {
    next(e);
  }
});

router.delete("/:guideId", auth, async (req, res, next) => {
  try {
    if (req.user.id !== req.params.guideId) {
      return res
        .status(403)
        .json({ error: { message: "Unauthorized", status: 403 } });
    }
    await guideService.removeBy("_id", req.params.guideId);
    res.status(200).json({ message: "Deleted successfully" });
  } catch (e) {
    next(e);
  }
});

router.get("/:guideId/sessions", auth, async (req, res, next) => {
  try {
    if (req.user.id !== req.params.guideId) {
      return res
        .status(403)
        .json({ error: { message: "Unauthorized", status: 403 } });
    }
    const sessions = await sessionService.findByGuide(req.params.guideId);
    res.json(sessions);
  } catch (e) {
    next(e);
  }
});

module.exports = router;
