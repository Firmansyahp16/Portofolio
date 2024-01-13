const supabase = require("../configs/dbConfig");

let getUsers = async (req, res) => {
  try {
    let users = (await supabase.from("users").select("*")).data;
    res.status(200).send({
      status: "Success",
      message: "All Users retrieved",
      data: users,
    });
  } catch (error) {
    res.send({
      status: "Error",
      message: "Internal Server Error",
      data: null,
    });
  }
};

let getUser = async (req, res) => {
  const id = req.params.user_id;
  try {
    let user = (await supabase.from("users").select().eq("user_id", id)).data;
    if (user && user.length > 0) {
      res.status(200).send({
        status: "Success",
        message: "User retrieved",
        data: user,
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

let updateUser = async (req, res) => {
  const id = req.params.user_id;
  try {
    let newUser = (
      await supabase.from("users").update(req.body).eq("user_id", id).select()
    ).data;
    res.status(200).send({
      status: "Success",
      message: "User updated",
      data: newUser,
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
      data: null,
    });
  }
};

let newUser = async (req, res) => {
  try {
    let newUser = (await supabase.from("users").insert(req.body).select()).data;
    if (newUser !== null) {
      let id = req.body.user_id;
      let user = (await supabase.from("users").select().eq("user_id", id)).data;
      if (user !== null) {
        res.status(200).send({
          status: "Success",
          message: "New User added",
          data: user,
        });
      } else {
        res.status(500).send({
          status: "Error",
          message: "New User not added",
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

let deleteUser = async (req, res) => {
  const id = req.params.user_id;
  try {
    let check = (await supabase.from("users").select().eq("user_id", id)).data;
    if (check && check.length === 0) {
      await supabase.from("users").delete().eq("user_id", id);
      res.status(200).send({
        status: "Success",
        message: "User with specified ID deleted",
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
  getUsers,
  getUser,
  updateUser,
  newUser,
  deleteUser,
};
