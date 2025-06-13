import { useState, useEffect, useMemo } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import moment, { type Moment } from "moment";

interface FlatData {
  id: string;
  flatName: string;
  city: string;
  street: string;
  streetNumber: string;
  area: number;
  airConditioning: string;
  yearBuilt: number;
  dateAvailable: Moment;
  rentPrice: number;
  imgUpload: string[];
  isFavorite: boolean;
  createdAt: Moment;
  uid: string;
}

interface UseFlatsResult {
  allFlats: FlatData[];
  uniqueCities: string[];
  loading: boolean;
  error: string | null;
}

export const useFlats = (): UseFlatsResult => {
  const [allFlats, setAllFlats] = useState<FlatData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const flatsCollectionRef = collection(db, "flats");
    const q = query(flatsCollectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedFlats: FlatData[] = [];
        snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();

          const flat: FlatData = {
            id: doc.id,
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
          fetchedFlats.push(flat);
        });
        setAllFlats(fetchedFlats);
        setLoading(false);
      },
      (err) => {
        console.error("Error al obtener departamentos:", err);
        setError("No se pudieron cargar los departamentos.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  const uniqueCities = useMemo(() => {
    const cities = new Set<string>();
    allFlats.forEach((flat) => cities.add(flat.city));
    return ["Todos", ...Array.from(cities).sort()];
  }, [allFlats]);

  return { allFlats, uniqueCities, loading, error };
};
