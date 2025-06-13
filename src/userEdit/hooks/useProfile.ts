import { doc, onSnapshot } from "firebase/firestore";
import moment from "moment";
import { db } from "../../firebase/firebase";
import { useEffect, useState } from "react";
import type { AuthUser } from "../../auth/types/authTypes";

interface UseProfileResult {
  profile: AuthUser | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useProfile = (profileId: string | undefined): UseProfileResult => {
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!profileId) {
      setError("No se obtuvo ningún ID de perfil.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    const profileDocRef = doc(db, "users", profileId);

    const unsubscribe = onSnapshot(
      profileDocRef,
      (docSnapshot) => {
        console.log(profileId);
        console.log(docSnapshot.data());
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          const fetchedProfile: AuthUser = {
            uid: docSnapshot.id,
            username: data.username || "",
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            email: data.email || "",
            role: data.role || "user",
            birthday: data.birthday ? moment(data.birthday) : null,
            flats: data.flats,
            profilePicture: data.profilePicture || "",
            createdAt: data.createdAt ? moment(data.createdAt) : null,
          };
          setProfile(fetchedProfile);
          setLoading(false);
          setSuccess(true);
        } else {
          console.log(
            "No existe el documento del perfil para el ID:",
            profileId
          );
          setError("No se encontró el perfil de usuario.");
          setLoading(false);
          setProfile(null);
        }
      },
      (err) => {
        console.error("Error al obtener el perfil:", err);
        setError("Error al cargar el perfil de usuario.");
        setLoading(false);
        setProfile(null);
      }
    );

    return () => unsubscribe();
  }, [profileId]);

  return { profile, loading, error, success };
};
