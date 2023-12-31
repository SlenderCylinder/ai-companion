"use client"

import { Companion, Message} from "@prisma/client"
import { ChatHeader } from "@/components/chat-header"
import { ChatForm } from "@/components/chat-form";
import { ChatMessages } from "@/components/chat-messages";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
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
    const {input, isLoading, handleInputChange, handleSubmit, setInput} = useCompletion(
        {api:`/api/chat/${companion.id}`, onFinish(prompt, completion) {
            const systemMessage = {
                role: "system",
                content: completion,
            }

            setMessages((current) => [...current, systemMessage]);
            setInput("");

            router.refresh();
    }});

    const onSubmit = (E: FormEvent<HTMLFormElement>) => {
        const userMessage = {
            role: "user",
            content: input,
        };

        setMessages((current) => [...current, userMessage]);
    }
    return(
        <div className="flex flex-col h-full p-4 space-y-2">
           <ChatHeader companion = {companion} />
           <ChatMessages
                companion={companion}
                isLoading={isLoading}
                messages={messages}
            />
           <ChatForm
                isLoading={isLoading}
                input={input}
                handleInputChange={handleInputChange}
                onSubmit={onSubmit}
            />
        </div>
    )
}