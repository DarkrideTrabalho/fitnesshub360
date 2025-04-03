import React, { useState, FormEvent } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // Ajuste o caminho conforme necessário

interface Message {
  sender: "user" | "system";
  text: string;
}

interface ChatBoxProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => void;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  initialMessages = [{ sender: "system", text: "" }],
  onSendMessage,
}) => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [messageInput, setMessageInput] = useState("");

  //   const handleSendMessage = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (!messageInput.trim()) return;

  //     // Adiciona mensagem do usuário
  //     setMessages((prev) => [...prev, { sender: "user", text: messageInput }]);

  //     // Simula uma resposta do sistema após 1 segundo
  //     setTimeout(() => {
  //       setMessages((prev) => [
  //         ...prev,
  //         {
  //           sender: "system",
  //           text: "Obrigado pelo seu contato! Um de nossos atendentes retornará em breve.",
  //         },
  //       ]);
  //     }, 1000);

  //     setMessageInput("");
  //   };
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    // Adiciona mensagem do usuário
    setMessages((prev) => [...prev, { sender: "user", text: messageInput }]);

    // Simula uma resposta do sistema após 1 segundo
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: "Obrigado pelo seu contato! Iremos responder o mais breve possivel",
        },
      ]);
    }, 1000);

    setMessageInput("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-slate-100"
    >
      <div className="flex flex-col h-[350px]">
        <div className="flex-1 overflow-y-auto mb-4 p-4 bg-white rounded-lg">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  msg.sender === "user"
                    ? "bg-primary text-white"
                    : "bg-slate-200 text-slate-800"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 rounded-lg border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" variant="default" size="sm">
            Enviar
          </Button>
        </form>
      </div>
    </motion.div>
  );
};

export default ChatBox;
