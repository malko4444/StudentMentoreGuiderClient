"use client";
import { create } from "zustand";
import { io } from "socket.io-client";
import { useStudentAuth } from "./studentAuth";
import { useAuthStore } from "./useAuthStore";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";




export const useChatStore = create((set, get) => ({
  socket: null,
  messages: [],
  currentChat: null,
  currentChatPartner: null,
  onlineUsers: new Map(),

  // 🔄 Set current chat partner for message filtering
  setCurrentChatPartner: (partnerId) => set({ currentChatPartner: partnerId }),

  // 🧹 Clear messages when switching chats
  clearMessages: () => set({ messages: [] }),

  // 🔌 Initialize socket connection
  connectSocket: (userId) => {
    // prevent duplicate sockets
    if (get().socket) return;

    const socket = io(baseURL, {
      withCredentials: true, // important for cookies/session auth
      transports: ["websocket", "polling"], // fallback support
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // ✅ Connection established
    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
      socket.emit("join", userId);
    });

    // 🧠 Connection lost
    socket.on("disconnect", (reason) => {
      console.warn("🔴 Socket disconnected:", reason);
      set({ socket: null });
    });

    // 🔁 Reconnect
    socket.on("reconnect_attempt", () => {
      console.log("♻️ Trying to reconnect...");
    });

    // 📨 Receive message
    socket.on("receive_message", (message) => {
      console.log("📩 Received:", message);

      // Get current state for filtering
      const { currentChatPartner } = get();
      // get the current user id from auth store but first get the mentor id from local storage  if mentorId avialble use this as mentor other get the student id from the student auth store
      const mentorId = localStorage.getItem("mentorId");
      const studentId = useStudentAuth.getState().id;
      const currentUserId = mentorId || studentId;

      // Filter: Only add message if it belongs to current conversation
      const isRelevantMessage =
        (message.senderId === currentChatPartner && message.receiverId === currentUserId) ||
        (message.senderId === currentUserId && message.receiverId === currentChatPartner);

      if (isRelevantMessage) {
        const currentMessages = get().messages;
        console.log("in the messaeg updation", isRelevantMessage, currentMessages);

        // 1️⃣ Update messages in store (dedupe by _id if present)
        set((state) => {
          if (message._id && state.messages.some((m) => m._id === message._id)) {
            return { messages: state.messages };
          }
          return { messages: [...state.messages, message] };
        });
      }
      console.log("📩 Received:fgdfgdfgdg", message);


      // 2️⃣ Show browser notification if sender is not current user
      if (message.senderId !== currentUserId) {
        console.log("in the notification block");
        
        const senderName = message.senderRole === "mentor" ? "Mentor" : "Student";

        if ("Notification" in window && Notification.permission === "granted") {
          const notification = new Notification(`${senderName} sent a message`, {
            body: message.text,
            icon: "/chat-icon.png",
            tag: message.conversationId,
          });

          // 3️⃣ When notification clicked → navigate to chat
          notification.onclick = () => {
            window.focus();
            window.location.href = `/chat/${message.senderId}`;
          };
        }
      }else {console.log("Notification not sent: Sender is current user");
      }
    });


    // 💬 Conversation started
    socket.on("conversation_started", (conversation) => {
      console.log("💬 Conversation started:", conversation);
      set({ currentChat: conversation });
    });

    // ⚠️ Server error messages
    socket.on("error_message", (msg) => {
      console.error("❌ Socket Error:", msg);
    });

    // 🧹 Save the socket instance
    set({ socket });
  },

  // 🧠 Start a conversation
  startConversation: (senderId, receiverId) => {
    const { socket } = get();
    if (!socket) return console.error("❌ Socket not connected");
    socket.emit("start_conversation", { senderId, receiverId });
  },

  // ✉️ Send a message
  sendMessage: (senderId, receiverId, text) => {
    const { socket, messages } = get();
    if (!socket) return console.error("❌ Socket not connected");

    // ✅ Get role from the auth store
    const { role } = useStudentAuth.getState();
    console.log("Role in chat store:", role);

    // Add role to message payload if needed
    if (!senderId || !receiverId || !text) {
      console.log("Missing fields");
      return;
    }
    const currentRole = role || "mentor";
    console.log("Current role:", currentRole); 
    const message = { senderId, receiverId, text, senderRole: currentRole };

    console.log("💬 Sending message:", message);

    socket.emit("send_message", message);

    // Optimistic UI update
    set({ messages: [...messages, message] });
  },


  // 🧹 Disconnect manually (optional)
  disconnectSocket: () => {
    const socket = get().socket;
    if (socket) {
      socket.disconnect();
      console.log("🔌 Socket disconnected manually");
      set({ socket: null });
    }
  },
}));
