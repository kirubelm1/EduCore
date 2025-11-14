import { doc, setDoc, getDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "./config";

export interface School {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo?: string;
  principalName: string;
  adminUserId: string; // The user who created/owns this school
  settings: {
    academicYearStart: string;
    academicYearEnd: string;
    timezone: string;
  };
  status: "active" | "inactive" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

export async function createSchool(
  schoolData: Omit<School, "id" | "createdAt" | "updatedAt">,
  schoolId: string
): Promise<string> {
  try {
    const schoolDoc = {
      ...schoolData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(doc(db, "schools", schoolId), schoolDoc);
    return schoolId;
  } catch (error: any) {
    throw new Error(`Create school failed: ${error.message}`);
  }
}

export async function getSchool(schoolId: string): Promise<School | null> {
  try {
    const schoolDoc = await getDoc(doc(db, "schools", schoolId));
    
    if (schoolDoc.exists()) {
      return { id: schoolDoc.id, ...schoolDoc.data() } as School;
    }
    return null;
  } catch (error: any) {
    throw new Error(`Get school failed: ${error.message}`);
  }
}

export async function updateSchool(
  schoolId: string,
  data: Partial<School>
): Promise<void> {
  try {
    await updateDoc(doc(db, "schools", schoolId), {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } catch (error: any) {
    throw new Error(`Update school failed: ${error.message}`);
  }
}
