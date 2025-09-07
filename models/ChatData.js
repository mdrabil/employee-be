import mongoose from "mongoose";

const { Schema, model } = mongoose;

const employeeChatSchema = new Schema({
  from: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" }, // optional, group chat can be handled differently
  message: { type: String, required: true },
  type: { type: String, enum: ["text", "image", "file"], default: "text" },
  read: { type: Boolean, default: false }
}, { timestamps: true });

// Auto populate sender & receiver
function autoPopulate(next) {
  this.populate([
    { path: "from", select: "firstName lastName email role" },
    { path: "to", select: "firstName lastName email role" }
  ]);
  next();
}

["find", "findOne", "findById"].forEach(hook => employeeChatSchema.pre(hook, autoPopulate));

export default model("EmployeeChat", employeeChatSchema);
