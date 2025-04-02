let io = null;

const init = (socketIO) => {
  io = socketIO;
};

// Notify all clients about a critical patient
const notifyCritical = (patient) => {
  const message = `Critical patient ${patient.name} (ID: ${patient.id}) requires immediate attention!`;
  console.log(message);

  if (io) io.emit("critical", { type: "critical", message });
};

// Notify all clients when patient queue exceeds the limit
const notifyStaffing = (patientCount) => {
  if (patientCount > 5) {
    const message = `Staff limit exceeded: ${patientCount} patients`;
    console.log(message);

    if (io) io.emit("staffing", { type: "staffing", message });
  }
};

// Notify all clients when doctor availability changes
const notifyDoctorStatus = (available) => {
  const message = `Doctor is now ${available ? "available" : "unavailable"}`;
  console.log(message);

  if (io)
    io.emit("doctor-status", { type: "doctor-status", message, available });
};

module.exports = { init, notifyCritical, notifyStaffing, notifyDoctorStatus };
