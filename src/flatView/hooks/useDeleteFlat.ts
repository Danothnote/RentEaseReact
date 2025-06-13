import { useCallback, useState } from "react";
import { db } from "../../firebase/firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteFileFromFirebaseStorage } from "../services/storageService";

interface UseDeleteFlatResult {
  deleteFlat: (flatId: string, imgUpload: string[]) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useDeleteFlat = (): UseDeleteFlatResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const deleteFlat = useCallback(
    async (flatId: string, imgUpload: string[]) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      if (!flatId) {
        setError("El ID del departamento es nulo o indefinido.");
        setLoading(false);
        return;
      }

      try {
        imgUpload.forEach(async (url) => {
          await deleteFileFromFirebaseStorage(url);
        });

        const flatRef = doc(db, "flats", flatId);
        await deleteDoc(flatRef);
        setSuccess(true);
      } catch (err) {
        console.error("Error al eliminar el documento del departamento:", err);
        setError("No se pudo eliminar el departamento. Inténtalo de nuevo.");
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { deleteFlat, loading, error, success };
};
