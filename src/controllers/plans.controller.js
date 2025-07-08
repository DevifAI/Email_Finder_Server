import Plan from "../models";

// USER + ADMIN: View all plans
export const getPlans = async (req, res) => {
  try {
    const plans = await Plan.find().sort({ createdAt: -1 });
    res.json(plans);
  } catch (err) {
    console.error("Error fetching plans:", err.message);
    res.status(500).json({ message: "Error fetching plans" });
  }
};

// ADMIN: Create plan
export const createPlan = async (req, res) => {
  try {
    const { name, description, price, duration } = req.body;
    const plan = await Plan.create({ name, description, price, duration });
    res.status(201).json(plan);
  } catch (err) {
    console.error("Error creating plan:", err.message);
    res.status(500).json({ message: "Error creating plan" });
  }
};

// ADMIN: Update plan
export const updatePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json(plan);
  } catch (err) {
    console.error("Error updating plan:", err.message);
    res.status(500).json({ message: "Error updating plan" });
  }
};

// ADMIN: Delete plan
export const deletePlan = async (req, res) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) return res.status(404).json({ message: "Plan not found" });
    res.json({ message: "Plan deleted" });
  } catch (err) {
    console.error("Error deleting plan:", err.message);
    res.status(500).json({ message: "Error deleting plan" });
  }
};
