import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "./config";

export type UserRole = "school_admin" | "teacher" | "student" | "parent";

export interface Permission {
  module: string; // e.g., "students", "teachers", "classes", "assignments"
  actions: string[]; // e.g., ["create", "read", "update", "delete"]
}

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  schoolId: string; // Added schoolId for multi-tenant support
  name: string;
  phoneNumber?: string;
  profilePicture?: string;
  permissions?: Permission[]; // Added custom permissions for RBAC
  createdAt: Date;
  updatedAt: Date;
}

export async function signUp(
  email: string,
  password: string,
  name: string,
  role: UserRole,
  schoolId: string
): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, { displayName: name });

    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      role,
      schoolId,
      name,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(doc(db, "users", user.uid), userData);

    return userCredential;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function signIn(
  email: string,
  password: string
): Promise<UserData> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    const userDoc = await getDoc(doc(db, "users", user.uid));
    const userData = userDoc.data() as UserData;

    if (!userData) {
      throw new Error("User data not found");
    }

    return userData;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function logOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export async function getUserData(uid: string): Promise<UserData | null> {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data() as UserData;
    }
    return null;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

export function hasPermission(
  userData: UserData | null,
  module: string,
  action: string
): boolean {
  if (!userData) return false;
  
  // School admins have all permissions by default
  if (userData.role === "school_admin") return true;
  
  if (!userData.permissions) return false;
  
  const modulePermission = userData.permissions.find(p => p.module === module);
  return modulePermission ? modulePermission.actions.includes(action) : false;
}

export { logOut as signOut };
