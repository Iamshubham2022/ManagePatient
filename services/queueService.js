const { v4: uuidv4 } = require("uuid");
const notificationService = require("./notificationService");

let io = null;
let erQueue = { 1: [], 2: [], 3: [], 4: [], 5: [] };
let currentTreatment = null;
let doctorAvailable = false;

const init = (socketIO) => {
  io = socketIO;
  notificationService.init(io);
};

// Broadcast updates
function broadcastUpdate() {
  if (!io) return console.error("Socket.IO not initialized");
  io.emit("update", { queue: erQueue, currentTreatment, doctorAvailable });
}

// Get Queue (Fix for "getQueue is not defined" issue)
const getQueue = (req, res) => {
  res.json({ queue: erQueue });
};

// Set doctor's availability
const setDoctorAvailability = (req, res) => {
  const { available } = req.body;
  if (typeof available !== "boolean") {
    return res
      .status(400)
      .json({ error: "Invalid data. Use { available: true/false }" });
  }

  doctorAvailable = available;
  broadcastUpdate();
  notificationService.notifyDoctorStatus(doctorAvailable);
  res.json({ message: "Doctor availability updated", doctorAvailable });
};

// Get doctor status
const getDoctorStatus = (req, res) => {
  res.json({
    doctorAvailable,
    treatingPatient: currentTreatment ? currentTreatment.name : null,
    queueSize: Object.values(erQueue).flat().length,
  });
};

// Add a patient
const addPatient = (req, res) => {
  const { name, triageLevel } = req.body;
  if (!name || ![1, 2, 3, 4, 5].includes(triageLevel)) {
    return res.status(400).json({ error: "Invalid patient data" });
  }

  const patient = { id: uuidv4(), name, triageLevel, arrivalTime: Date.now() };

  if (triageLevel === 1) {
    if (currentTreatment && currentTreatment.triageLevel > 1) {
      insertIntoQueue(currentTreatment);
    }
    currentTreatment = patient;
    notificationService.notifyCritical(patient);
  } else {
    insertIntoQueue(patient);
  }

  notificationService.notifyStaffing(Object.values(erQueue).flat().length);
  broadcastUpdate();
  res.status(201).json(patient);
};

// Insert into queue
function insertIntoQueue(patient) {
  const level = patient.triageLevel;
  erQueue[level].push(patient);
  erQueue[level].sort((a, b) => a.arrivalTime - b.arrivalTime);
}

// Treat next patient
const treatNext = (req, res) => {
  if (!doctorAvailable)
    return res.status(400).json({ error: "No doctor available" });

  for (let level = 1; level <= 5; level++) {
    if (erQueue[level].length > 0) {
      currentTreatment = erQueue[level].shift();
      broadcastUpdate();
      return res.json(currentTreatment);
    }
  }
  res.status(404).json({ error: "No patients in queue" });
};

// Discharge patient
const dischargePatient = (req, res) => {
  if (currentTreatment?.id === req.params.id) {
    currentTreatment = null;
  } else {
    for (let level = 1; level <= 5; level++) {
      erQueue[level] = erQueue[level].filter((p) => p.id !== req.params.id);
    }
  }
  broadcastUpdate();
  res.json({ message: "Patient discharged" });
};

module.exports = {
  init,
  addPatient,
  getQueue,
  treatNext,
  dischargePatient,
  setDoctorAvailability,
  getDoctorStatus,
};
