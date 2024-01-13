const router = require("express").Router();

const userRouter = require("./userRouter");
const roleRouter = require("./roleRouter");
const branchRouter = require("./branchRouter");
const agendaRouter = require("./agendaRouter");
const attendanceRouter = require("./attendanceRouter.js");

router.use("/user", userRouter);
router.use("/role", roleRouter);
router.use("/branch", branchRouter);
router.use("/agenda", agendaRouter);
router.use("/attendance", attendanceRouter);

module.exports = router;
