const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ message: "Stride-Side API" });
});

module.exports = router;
