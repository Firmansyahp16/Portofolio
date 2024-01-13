const router = require("express").Router();

const branchController = require("../controllers/branchController");

router.get("/", branchController.getBranches);
router.get("/:branch_id", branchController.getBranch);
router.post("/", branchController.newBranch);
router.put("/:branch_id", branchController.updateBranch);
router.delete("/:branch_id", branchController.deleteBranch);

module.exports = router;
