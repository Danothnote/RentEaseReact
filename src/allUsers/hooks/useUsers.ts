import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import type { AuthUser } from "../../auth/types/authTypes";
import moment from "moment";

interface UseUsersResult {
  allUsers: AuthUser[];
  loading: boolean;
  error: string | null;
}

export const useUsers = (): UseUsersResult => {
  const [allUsers, setAllUsers] = useState<AuthUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const flatsCollectionRef = collection(db, "users");
    const q = query(flatsCollectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedUsers: AuthUser[] = [];
        snapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();

          const user: AuthUser = {
            uid: doc.id,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            birthday: moment(data.birthday),
            email: data.email,
            profilePicture: data.profilePicture,
            role: data.role,
            flats: data.flats,
            createdAt: data.createdAt
          };
          fetchedUsers.push(user);
        });
        setAllUsers(fetchedUsers);
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

  return { allUsers, loading, error };
};