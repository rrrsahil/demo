const express = require("express");

const router = express.Router();

const {
  addItem,
  getItems,
  updateItem,
  deleteItem,
  resetChecklist,
} = require("../controllers/checklist.controller");

const { protect } = require("../middleware/auth.middleware");

router.post("/add", protect, addItem);
router.get("/:tripId", protect, getItems);
router.put("/update/:id", protect, updateItem);
router.delete("/delete/:id", protect, deleteItem);
router.put("/reset/:tripId", protect, resetChecklist);

module.exports = router;
