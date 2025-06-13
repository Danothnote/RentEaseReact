import {
  doc,
  updateDoc,
  type DocumentData,
  type WithFieldValue,
} from "firebase/firestore";
import { useCallback, useState } from "react";
import { db } from "../firebase/firebase";

interface UseUpdateDocumentResult {
  updateDocument: (
    collectionName: string,
    documentId: string,
    data: WithFieldValue<DocumentData>
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useUpdateDocument = (): UseUpdateDocumentResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const updateDocument = useCallback(
    async (
      collectionName: string,
      documentId: string,
      data: WithFieldValue<DocumentData>
    ) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!collectionName || !documentId || !data) {
        setError("Faltan parámetros: collectionName, documentId o data.");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, collectionName, documentId);
        await updateDoc(docRef, data);
        setSuccess(true);
      } catch (err) {
        console.error(
          `Error al actualizar el documento en ${collectionName}/${documentId}:`,
          err
        );
        setError(
          `No se pudo actualizar el documento. Inténtalo de nuevo. Error: ${err}`
        );
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { updateDocument, loading, error, success };
};
