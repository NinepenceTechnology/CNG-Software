import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, setDoc, doc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';

export interface Notification {
  id?: string;
  title: string;
  message: string;
  type: 'finance' | 'member' | 'event' | 'system';
  read: boolean;
  createdAt: any;
  userId?: string;
}

export async function sendNotification(notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) {
  const path = 'notifications';
  try {
    const notificationsRef = collection(db, 'notifications');
    return await addDoc(notificationsRef, {
      ...notification,
      read: false,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export function subscribeToNotifications(callback: (notifications: Notification[]) => void) {
  const path = 'notifications';
  const notificationsRef = collection(db, 'notifications');
  const q = query(notificationsRef, orderBy('createdAt', 'desc'), where('createdAt', '!=', null));
  
  return onSnapshot(q, (snapshot) => {
    const notifications = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Notification));
    callback(notifications);
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}

export async function markAsRead(notificationId: string) {
  const path = `notifications/${notificationId}`;
  try {
    const docRef = doc(db, 'notifications', notificationId);
    return await setDoc(docRef, { read: true }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}
