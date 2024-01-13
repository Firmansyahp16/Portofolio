const supabase = require("../configs/dbConfig");

let getRoles = async (req, res) => {
  try {
    let roles = (await supabase.from("roles").select("*")).data;
    res.status(200).send({
      status: "Success",
      message: "All User's Roles retrieved",
      data: roles,
    });
  } catch (error) {
    res.send({
      status: "Error",
      message: "Internal Server Error",
      data: null,
    });
  }
};

let getRole = async (req, res) => {
  const id = req.params.user_id;
  try {
    let role = (await supabase.from("roles").select().eq("user_id", id)).data;
    if (role && role.length > 0) {
      res.status(200).send({
        status: "Success",
        message: "User's role retrieved",
        data: role,
      });
    } else {
      res.status(404).send({
        status: "Error",
        message: "User's role with specified ID not found",
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

let updateRole = async (req, res) => {
  const id = req.params.user_id;
  try {
    let newRole = (
      await supabase.from("roles").update(req.body).eq("user_id", id).select()
    ).data;
    res.status(200).send({
      status: "Success",
      message: "User's role updated",
      data: newRole,
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
      data: null,
    });
  }
};

let newRole = async (req, res) => {
  try {
    let newRole = (await supabase.from("roles").insert(req.body).select()).data;
    if (newRole !== null) {
      let id = req.body.user_id;
      let role = (await supabase.from("roles").select().eq("user_id", id)).data;
      if (role !== null) {
        res.status(200).send({
          status: "Success",
          message: "New User's role added",
          data: role,
        });
      } else {
        res.status(500).send({
          status: "Error",
          message: "New User's role not added",
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

let deleteRole = async (req, res) => {
  const id = req.params.user_id;
  try {
    let check = (await supabase.from("roles").select().eq("user_id", id)).data;
    if (check && check.length === 0) {
      await supabase.from("roles").delete().eq("user_id", id);
      res.status(200).send({
        status: "Success",
        message: "User's role with specified ID deleted",
        data: null,
      });
    } else {
      res.status(404).send({
        status: "Error",
        message: "User with specified ID not found",
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
  getRoles,
  getRole,
  updateRole,
  newRole,
  deleteRole,
};
