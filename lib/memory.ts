import { Redis } from "@upstash/redis"
import { OpenAIEmbeddings } from "langchain/embeddings/openai"
import { Pinecone } from '@pinecone-database/pinecone';
import { PineconeStore } from "@langchain/vectorstores/pinecone"