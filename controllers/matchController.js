const MatchRequest = require("../models/MatchRequest");
const Chat = require("../models/Chat");

exports.sendRequest = async (req, res) => {
  try {
    const { receiverId } = req.body;
    const senderId = req.user.userId;

    // Prevent sending request to yourself
    if (receiverId === senderId) {
      return res
        .status(400)
        .json({ message: "You cannot send request to yourself" });
    }

    // Check if pending request already sent
    const existing = await MatchRequest.findOne({
      senderId,
      receiverId,
      status: "pending",
    });

    if (existing) {
      return res.status(400).json({ message: "Request already sent" });
    }

    // Check reverse request
    const reverse = await MatchRequest.findOne({
      senderId: receiverId,
      receiverId: senderId,
      status: "pending",
    });

    if (reverse) {
      return res
        .status(400)
        .json({ message: "This user already sent you a request" });
    }

    // Check already matched
    const matched = await MatchRequest.findOne({
      $or: [
        { senderId, receiverId, status: "accepted" },
        { senderId: receiverId, receiverId: senderId, status: "accepted" },
      ],
    });

    if (matched) {
      return res.status(400).json({ message: "You are already matched" });
    }

    // Create request
    await MatchRequest.create({ senderId, receiverId });

    res.json({ message: "Match request sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



exports.getRequests = async (req, res) => {
  try {
    const userId = req.user.userId;

    const requests = await MatchRequest.find({
      receiverId: userId,
      status: "pending",
    }).populate("senderId", "name email gender");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    const request = await MatchRequest.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    request.status = "accepted";
    await request.save();

    // Create chat
    const chat = await Chat.create({
      members: [request.senderId, request.receiverId],
    });

    res.json({ message: "Request accepted", chatId: chat._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.body;

    await MatchRequest.findByIdAndUpdate(requestId, { status: "rejected" });

    res.json({ message: "Request rejected" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserChats = async (req, res) => {
  const userId = req.user.userId;

  const chats = await Chat.find({
    participants: userId,
  })
    .populate("participants", "name email")
    .sort({ updatedAt: -1 });

  res.json(chats);
};