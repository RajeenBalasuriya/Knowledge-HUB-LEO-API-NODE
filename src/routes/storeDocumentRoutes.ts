import { Router } from "express";
import { StoreDocumentService } from "../services/sotreDocumentService.js";

const storeDocumentRoutes = Router();
const storeDocumentService = new StoreDocumentService();

storeDocumentRoutes.post("/", async (req, res) => {
    try {

    
        // Call the storeDocument method with the request
        await storeDocumentService.storeDocument(req);

        res.status(200).json({ message: "Document stored successfully" });

    }
    catch (error) {
        console.error("Error storing document:", error);
        res.status(500).json({ error: "Failed to store document" });
    }
});


export default storeDocumentRoutes;