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


export async function createDocument(
  collectionName: string,
  data: any,
  schoolId: string, // Added required schoolId parameter
  customId?: string
): Promise<string> {
  try {
    const docData = {
      ...data,
      schoolId, // Always include schoolId in documents
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    if (customId) {
      await setDoc(doc(db, collectionName, customId), docData);
      return customId;
    } else {
      const docRef = await addDoc(collection(db, collectionName), docData);
      return docRef.id;
    }
  } catch (error: any) {
    throw new Error(`Create document failed: ${error.message}`);
  }
}

export async function getDocument(
  collectionName: string,
  docId: string,
  schoolId: string // Added required schoolId parameter
): Promise<DocumentData | null> {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = { id: docSnap.id, ...docSnap.data() };
      if (data.schoolId !== schoolId) {
        throw new Error("Access denied: Document belongs to different school");
      }
      return data;
    }
    return null;
  } catch (error: any) {
    throw new Error(`Get document failed: ${error.message}`);
  }
}

export async function getDocuments(
  collectionName: string,
  schoolId: string, // Added required schoolId parameter
  constraints?: QueryConstraint[]
): Promise<DocumentData[]> {
  try {
    const collectionRef = collection(db, collectionName);
    const baseConstraints = [where("schoolId", "==", schoolId)];
    const allConstraints = constraints 
      ? [...baseConstraints, ...constraints] 
      : baseConstraints;
    
    const q = query(collectionRef, ...allConstraints);
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error: any) {
    throw new Error(`Get documents failed: ${error.message}`);
  }
}

export async function updateDocument(
  collectionName: string,
  docId: string,
  data: Partial<any>,
  schoolId: string // Added required schoolId parameter
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error("Document not found");
    }
    
    if (docSnap.data()?.schoolId !== schoolId) {
      throw new Error("Access denied: Document belongs to different school");
    }
    
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(`Update document failed: ${error.message}`);
  }
}

export async function deleteDocument(
  collectionName: string,
  docId: string,
  schoolId: string // Added required schoolId parameter
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);
    
    if (!docSnap.exists()) {
      throw new Error("Document not found");
    }
    
    if (docSnap.data()?.schoolId !== schoolId) {
      throw new Error("Access denied: Document belongs to different school");
    }
    
    await deleteDoc(docRef);
  } catch (error: any) {
    throw new Error(`Delete document failed: ${error.message}`);
  }
}

export async function getStudentsByClass(classId: string, schoolId: string): Promise<DocumentData[]> {
  return getDocuments("students", schoolId, [where("classId", "==", classId), orderBy("name")]);
}

export async function getAssignmentsByStudent(studentId: string, schoolId: string): Promise<DocumentData[]> {
  return getDocuments("assignments", schoolId, [
    where("studentId", "==", studentId),
    orderBy("dueDate", "desc"),
  ]);
}

export async function getLatestAnnouncements(schoolId: string): Promise<DocumentData[]> {
  return getDocuments("announcements", schoolId, [orderBy("createdAt", "desc"), limit(10)]);
}
