const supabase = require("../configs/dbConfig");

let getAttendances = async (req, res) => {
  try {
    let attendances = (await supabase.from("attendances").select("*")).data;
    res.status(200).send({
      status: "Success",
      message: "All Attendances retrieved",
      data: attendances,
    });
  } catch (error) {
    res.send({
      status: "Error",
      message: "Internal Server Error",
      data: null,
    });
  }
};

let getAttendance = async (req, res) => {
  const id = req.params.attendance_id;
  try {
    let attendance = (await supabase.from("attendances").select().eq("attendance_id", id)).data;
    if (attendance && attendance.length > 0) {
      res.status(200).send({
        status: "Success",
        message: "Attendance with specified ID retrieved",
        data: attendance,
      });
    } else {
      res.status(404).send({
        status: "Error",
        message: "Attendance with specified ID not found",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
      data: null,
    });
  }
};

let updateAttendance = async (req, res) => {
  const id = req.params.attendance_id;
  try {
    let newAttendance = (
      await supabase.from("attendances").update(req.body).eq("attendance_id", id).select()
    ).data;
    res.status(200).send({
      status: "Success",
      message: "Attendance updated",
      data: newAttendance,
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
      data: null,
    });
  }
};

let newAttendance = async (req, res) => {
  try {
    let newAttendance = (await supabase.from("attendances").insert(req.body).select()).data;
    if (newAttendance !== null) {
      let id = req.body.attendance_id;
      let attendance = (await supabase.from("attendances").select().eq("attendance_id", id)).data;
      if (attendance !== null) {
        res.status(200).send({
          status: "Success",
          message: "New Attendance added",
          data: attendance,
        });
      } else {
        res.status(500).send({
          status: "Error",
          message: "New Attendance not added",
          data: null,
        });
      }
    }
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
      data: null,
    });
  }
};

let deleteAttendance = async (req, res) => {
  const id = req.params.attendance_id;
  try {
    let check = (await supabase.from("attendances").select().eq("attendance_id", id)).data;
    if (check && check.length > 0) {
      await supabase.from("attendances").delete().eq("attendance_id", id);
      res.status(200).send({
        status: "Success",
        message: "Attendance with specified ID deleted",
        data: null,
      });
    } else {
      res.status(404).send({
        status: "Error",
        message: "Attendance with specified ID not found",
        data: null,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
      data: null,
    });
  }
};

module.exports = {
  getAttendances,
  getAttendance,
  updateAttendance,
  newAttendance,
  deleteAttendance,
};
