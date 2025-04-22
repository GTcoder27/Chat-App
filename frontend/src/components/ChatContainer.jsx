import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef, useState } from "react";
import { axiosInstance } from "../lib/axios.js";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { useAuthStore } from "../store/useAuthStore";
import { formatMessageTime } from "../lib/utils";
import { Volume2 } from "lucide-react";
import axios from "axios";


const ChatContainer = () => {
  const [user_language, setuser_language] = useState("en");
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);

    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  let text_to_translate;
  const translate = async (text) => {
    try {
      const res = await axiosInstance.post("/messages/translate", {
        text: text,
      });
      setuser_language(res.data.user_language);
      return res.data.translatedText;
    } catch (e) {
      console.error("Translation failed:", e);
      return null;
    }
  };


  const TranslatedText = ({ text, targetLang }) => {
    const [translated, setTranslated] = useState("");

    useEffect(() => {
      const translateText = async () => {
        if (text) {
          const res = await translate(text, targetLang); // assumes translate is imported
          setTranslated(res);
        }
      };

      translateText();
    }, [text, targetLang]);

    const handleSpeak = async () => {

      try {
        const res = await axios.post("https://chat-app-1lut.onrender.com/api/messages/tts/text_to_voice", {
          text: translated,
          user_language,
        });
        const audioBase64 = res.data.pipelineResponse?.[0].audio?.[0].audioContent
        if (!audioBase64) return;
        const audio = new Audio("data:audio/wav;base64," + audioBase64);
        audio.play();
      } catch (error) {
        console.error("Error playing audio:", error);
      }
    };

    return (
      <div>
        <div className="text-sm">{text}</div>
        <div className="flex items-center gap-3">
          <span>{translated}</span>
          <button onClick={handleSpeak} className="bg-slate-50 ">
            <Volume2 size={13} className="text-blue-500 hover:text-blue-700" />
          </button>
        </div>
      </div>

    );
  };







  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message._id}
            className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`}
            ref={messageEndRef}
          >
            <div className=" chat-image avatar">
              <div className="size-10 rounded-full border">
                <img
                  src={
                    message.senderId === authUser._id
                      ? authUser.profilePic || authUser.pic
                      : selectedUser.profilePic || selectedUser.pic
                  }
                  alt="profile pic"
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              <time className="text-xs opacity-50 ml-1">
                {/* {formatMessageTime(message.createdAt)} */}
              </time>
            </div>
            <div className="chat-bubble flex flex-col">
              {message.image && (
                <img
                  src={message.image}
                  alt="Attachment"
                  className="sm:max-w-[200px] rounded-md mb-2"
                />
              )}
              <div>{message.text && <TranslatedText text={message.text} />}</div>
            </div>
          </div>
        ))}
      </div>

      <MessageInput />
    </div>
  );
};
export default ChatContainer;
