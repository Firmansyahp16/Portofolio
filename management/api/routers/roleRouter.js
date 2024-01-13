const router = require("express").Router();

const roleRouter = require("../controllers/roleController");

router.get("/", roleRouter.getRoles);
router.get("/:user_id", roleRouter.getRole);
router.post("/", roleRouter.newRole);
router.put("/:user_id", roleRouter.updateRole);
router.delete("/:user_id", roleRouter.deleteRole);

module.exports = router;
