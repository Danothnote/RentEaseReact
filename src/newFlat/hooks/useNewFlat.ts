import { useCallback, useState } from "react";
import { db } from "../../firebase/firebase";
import type { Moment } from "moment";
import type { AirConditioningType } from "../types/newFlatTypes";
import type { NavigateFunction } from "react-router";
import { uploadImageAndGetUrl } from "../services/imageUploadService";
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";

interface UseNewFlatResult {
  newFlat: (
    uid: string,
    imgUpload: File[],
    area: number,
    yearBuilt: string,
    dateAvailable: Moment,
    flatName: string,
    city: string,
    street: string,
    streetNumber: string,
    airConditioning: AirConditioningType,
    rentPrice: number,
    navigate: NavigateFunction
  ) => Promise<void>;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export const useNewFlat = (): UseNewFlatResult => {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const newFlat = useCallback(
    async (
      uid: string,
      imgUpload: File[],
      area: number,
      yearBuilt: string,
      dateAvailable: Moment,
      flatName: string,
      city: string,
      street: string,
      streetNumber: string,
      airConditioning: AirConditioningType,
      rentPrice: number
    ) => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const uploadPromises = imgUpload.map(async (file) => {
          return await uploadImageAndGetUrl(file, "flatImages", uid);
        });

        const urls = await Promise.all(uploadPromises);

        const docRef = await addDoc(collection(db, "flats"), {
          uid: uid,
          area: area,
          imgUpload: urls,
          yearBuilt: yearBuilt,
          dateAvailable: dateAvailable.toISOString(),
          flatName: flatName,
          city: city,
          street: street,
          streetNumber: streetNumber,
          airConditioning: airConditioning,
          rentPrice: rentPrice,
          createdAt: new Date().toISOString(),
        });

        const newFlatId = docRef.id;

        const userDocRef = doc(db, "users", uid);

        await updateDoc(userDocRef, {
          flats: arrayUnion(newFlatId),
        });

        setSuccess(true);
      } catch (error: any) {
        console.error("Error en newFlat:", error);
        setError(error.message || "Ocurrió un error al crear el departamento.");
        setSuccess(false);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { newFlat, loading, error, success };
};
