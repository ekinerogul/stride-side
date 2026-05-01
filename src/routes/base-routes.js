const auth = require("../middleware/auth");
const { loginLimiter } = require("../middleware/rate-limiter");
const bcrypt = require("bcrypt");
const { update } = require("../services/athlete-service");

module.exports = function registerBaseRoutes(
  router,
  service,
  sessionService,
  entityName,
  idParam,
  extraInsertFields = [],
) {
  router.get("/", auth, async (req, res, next) => {
    try {
      res.json(await service.load());
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

      for (const field of extraInsertFields) {
        if (req.body[field] !== undefined) {
          insertData[field] = req.body[field];
        }
      }

      const entity = await service.insert(insertData);
      res.status(201).json(entity);
    } catch (e) {
      next(e);
    }
  });

  router.post("/login", loginLimiter, async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const result = await service.login(email, password, entityName);
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
      res.json(await service.query(query));
    } catch (e) {
      next(e);
    }
  });

  router.get(`/:${idParam}`, auth, async (req, res, next) => {
    try {
      const entity = await service.find(req.params[idParam]);
      if (!entity)
        return res.status(404).json({
          error: { message: `Cannot find ${entityName}`, status: 404 },
        });
      res.json(entity);
    } catch (e) {
      next(e);
    }
  });

  router.patch(`/:${idParam}`, auth, async (req, res, next) => {
    try {
      if (req.user.id !== req.params[idParam]) {
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
      if (runningExperience) update.Data.runningExperience = runningExperience;

      for (const field of extraInsertFields) {
        if (req.body[field] !== undefined) {
          updateData[field] = req.body[field];
        }
      }

      if (password) {
        updateData.password = await bcrypt.hash(password, 10);
      }

      await service.update(req.params[idParam], updateData);
      res.status(200).json({ message: "Updated successfully" });
    } catch (e) {
      next(e);
    }
  });

  router.delete(`/:${idParam}`, auth, async (req, res, next) => {
    try {
      if (req.user.id !== req.params[idParam]) {
        return res
          .status(403)
          .json({ error: { message: "Unauthorized", status: 403 } });
      }
      await service.removeBy("_id", req.params[idParam]);
      res.status(200).json({ message: "Deleted successfully" });
    } catch (e) {
      next(e);
    }
  });

  router.get(`/:${idParam}/sessions`, auth, async (req, res, next) => {
    try {
      if (req.user.id !== req.params[idParam]) {
        return res
          .status(403)
          .json({ error: { message: "Unauthorized", status: 403 } });
      }
      const sessions =
        entityName === "athlete"
          ? await sessionService.findByAthlete(req.params[idParam])
          : await sessionService.findByGuide(req.params[idParam]);
      res.json(sessions);
    } catch (e) {
      next(e);
    }
  });
};
