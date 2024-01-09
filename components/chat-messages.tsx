"use client"

import { Companion } from "@prisma/client";
import { ChatMessage, ChatMessageProps } from "./chat-message";

interface ChatMessagesProps {
    messages: ChatMessageProps[];
    isLoading: boolean;
    companion: Companion;

}

export const ChatMessages = ({messages = [], isLoading, companion}: ChatMessagesProps) => {

    return(
        <div className="flex-1 overflow-y-auto pr-4">
            <ChatMessage
                src={companion.src}
                role="system"
                content={`Hello! I am ${companion.name}, ${companion.description}`}
            />
            <ChatMessage
                role="userId"
                content={`Hello! I am ${companion.name}, ${companion.description}`}
            />
        </div>
    )

}