const User = require("../models/user.model");
const Plan = require("../models/plans.model");

// User subscribes to a plan
exports.subscribeToPlan = async (req, res) => {
  try {
    const planId = req.body.planId;

    // Check if plan exists
    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ message: "Plan not found" });
    }

    // Update user's subscription
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        subscription: {
          plan: plan._id,
          subscribedAt: new Date(),
        },
      },
      { new: true }
    ).populate("subscription.plan", "name price description");

    res.json({
      message: "Subscription successful",
      subscription: user.subscription,
    });
  } catch (err) {
    console.error("Error subscribing to plan:", err.message);
    res.status(500).json({ message: "Error subscribing to plan" });
  }
};
