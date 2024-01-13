const router = require("express").Router();

const attendanceController = require("../controllers/attendanceController");

router.get("/", attendanceController.getAttendances);
router.get("/:attendance_id", attendanceController.getAttendance);
router.post("/", attendanceController.newAttendance);
router.put("/:attendance_id", attendanceController.updateAttendance);
router.delete("/:attendance_id", attendanceController.deleteAttendance);

module.exports = router;
