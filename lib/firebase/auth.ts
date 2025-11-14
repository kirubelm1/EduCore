import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
  UserCredential,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";

export type UserRole = "admin" | "teacher" | "student" | "parent";

export interface UserData {
  uid: string;
  email: string;
  role: UserRole;
  name: string;
  phoneNumber?: string;
  profilePicture?: string;
  createdAt: Date;
}

// Sign up with email and password
export async function signUp(
  email: string,
  password: string,
  name: string,
  role: UserRole
): Promise<UserCredential> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Update display name
    await updateProfile(user, { displayName: name });

    // Store additional user data in Firestore
    const userData: UserData = {
      uid: user.uid,
      email: user.email!,
      role,
      name,
      createdAt: new Date(),
    };

    await setDoc(doc(db, "users", user.uid), userData);

    return userCredential;
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Sign in with email and password
export async function signIn(
  email: string,
  password: string
): Promise<UserData> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Get user data from Firestore
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

// Sign out
export async function logOut(): Promise<void> {
  try {
    await firebaseSignOut(auth);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Reset password
export async function resetPassword(email: string): Promise<void> {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(error.message);
  }
}

// Get user data from Firestore
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

export { logOut as signOut };
