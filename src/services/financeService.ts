import { collection, query, where, getDocs, orderBy, Timestamp, addDoc, serverTimestamp, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { sendNotification } from './notificationService';

export interface TransactionInput {
  type: 'dizimo' | 'oferta' | 'contribuicao' | 'despesa';
  amount: number;
  description: string;
  category?: string;
  memberId?: string;
  status: 'pago' | 'pendente';
  date?: Date;
}

export async function addTransaction(branchId: string, input: TransactionInput) {
  const path = `branches/${branchId}/transactions`;
  try {
    const transactionsRef = collection(db, 'branches', branchId, 'transactions');
    const docRef = await addDoc(transactionsRef, {
      ...input,
      date: input.date ? Timestamp.fromDate(input.date) : serverTimestamp(),
      createdAt: serverTimestamp(),
      branchId
    });

    // Trigger Notification
    await sendNotification({
      title: input.type === 'despesa' ? 'Nova Despesa Registrada' : 'Nova Entrada Financeira',
      message: `${input.description}: ${input.amount.toLocaleString()} MZN`,
      type: 'finance'
    });

    return docRef;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function saveReport(branchId: string, report: any) {
  const path = `branches/${branchId}/reports`;
  try {
    const reportsRef = collection(db, 'branches', branchId, 'reports');
    return await addDoc(reportsRef, {
      ...report,
      createdAt: serverTimestamp(),
      branchId
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export interface FinanceSummary {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  incomeTrend: number;
  expenseTrend: number;
  recentTransactions: any[];
}

export function subscribeToFinanceSummary(branchId: string, callback: (summary: FinanceSummary) => void) {
  const path = `branches/${branchId}/transactions`;
  const transactionsRef = collection(db, 'branches', branchId, 'transactions');
  const q = query(transactionsRef, orderBy('date', 'desc'));

  return onSnapshot(q, (querySnapshot) => {
    let totalBalance = 0;
    let monthlyIncome = 0;
    let monthlyExpenses = 0;
    let lastMonthIncome = 0;
    let lastMonthExpenses = 0;
    
    const now = new Date();
    const thisMonth = now.getMonth();
    const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
    const thisYear = now.getFullYear();
    const lastYear = thisMonth === 0 ? thisYear - 1 : thisYear;

    const recentTransactions: any[] = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const amount = data.amount || 0;
      const date = data.date?.toDate() || new Date();
      const type = data.type; // 'dizimo', 'oferta', 'contribuicao', 'despesa'
      
      // Total Balance
      if (type === 'despesa') {
        totalBalance -= amount;
      } else {
        totalBalance += amount;
      }

      // Monthly Logic
      if (date.getFullYear() === thisYear && date.getMonth() === thisMonth) {
        if (type === 'despesa') monthlyExpenses += amount;
        else monthlyIncome += amount;
      } else if (date.getFullYear() === lastYear && date.getMonth() === lastMonth) {
        if (type === 'despesa') lastMonthExpenses += amount;
        else lastMonthIncome += amount;
      }

      if (recentTransactions.length < 20) {
        recentTransactions.push({ id: doc.id, ...data, date: date.toISOString() });
      }
    });

    // Calculate Trends
    const incomeTrend = lastMonthIncome === 0 ? 100 : ((monthlyIncome - lastMonthIncome) / lastMonthIncome) * 100;
    const expenseTrend = lastMonthExpenses === 0 ? 0 : ((monthlyExpenses - lastMonthExpenses) / lastMonthExpenses) * 100;

    callback({
      totalBalance,
      monthlyIncome,
      monthlyExpenses,
      incomeTrend,
      expenseTrend,
      recentTransactions
    });
  }, (error) => {
    handleFirestoreError(error, OperationType.GET, path);
  });
}
