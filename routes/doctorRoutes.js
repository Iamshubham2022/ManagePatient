const express = require("express");
const {
  setDoctorAvailability,
  getDoctorStatus,
} = require("../services/queueService");

const router = express.Router();

router.patch("/availability", setDoctorAvailability);
router.get("/status", getDoctorStatus);

module.exports = router;
