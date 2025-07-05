CREATE OR REPLACE FUNCTION match_documents(
    query_embedding vector(1024),
    match_count INT DEFAULT 5,
    filter JSONB DEFAULT '{}'
)
RETURNS TABLE (
    id UUID,
    content TEXT,
    metadata JSONB,
    similarity FLOAT
)
LANGUAGE plpgsql
AS $$
DECLARE
    doc_uuid_array UUID[];
BEGIN
    IF query_embedding IS NULL THEN
        RAISE EXCEPTION 'query_embedding cannot be null';
    END IF;

    -- Only check for document_ids if filter is provided and not empty
    IF filter IS NOT NULL AND filter != '{}' AND NOT (filter ? 'document_ids') THEN
        RAISE EXCEPTION 'Missing document_ids in filter JSON';
    END IF;

    -- If filter is provided and contains document_ids, extract them
    IF filter IS NOT NULL AND filter != '{}' AND (filter ? 'document_ids') THEN
        doc_uuid_array := (
            SELECT array_agg(elem::UUID)
            FROM jsonb_array_elements_text(filter->'document_ids') AS elem
        );

        IF doc_uuid_array IS NULL OR array_length(doc_uuid_array, 1) = 0 THEN
            RAISE EXCEPTION 'document_ids cannot be empty';
        END IF;
    END IF;

    RETURN QUERY
    SELECT 
        ed.id,
        ed.content,
        ed.metadata,
        (1 - (ed.embedding <=> query_embedding)) AS similarity
    FROM embedded_documents ed
    WHERE 
        -- If no filter is provided, return all documents
        (doc_uuid_array IS NULL OR array_length(doc_uuid_array, 1) = 0)
        OR
        -- If filter is provided, check document_ids
        EXISTS (
            SELECT 1 
            FROM jsonb_array_elements_text(ed.metadata->'document_ids') AS doc_id
            WHERE doc_id::UUID = ANY(doc_uuid_array)
        )
    ORDER BY ed.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;
