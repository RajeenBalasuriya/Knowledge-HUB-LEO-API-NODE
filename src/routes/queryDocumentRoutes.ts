import { Router } from "express";
import { QueryDocumentService } from "../services/quereyDocumentService";

const queryDocumentRoutes = Router();
const queryDocumentService = new QueryDocumentService();

queryDocumentRoutes.post("/", async (req, res) => {
    try {

    
        const result = await queryDocumentService.queryDocument(req, res);
        console.log("Query result:", result);

        //res.status(200).json({ message: "Document stored successfully" });

    }
    catch (error) {
        console.error("Error storing document:", error);
        //res.status(500).json({ error: "Failed to store document" });
    }
});


export default queryDocumentRoutes;