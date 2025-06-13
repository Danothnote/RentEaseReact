// src/auth/context/AuthContext.tsx
import { createContext, useEffect, useState, type ReactNode } from "react";
import type { AuthContextType, AuthUser } from "../types/authTypes";
import {
  browserLocalPersistence,
  createUserWithEmailAndPassword,
  deleteUser,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  type User as FirebaseUser,
} from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { deleteDoc, doc, getDoc, onSnapshot, setDoc } from "firebase/firestore";
import { Box, CircularProgress, Typography } from "@mui/material";
import type { NavigateFunction } from "react-router";
import { colors } from "../../strings/colors";
import type { Moment } from "moment";
import moment from "moment";
import { deleteFileFromFirebaseStorage } from "../../flatView/services/storageService";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  login: async () => {},
  logout: async () => {},
  passwordReset: async () => {},
  register: async () => {},
  deleteAccount: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (firebaseUser: FirebaseUser | null) => {
        if (firebaseUser) {
          if (firebaseUser.emailVerified) {
            try {
              const userDocRef = doc(db, "users", firebaseUser.uid);

              const unsubscribeFirestore = onSnapshot(
                userDocRef,
                (docSnap) => {
                  if (docSnap.exists()) {
                    const data = docSnap.data();
                    const customUser: AuthUser = {
                      uid: firebaseUser.uid,
                      email: firebaseUser.email,
                      username: data.username,
                      firstName: data.firstName,
                      lastName: data.lastName,
                      birthday: data.birthday ? moment(data.birthday) : null,
                      profilePicture: data.profilePicture,
                      flats: data.flats,
                      createdAt: data.createdAt,
                      role: data.role,
                    };
                    setUser(customUser);
                  } else {
                    setUser(null);
                  }
                  setLoading(false);
                },
                (error) => {
                  console.error(
                    "Error al obtener el documento de usuario en tiempo real:",
                    error
                  );
                  setUser(null);
                  setLoading(false);
                }
              );

              return () => unsubscribeFirestore();
            } catch (error) {
              console.error(
                "Error al obtener datos de usuario de Firestore:",
                error
              );
              setUser(null);
            }
          } else {
            await auth.signOut();
            setUser(null);
          }
        } else {
          setUser(null);
          setLoading(false);
        }
      }
    );

    return () => unsubscribe();
  }, []);

  const value: AuthContextType = {
    user,
    loading,
    login: async (
      email: string,
      password: string,
      navigate: NavigateFunction
    ) => {
      try {
        setPersistence(auth, browserLocalPersistence);
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user: FirebaseUser = userCredential.user;

        if (!user.emailVerified) {
          await auth.signOut();
          throw new Error(
            "Por favor, verifica tu email antes de iniciar sesión."
          );
        }

        navigate("/");
      } catch (error) {
        console.log(error);
      }
    },
    logout: async () => {
      try {
        await auth.signOut();
      } catch (error) {
        console.log(error);
      }
    },
    passwordReset: async () => {
      try {
        await sendPasswordResetEmail(auth, auth.currentUser!!.email!!);
        alert(
          "Se ha enviado un correo electrónico para restablecer tu contraseña."
        );
      } catch (error: any) {
        console.log(error);
        alert(
          `Error al enviar el correo de restablecimiento: ${error.message}`
        );
      }
    },
    register: async (
      username: string,
      firstName: string,
      lastName: string,
      birthday: Moment,
      email: string,
      password: string,
      navigate: NavigateFunction
    ) => {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const { uid } = userCredential.user;

        const userDocRef = doc(db, "users", uid);

        await setDoc(userDocRef, {
          username: username,
          firstName: firstName,
          lastName: lastName,
          birthday: birthday.toISOString(),
          email: email,
          role: "user",
          createdAt: new Date().toISOString(),
        });

        sendEmailVerification(auth.currentUser!!);
        await auth.signOut();
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    },
    deleteAccount: async () => {
      try {
        if (user) {
          const currentUser = auth.currentUser;

          //Borra la imagen del usuario
          await deleteFileFromFirebaseStorage(user.profilePicture);

          user.flats.forEach(async (flat) => {
            const flatDocRef = doc(db, "flats", flat);
            try {
              const flatDoc = await getDoc(flatDocRef);
              if (flatDoc.exists()) {
                // Borra todas las imágenes del departamento almacenadas en storage
                flatDoc.data().imgUpload.forEach(async (url: string) => {
                  await deleteFileFromFirebaseStorage(url);
                });
                // Borra el departamento
                await deleteDoc(doc(db, "flats", flatDoc.id));
              } else {
                console.log("No existe el documento");
                return null;
              }
            } catch (error) {
              console.error("Error al buscar el departamento por ID:", error);
              return null;
            }
          });
          await deleteDoc(doc(db, "users", user.uid));
          await deleteUser(currentUser!!);
        }
      } catch (error) {
        console.log(error);
      }
    },
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          bgcolor: colors.navbarBackground,
        }}
      >
        <CircularProgress />
        <Typography color={colors.yellowText} my={4} fontSize={25}>
          Cargando datos del usuario...
        </Typography>
      </Box>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
