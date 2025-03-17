import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Contest" }] // User bookmarks contests
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;
