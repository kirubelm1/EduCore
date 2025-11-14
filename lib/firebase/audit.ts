import { collection, addDoc, Timestamp, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "./config";

export interface AuditLog {
  id?: string;
  schoolId: string;
  userId: string;
  userName: string;
  action: string; // e.g., "create_student", "update_grade", "delete_class"
  module: string; // e.g., "students", "grades", "classes"
  targetId?: string; // ID of the affected resource
  targetType?: string; // Type of the affected resource
  changes?: any; // What changed (before/after)
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

export async function createAuditLog(
  auditData: Omit<AuditLog, "id" | "timestamp">
): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "audit_logs"), {
      ...auditData,
      timestamp: Timestamp.now(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Create audit log failed: ${error.message}`);
  }
}

export async function getAuditLogs(
  schoolId: string,
  filters?: {
    userId?: string;
    module?: string;
    startDate?: Date;
    endDate?: Date;
    limitCount?: number;
  }
): Promise<AuditLog[]> {
  try {
    const constraints: any[] = [where("schoolId", "==", schoolId)];
    
    if (filters?.userId) {
      constraints.push(where("userId", "==", filters.userId));
    }
    
    if (filters?.module) {
      constraints.push(where("module", "==", filters.module));
    }
    
    constraints.push(orderBy("timestamp", "desc"));
    
    if (filters?.limitCount) {
      constraints.push(limit(filters.limitCount));
    } else {
      constraints.push(limit(100)); // Default limit
    }
    
    const q = query(collection(db, "audit_logs"), ...constraints);
    const querySnapshot = await getDocs(q);
    
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as AuditLog[];
  } catch (error: any) {
    throw new Error(`Get audit logs failed: ${error.message}`);
  }
}
