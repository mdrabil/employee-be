
import EmployeeChat from "../models/ChatData.js";
import EmployeeModel from "../models/EmployeeModel.js";


// 🔹 Get all messages

// 🔹 Get all messages
export const RecevedMessage = async (req, res) => {
  try {
    const messages = await EmployeeChat.find().sort({ createdAt: 1 });
    res.json({ success: true, data: messages });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// 🔹 Send message with employee validation
export const SendMessage = async (req, res) => {
  try {
    const { from, to, message, type } = req.body;

    // ✅ Check if 'from' employee exists
    const fromEmployee = await EmployeeModel.findById(from);
    if (!fromEmployee) {
      return res.status(400).json({ success: false, message: "'from' employee not found" });
    }

    // ✅ Optional: Check if 'to' employee exists
    const toEmployee = await EmployeeModel.findById(to);
    if (!toEmployee) {
      return res.status(400).json({ success: false, message: "'to' employee not found" });
    }

    const chat = new EmployeeChat({ from, to, message, type });
    await chat.save();

    // Emit via socket.io
    if (req.io) {
      req.io.emit("newMessage", chat);
    }

    res.status(201).json({ success: true, data: chat });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// 🔹 Mark message read
export const MarkReadChat = async (req, res) => {
  try {
    const msg = await EmployeeChat.findById(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: "Message not found" });
    msg.read = true;
    await msg.save();
    res.json({ success: true, data: msg });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

