"use client"

import { Companion } from "@prisma/client";

interface ChatMessagesProps {
    messages: any[];
    isLoading: boolean;
    companion: Companion;

}

export const ChatMessages = ({messages = [], isLoading, companion}: ChatMessagesProps) => {
    return(
        <div>
            Chat messages go here!.
        </div>
    )

}