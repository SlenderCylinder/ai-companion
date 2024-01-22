import { Redis } from "@upstash/redis"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from 'langchain/vectorstores/pinecone'
import { StringValidation } from "zod";

export type CompanionKey = {
    companionName: string;
    modelName: string;
    userId: string;
};

export class MemoryManager {
    private static instance: MemoryManager;
    private history: Redis;
    private vectorDBClient: Pinecone;

    private constructor() {
        this.history = Redis.fromEnv();
        this.vectorDBClient = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY!,
        });
    }

    public async vectorSearch(
        recentChatHistory: string,
        companionFileName: string
    ) {
        const pineconeClient = this.vectorDBClient as Pinecone;
        const pineconeIndex = pineconeClient.Index(
            process.env.PINECONE_INDEX! || ""
        );

        const vectorStore = await PineconeStore.fromExistingIndex(
            new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY }),
            { pineconeIndex }
        );

        const similarDocs = await vectorStore
            .similaritySearch(recentChatHistory, 3, { fileName: companionFileName })
            .catch((err) => {
                console.log("Failed to get vector search results", err);
            });

        return similarDocs;
    }

    public static async getInstance(): Promise<MemoryManager> {
        if (!MemoryManager.instance) {
            MemoryManager.instance = new MemoryManager();
        }
        return MemoryManager.instance;
    }
}
