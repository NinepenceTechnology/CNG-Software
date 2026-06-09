import { collection, addDoc, serverTimestamp, onSnapshot, query, orderBy, Timestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface ChurchEvent {
  id?: string;
  title: string;
  date: any;
  time: string;
  location: string;
  category: string;
  description: string;
  branchId: string;
  createdAt: any;
}

export async function addEvent(branchId: string, eventData: Omit<ChurchEvent, 'id' | 'createdAt' | 'branchId'>) {
  const path = `branches/${branchId}/events`;
  try {
    const eventsRef = collection(db, 'branches', branchId, 'events');
    return await addDoc(eventsRef, {
      ...eventData,
      branchId,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToEvents(branchId: string, callback: (events: ChurchEvent[]) => void) {
  const path = `branches/${branchId}/events`;
  const eventsRef = collection(db, 'branches', branchId, 'events');
  const q = query(eventsRef, orderBy('date', 'asc'));

  return onSnapshot(q, (snapshot) => {
    const events: ChurchEvent[] = [];
    snapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as ChurchEvent);
    });
    callback(events);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}
