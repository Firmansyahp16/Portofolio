const supabase = require("../configs/dbConfig");

let getBranches = async (req, res) => {
  try {
    let branches = (await supabase.from("branches").select("*")).data;
    res.status(200).send({
      status: "Success",
      message: "All Branches retrieved",
      data: branches,
    });
  } catch (error) {
    res.send({
      status: "Error",
      message: "Internal Server Error",
      data: null,
    });
  }
};

let getBranch = async (req, res) => {
  const id = req.params.branch_id;
  try {
    let branch = (await supabase.from("branches").select().eq("branch_id", id)).data;
    if (branch && branch.length > 0) {
      res.status(200).send({
        status: "Success",
        message: "Branch with specified ID retrieved",
        data: branch,
      });
    } else {
      res.status(404).send({
        status: "Error",
        message: "Branch with specified ID not found",
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

let updateBranch = async (req, res) => {
  const id = req.params.branch_id;
  try {
    let newBranch = (
      await supabase.from("branches").update(req.body).eq("branch_id", id).select()
    ).data;
    res.status(200).send({
      status: "Success",
      message: "Branch updated",
      data: newBranch,
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
      data: null,
    });
  }
};

let newBranch = async (req, res) => {
  try {
    let newBranch = (await supabase.from("branches").insert(req.body).select()).data;
    if (newBranch !== null) {
      let id = req.body.branch_id;
      let branch = (await supabase.from("branches").select().eq("branch_id", id)).data;
      if (branch !== null) {
        res.status(200).send({
          status: "Success",
          message: "New branch added",
          data: branch,
        });
      } else {
        res.status(500).send({
          status: "Error",
          message: "New Branch not added",
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

let deleteBranch = async (req, res) => {
  const id = req.params.branch_id;
  try {
    let check = (await supabase.from("branches").select().eq("branch_id", id)).data;
    if (check && check.length > 0) {
      await supabase.from("branches").delete().eq("branch_id", id);
      res.status(200).send({
        status: "Success",
        message: "Branch with specified ID deleted",
        data: null,
      });
    } else {
      res.status(404).send({
        status: "Error",
        message: "Branch with specified ID not found",
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
  getBranches,
  getBranch,
  updateBranch,
  newBranch,
  deleteBranch,
};
