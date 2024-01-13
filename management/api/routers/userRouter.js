const router = require("express").Router();

const userController = require("../controllers/userController");

router.get("/", userController.getUsers);
router.get("/:user_id", userController.getUser);
router.post("/", userController.newUser);
router.put("/:user_id", userController.updateUser);
router.delete("/:user_id", userController.deleteUser);

module.exports = router;
