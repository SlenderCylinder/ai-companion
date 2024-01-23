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

        const PineapiKey = process.env.PINECONE_API!;
        if (!PineapiKey) {
          throw new Error('Pinecone API key is missing.');
        }
        this.vectorDBClient = new Pinecone({
            apiKey: PineapiKey!,
            
        }
        
        );

        

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

    private generateRedisCompanionKey(CompanionKey: CompanionKey): string {
        return `${CompanionKey.companionName}-${CompanionKey.modelName}-${CompanionKey.userId}`;
    }

    public async writeToHistory(text: string, companionKey: CompanionKey) {
        if(!companionKey || typeof companionKey.userId == "undefined"){
            console.log("Companion key set incorrectly");
            return"";
        }

        const key = this.generateRedisCompanionKey(companionKey);
        const result = await this.history.zadd(key, {
            score: Date.now(),
            member: text,
        })

        return result;
    }

    public async readLatestHistory(companionKey: CompanionKey): Promise<string>{
        if(!companionKey || typeof companionKey.userId == "undefined"){
            return"";
        }

        const key = this.generateRedisCompanionKey(companionKey);
        let result = await this.history.zrange(key, 0, Date.now(), {
            byScore: true,
        });

        result = result.slice(-30).reverse();
        const recentChats = result.reverse().join("\n");
        return recentChats;
    }

    public async seedChatHistory(
        seedContent: string,
        delimiter: string = "\n",
        companionKey: CompanionKey
    ): Promise<void> {
        const key = this.generateRedisCompanionKey(companionKey);
    
        if (await this.history.exists(key)) {
            console.log("User already has chat history");
            return;
        }
    
        const content = seedContent.split(delimiter);
        let counter = 0;
    
        for (const line of content) {
            await this.history.zadd(key, { score: counter, member: line });
            counter += 1;
        }
    }
    
}
