import { Request, Response } from "express";
import { createSupabaseClient } from "../helpers/superbaseClientHelpers";
import { Cohere, CohereEmbeddings } from "@langchain/cohere";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { ChatPromptTemplate, MessagesPlaceholder } from "@langchain/core/prompts";
import { createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
import { createRetrievalChain } from "langchain/chains/retrieval";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";

export class QueryDocumentService {
  async queryDocument(req: Request, res: Response) {
    try {
      const { conversationId, query, documentIds } = req.body;

      // Ensure documentIds is an array
      const docIds = Array.isArray(documentIds) ? documentIds : [documentIds];

      console.log("🧠 Incoming query:", query);
      console.log("🧵 Conversation ID:", conversationId);
      console.log("🔍 Filter document IDs:", documentIds);
      console.log("🔍 Document IDs type:", typeof documentIds);
      console.log("🔍 Document IDs array:", docIds);
      console.log("🔍 Filter being applied:", {
        document_ids: docIds,
      });

      const supabase = createSupabaseClient();

      // 🧪 Debug: Check what's in the database
      const { data: dbDocs, error: dbError } = await supabase
        .from("embedded_documents")
        .select("id, metadata, content")
        .limit(5);
      
      console.log("🗄️ Database docs sample:", dbDocs?.map(d => ({
        id: d.id,
        metadata: d.metadata,
        contentLength: d.content?.length || 0
      })));
      
      if (dbError) {
        console.error("❌ Database query error:", dbError);
      }

      // 🧪 Debug: Check for specific document IDs
      for (const docId of docIds) {
        const { data: specificDocs, error: specificError } = await supabase
          .from("embedded_documents")
          .select("id, metadata")
          .contains("metadata", { document_ids: [docId] });
        
        console.log(`🔍 Documents for ID ${docId}:`, specificDocs?.length || 0);
        if (specificError) {
          console.error(`❌ Error querying for ${docId}:`, specificError);
        }
      }

      await supabase.from("conversation_messages").insert({
        conversation_id: conversationId,
        role: "user",
        content: query,
      });

      const { data: previousMessages } = await supabase
        .from("conversation_messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      const history = (previousMessages || []).map((msg) =>
        msg.role === "user"
          ? new HumanMessage(msg.content)
          : new AIMessage(msg.content)
      );

      const embeddings = new CohereEmbeddings({
        apiKey: process.env.COHERE_API_KEY!,
        model: "embed-english-v3.0",
      });

      // Create vector store without filter first
      const vectorStore = new SupabaseVectorStore(embeddings, {
        client: supabase,
        tableName: "embedded_documents",
        queryName: "match_documents",
      });

      const cohereLLM = new Cohere({
        apiKey: process.env.COHERE_API_KEY!,
        model: "command-r-plus",
        temperature: 0.3,
      });

      const contextualizeQPrompt = ChatPromptTemplate.fromMessages([
        ["system", "Given a chat history and the latest user question, which might reference context in the chat history, formulate a standalone question."],
        new MessagesPlaceholder("chat_history"),
        ["human", "{input}"],
      ]);

      // Create a retriever with filter
      const retriever = vectorStore.asRetriever({
        filter: {
          document_ids: docIds,
        },
        k: 5,
      });

      const historyAwareRetriever = await createHistoryAwareRetriever({
        llm: cohereLLM,
        retriever: retriever,
        rephrasePrompt: contextualizeQPrompt,
      });

      const qaPrompt = ChatPromptTemplate.fromMessages([
        ["system", "You are an assistant for question answering tasks.Instead of giving just the answer ,you should act as teacher to the user . Use the following pieces of context to answer the question. keep your answer short and concise and to the point(max 100 words).\n\n{context}"],
        new MessagesPlaceholder("chat_history"),
        ["human", "{input}"],
      ]);

      const questionAnsweringChain = await createStuffDocumentsChain({
        llm: cohereLLM,
        prompt: qaPrompt,
      });

      const ragChain = await createRetrievalChain({
        retriever: historyAwareRetriever,
        combineDocsChain: questionAnsweringChain,
      });

      // 🧪 Debug: check what's retrieved with filter
      console.log("🔍 Testing retriever with filter...");
      const testDocs = await retriever.getRelevantDocuments(query);
      console.log("📚 Retrieved docs (with filter):", testDocs.length);
      console.log("📚 Retrieved docs metadata:", testDocs.map(d => d.metadata));
      console.log("📚 Retrieved docs content preview:", testDocs.map(d => d.pageContent.slice(0, 100)));

      // 🧪 Debug: test without filter for comparison
      console.log("🔍 Testing retriever without filter...");
      const testDocsNoFilter = await vectorStore.similaritySearch(query, 5);
      console.log("📚 Retrieved docs (no filter):", testDocsNoFilter.length);
      console.log("📚 Retrieved docs metadata (no filter):", testDocsNoFilter.map(d => d.metadata));

      const ragResponse = await ragChain.invoke({
        input: query,
        chat_history: history,
      });

      console.log("🤖 RAG Answer:", ragResponse.answer);

      await supabase.from("conversation_messages").insert({
        conversation_id: conversationId,
        role: "assistant",
        content: ragResponse.answer,
      });

      return res.json({
        status: "success",
        answer: ragResponse.answer,
        debug: {
          documentsWithFilter: testDocs.length,
          documentsWithoutFilter: testDocsNoFilter.length,
          filterApplied: { document_ids: docIds }
        }
      });

    } catch (error) {
      console.error("❌ Error in queryDocument:", error);
      return res.status(500).json({
        status: "error",
        message: "Failed to handle document query",
        error,
      });
    }
  }
}
