import { Request } from "express";
import { createSupabaseClient } from "../helpers/superbaseClientHelpers";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { CohereEmbeddings } from "@langchain/cohere"; // ✅ use Cohere
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export class StoreDocumentService {
  async storeDocument(req: Request) {
    try {
      const { url, documentId } = req.body;
      console.log("Received URL:", url);
      console.log("Received documentId:", documentId);

      // Init Supabase client
      const supabase = createSupabaseClient();

      // ✅ Initialize Cohere embeddings
      const embeddings = new CohereEmbeddings({
        apiKey: process.env.COHERE_API_KEY,
        model: "embed-english-v3.0", // Or embed-multilingual-v3.0
      });

      // Init Supabase vector store with explicit configuration
      const vectorStore = new SupabaseVectorStore(embeddings, {
        client: supabase,
        tableName: "embedded_documents",
        queryName: "match_documents",
        filter: {},
      });

      // Load YouTube transcript
      console.log("🎥 Loading YouTube transcript...");
      const loader = YoutubeLoader.createFromUrl(url, {
        addVideoInfo: true,
      });

      const docs = await loader.load();
      console.log("📄 Loaded documents:", docs.length);

      // Add metadata (title and content)
      docs[0].pageContent = `video title: ${docs[0].metadata.title} | Video context: ${docs[0].pageContent}`;

      // Split the document into chunks
      console.log("✂️ Splitting documents into chunks...");
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      const texts = await textSplitter.splitDocuments(docs);
      console.log("📝 Split into", texts.length, "chunks");

      // Add custom metadata to each chunk with proper structure
      const docsWithMetadata = texts.map((text) => ({
        ...text,
        
        metadata: {
          ...text.metadata,
          document_ids: [documentId], // Ensure this is an array
          url: url,
          // Add additional metadata for debugging
          stored_at: new Date().toISOString(),
          chunk_index: texts.indexOf(text),
        },
      }));

      console.log("📝 Documents with metadata:", docsWithMetadata.map(d => ({
        contentLength: d.pageContent.length,
        metadata: d.metadata,
        hasDocumentIds: !!d.metadata.document_ids,
        documentIdsValue: d.metadata.document_ids,
        documentIdsType: typeof d.metadata.document_ids,
        isArray: Array.isArray(d.metadata.document_ids)
      })));

      // Add to vector DB
      console.log("💾 Adding documents to vector store...");
      try {
        await vectorStore.addDocuments(docsWithMetadata);
        console.log("✅ Documents added successfully!");
        
        // Verify documents were stored with more detailed checking
        console.log("🔍 Verifying documents in database...");
        
        // First, check if documents exist at all
        const { data: allDocs, error: allDocsError } = await supabase
          .from("embedded_documents")
          .select("id, content, metadata")
          .limit(5);
        
        if (allDocsError) {
          console.error("❌ Error fetching all documents:", allDocsError);
        } else {
          console.log("📊 Total documents in table:", allDocs?.length || 0);
          console.log("📊 Sample document metadata:", allDocs?.[0]?.metadata);
        }
        
        // Then check for our specific document_id
        const { data: storedDocs, error: verifyError } = await supabase
          .from("embedded_documents")
          .select("id, content, metadata")
          .contains("metadata", { document_ids: [documentId] });
        
        if (verifyError) {
          console.error("❌ Error verifying documents:", verifyError);
          
          // Try alternative query method
          console.log("🔄 Trying alternative query method...");
          const { data: altDocs, error: altError } = await supabase
            .from("embedded_documents")
            .select("id, content, metadata")
            .textSearch("metadata", documentId);
          
          if (altError) {
            console.error("❌ Alternative query also failed:", altError);
          } else {
            console.log("✅ Alternative query found", altDocs?.length || 0, "documents");
          }
        } else {
          console.log("✅ Found", storedDocs?.length || 0, "documents with documentId:", documentId);
          if (storedDocs && storedDocs.length > 0) {
            console.log("📄 Sample stored document metadata:", storedDocs[0].metadata);
          }
        }
        
        // Additional verification: check raw SQL query
        console.log("🔍 Running raw SQL verification...");
        const { data: rawDocs, error: rawError } = await supabase.rpc('match_documents', {
          query_embedding: new Array(1024).fill(0), // dummy embedding
          match_count: 10,
          filter: { document_ids: [documentId] }
        });
        
        if (rawError) {
          console.error("❌ Raw SQL query failed:", rawError);
        } else {
          console.log("✅ Raw SQL found", rawDocs?.length || 0, "documents");
        }
        
      } catch (addError) {
        console.error("❌ Error adding documents to vector store:", addError);
        throw addError;
      }
    } catch (error) {
      console.error("Error storing document:", error);
      throw new Error("Failed to store document");
    }
  }
}
