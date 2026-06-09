import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface Member {
  id?: string;
  name: string;
  email: string;
  phone: string;
  birthday: string;
  ministry: string;
  cell: string;
  group: 'fiel' | 'visitante' | 'pastor';
  status: 'ativo' | 'inativo';
  address: string;
  createdAt: any;
  branchId: string;
  hasPendingWrites?: boolean;
}

export async function addMember(branchId: string, memberData: Omit<Member, 'id' | 'createdAt' | 'branchId' | 'hasPendingWrites'>) {
  const path = `branches/${branchId}/members`;
  try {
    const membersRef = collection(db, 'branches', branchId, 'members');
    return await addDoc(membersRef, {
      ...memberData,
      branchId,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToMembers(branchId: string, callback: (members: Member[]) => void) {
  const path = `branches/${branchId}/members`;
  const membersRef = collection(db, 'branches', branchId, 'members');
  // Order by createdAt, but we'll also sort robustly on the client side
  const q = query(membersRef, orderBy('createdAt', 'desc'));

  // Use includeMetadataChanges so we get notified of offline vs online synced status immediately
  return onSnapshot(q, { includeMetadataChanges: true }, (snapshot) => {
    const members: Member[] = [];
    snapshot.forEach((docSnap) => {
      members.push({ 
        id: docSnap.id, 
        ...docSnap.data(),
        hasPendingWrites: docSnap.metadata.hasPendingWrites
      } as Member);
    });

    // Highly resilient local sorting fallback. Handles cases where createdAt is null (locally created offline docs)
    // so that offline-only records don't get lost or sorting is broken
    members.sort((a, b) => {
      const getMillis = (item: Member) => {
        if (!item.createdAt) return Date.now() + 10000; // Put pending writes at the very top!
        if (typeof item.createdAt.toMillis === 'function') return item.createdAt.toMillis();
        if (typeof item.createdAt.seconds === 'number') return item.createdAt.seconds * 1000;
        if (item.createdAt instanceof Date) return item.createdAt.getTime();
        return 0;
      };
      return getMillis(b) - getMillis(a);
    });

    callback(members);
  }, (error) => {
    console.warn("Recoverable firestore subscription error: ", error.message);
    // Instead of throwing an exception that crashes React, let the app degrade gracefully
  });
}
