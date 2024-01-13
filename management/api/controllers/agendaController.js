const supabase = require("../configs/dbConfig");

let getAgendas = async (req, res) => {
  try {
    let agendas = (await supabase.from("agendas").select("*")).data;
    res.status(200).send({
      status: "Success",
      message: "All Agendas retrieved",
      data: agendas,
    });
  } catch (error) {
    res.send({
      status: "Error",
      message: "Internal Server Error",
      data: null,
    });
  }
};

let getAgenda = async (req, res) => {
  const id = req.params.agenda_id;
  try {
    let agenda = (await supabase.from("agendas").select().eq("agenda_id", id)).data;
    if (agenda && agenda.length > 0) {
      res.status(200).send({
        status: "Success",
        message: "Agenda with specified ID retrieved",
        data: agenda,
      });
    } else {
      res.status(404).send({
        status: "Error",
        message: "Agenda with specified ID not found",
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

let updateAgenda = async (req, res) => {
  const id = req.params.agenda_id;
  try {
    let newAgenda = (
      await supabase.from("agendas").update(req.body).eq("agenda_id", id).select()
    ).data;
    res.status(200).send({
      status: "Success",
      message: "Agenda updated",
      data: newAgenda,
    });
  } catch (error) {
    res.status(500).send({
      status: "Error",
      message: "Internal Server Error",
      data: null,
    });
  }
};

let newAgenda = async (req, res) => {
  try {
    let newAgenda = (await supabase.from("agendas").insert(req.body).select()).data;
    if (newAgenda !== null) {
      let id = req.body.agenda_id;
      let agenda = (await supabase.from("agendas").select().eq("agenda_id", id)).data;
      if (agenda !== null) {
        res.status(200).send({
          status: "Success",
          message: "New Agenda added",
          data: agenda,
        });
      } else {
        res.status(500).send({
          status: "Error",
          message: "New Agenda not added",
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

let deleteAgenda = async (req, res) => {
  const id = req.params.agenda_id;
  try {
    let check = (await supabase.from("agendas").select().eq("agenda_id", id)).data;
    if (check && check.length > 0) {
      await supabase.from("agendas").delete().eq("agenda_id", id);
      res.status(200).send({
        status: "Success",
        message: "Agenda with specified ID deleted",
        data: null,
      });
    } else {
      res.status(404).send({
        status: "Error",
        message: "Agenda with specified ID not found",
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
  getAgendas,
  getAgenda,
  updateAgenda,
  newAgenda,
  deleteAgenda,
};
