"use client"

import { Companion, Message} from "@prisma/client"
import { ChatHeader } from "@/components/chat-header"
import { useRouter } from "next/router";
import { useState } from "react";
import { useCompletion } from "ai/react"

interface ChatClientProps{
    companion: Companion & {
        messages: Message[];
        _count: {
            messages: number;
        }
    }
}

export const ChatClient = ({companion}: ChatClientProps) => {

    const router = useRouter();
    const [messages, setMessages] = useState<any[]>(companion.messages);
    const {} = useCompletion();
    return(
        <div className="flex flex-col h-full p-4 space-y-2">
           <ChatHeader companion = {companion} />
        </div>
    )
}