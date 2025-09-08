const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    // creds used during signup/login
    userName: { type: String }, // user/organization name
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // for profile update - intended to be used later
    profileImage: { type: String, default: "" },
    address: { type: String, default: "" },
    phone: { type: String, default: "" },
    country: { type: String, default: "" },

    // array of reference to event specific to particular user
    events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("User", userSchema);
