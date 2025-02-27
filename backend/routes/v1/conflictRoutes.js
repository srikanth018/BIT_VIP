// routes/conflictRoutes.js
const express = require("express");
const conflictController = require("../../controllers/conflictController"); // Adjust the path as needed

const router = express.Router();

router.post("/conflicts", conflictController.createConflict);
router.get("/conflicts", conflictController.getConflicts);

module.exports = router;