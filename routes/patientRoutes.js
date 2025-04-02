const express = require("express");
const {
  addPatient,
  getQueue,
  treatNext,
  dischargePatient,
} = require("../services/queueService");

const router = express.Router();

router.post("/add", addPatient);
router.get("/queue", getQueue);
router.patch("/treatment", treatNext);
router.patch("/:id/discharge", dischargePatient); // FIXED the route

module.exports = router;
