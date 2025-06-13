import { doc, onSnapshot } from "firebase/firestore";
import moment from "moment";
import { db } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import type { FlatData } from "../../allFlats/types/allFlatsTypes";

interface UseFlatResult {
  flat: FlatData | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useFlat = (flatId: string | undefined): UseFlatResult => {
  const [flat, setFlat] = useState<FlatData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  if (flatId) {
    useEffect(() => {
      setLoading(true);
      setError(null);

      const flatDocRef = doc(db, "flats", flatId);

      const unsubscribe = onSnapshot(flatDocRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const flat: FlatData = {
            id: docSnapshot.id,
            flatName: data.flatName,
            city: data.city,
            street: data.street,
            streetNumber: data.streetNumber,
            area: data.area,
            airConditioning: data.airConditioning,
            yearBuilt: data.yearBuilt,
            dateAvailable: moment(data.dateAvailable),
            rentPrice: data.rentPrice,
            imgUpload: data.imgUpload,
            isFavorite: data.isFavorite || false,
            createdAt: moment(data.createdAt),
            uid: data.uid,
          };
          setLoading(false)
          setSuccess(true);
          setFlat(flat);
        } else {
          console.log("No existe el documento");
          return null;
        }
      });

      return unsubscribe;
    }, []);
  } else {
    console.log("No se obtuvo ningún ID de departamento");
  }
  return { flat, loading, error, success };
};
