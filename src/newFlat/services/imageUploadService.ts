import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../../firebase/firebase";
import moment from "moment";

export const uploadImageAndGetUrl = async (
  file: File,
  folder: string,
  uid: string
): Promise<string> => {
  if (!file) {
    throw new Error("No se proporcionó ningún archivo para subir.");
  }

  const fileExtension = file.name.split(".").pop();

  const fileName = `${uid}-${moment().valueOf()}-${Math.random()
    .toString(36)
    .substring(2, 8)}.${fileExtension}`;

  const imageRef = ref(storage, `${folder}/${fileName}`);

  try {
    const snapshot = await uploadBytes(imageRef, file);
    console.log("Imagen subida exitosamente:", snapshot);

    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("URL de descarga:", downloadURL);

    return downloadURL;
  } catch (error) {
    console.error("Error al subir la imagen:", error);
    throw new Error("Error al subir la imagen a Firebase Storage.");
  }
};
