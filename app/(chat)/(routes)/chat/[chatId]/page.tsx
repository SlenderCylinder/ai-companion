import prismadb from "@/lib/prismadb";
import { auth, redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/dist/server/api-utils";

interface ChatIdPageProps {
    params: {
        chatId: string;
    }
}


const ChatIdPage = async ({params}: ChatIdPageProps) => {
    const {userId} = auth();

    if (!userId) {
        return redirectToSignIn();
    }

    const companion = await prismadb.companion.findUnique({
        where: {
            id: params.chatId
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
                where: {
                    userId,
                }
            },
            _count: {
                select: {
                    messages: true
                }
            }
        }
    })
    return (
        <div>
            Hello Chat!
        </div>
    );

}

export default ChatIdPage