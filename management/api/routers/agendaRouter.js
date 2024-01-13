const router = require("express").Router();

const agendaController = require("../controllers/agendaController");

router.get("/", agendaController.getAgendas);
router.get("/:agenda_id", agendaController.getAgenda);
router.post("/", agendaController.newAgenda);
router.put("/:agenda_id", agendaController.updateAgenda);
router.delete("/:agenda_id", agendaController.deleteAgenda);

module.exports = router;
