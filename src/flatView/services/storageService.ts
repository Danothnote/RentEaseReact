import { ref, deleteObject } from "firebase/storage";
import { storage } from "../../firebase/firebase";

export const deleteFileFromFirebaseStorage = async (filePath: string): Promise<void> => {
  if (!filePath) {
    throw new Error("La ruta del archivo es requerida para borrar.");
  }

  const fileRef = ref(storage, filePath);

  try {
    await deleteObject(fileRef);
    console.log(`Archivo en ${filePath} borrado exitosamente.`);
  } catch (error: any) {
    console.error(`Error al borrar el archivo en ${filePath}:`, error);
    switch (error.code) {
      case 'storage/object-not-found':
        throw new Error('El archivo no existe en la ubicación especificada.');
      case 'storage/unauthorized':
        throw new Error('No tienes permiso para borrar este archivo. Revisa tus reglas de seguridad de Firebase Storage.');
      case 'storage/canceled':
        throw new Error('La operación de borrado fue cancelada.');
      default:
        throw new Error(`Error desconocido al borrar el archivo: ${error.message}`);
    }
  }
};