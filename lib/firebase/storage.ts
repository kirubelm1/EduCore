import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  uploadBytesResumable,
  UploadTaskSnapshot,
} from "firebase/storage";
import { storage } from "./config";

export interface UploadProgress {
  progress: number;
  snapshot: UploadTaskSnapshot;
}

// Upload file to Firebase Storage
export async function uploadFile(
  file: File,
  path: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  try {
    const storageRef = ref(storage, path);

    if (onProgress) {
      // Upload with progress tracking
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress({ progress, snapshot });
          },
          (error) => reject(error),
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadURL);
          }
        );
      });
    } else {
      // Simple upload without progress
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    }
  } catch (error: any) {
    throw new Error(`Upload failed: ${error.message}`);
  }
}

// Delete file from Firebase Storage
export async function deleteFile(path: string): Promise<void> {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);
  } catch (error: any) {
    throw new Error(`Delete failed: ${error.message}`);
  }
}

// Upload assignment file
export async function uploadAssignment(
  file: File,
  studentId: string,
  assignmentId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  const path = `assignments/${studentId}/${assignmentId}/${file.name}`;
  return uploadFile(file, path, onProgress);
}

// Upload profile picture
export async function uploadProfilePicture(
  file: File,
  userId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  const path = `profile-pictures/${userId}/${file.name}`;
  return uploadFile(file, path, onProgress);
}

// Upload study material
export async function uploadStudyMaterial(
  file: File,
  teacherId: string,
  classId: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<string> {
  const path = `study-materials/${classId}/${teacherId}/${file.name}`;
  return uploadFile(file, path, onProgress);
}

// Get file extension
export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
}

// Validate file size (in MB)
export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const fileSizeMB = file.size / (1024 * 1024);
  return fileSizeMB <= maxSizeMB;
}

// Validate file type
export function validateFileType(file: File, allowedTypes: string[]): boolean {
  const extension = getFileExtension(file.name).toLowerCase();
  return allowedTypes.includes(extension);
}
