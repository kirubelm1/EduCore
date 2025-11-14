import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  QueryConstraint,
  DocumentData,
  addDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "./config";

// Generic CRUD operations for Firestore

// Create a new document
export async function createDocument(
  collectionName: string,
  data: any,
  customId?: string
): Promise<string> {
  try {
    if (customId) {
      await setDoc(doc(db, collectionName, customId), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return customId;
    } else {
      const docRef = await addDoc(collection(db, collectionName), {
        ...data,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    }
  } catch (error: any) {
    throw new Error(`Create document failed: ${error.message}`);
  }
}

// Read a single document
export async function getDocument(
  collectionName: string,
  docId: string
): Promise<DocumentData | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
  } catch (error: any) {
    throw new Error(`Get document failed: ${error.message}`);
  }
}

// Read multiple documents with query
export async function getDocuments(
  collectionName: string,
  constraints?: QueryConstraint[]
): Promise<DocumentData[]> {
  try {
    const collectionRef = collection(db, collectionName);
    const q = constraints ? query(collectionRef, ...constraints) : collectionRef;
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error: any) {
    throw new Error(`Get documents failed: ${error.message}`);
  }
}

// Update a document
export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<any>
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(`Update document failed: ${error.message}`);
  }
}

// Delete a document
export async function deleteDocument(
  collectionName: string,
  docId: string
): Promise<void> {
  try {
    await deleteDoc(doc(db, collectionName, docId));
  } catch (error: any) {
    throw new Error(`Delete document failed: ${error.message}`);
  }
}

// Example: Get students by class
export async function getStudentsByClass(classId: string): Promise<DocumentData[]> {
  return getDocuments("students", [where("classId", "==", classId), orderBy("name")]);
}

// Example: Get assignments for a student
export async function getAssignmentsByStudent(studentId: string): Promise<DocumentData[]> {
  return getDocuments("assignments", [
    where("studentId", "==", studentId),
    orderBy("dueDate", "desc"),
  ]);
}

// Example: Get announcements (latest 10)
export async function getLatestAnnouncements(): Promise<DocumentData[]> {
  return getDocuments("announcements", [orderBy("createdAt", "desc"), limit(10)]);
}
