/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'pastor' | 'tesoureiro' | 'secretario' | 'admin';

export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  birthDate: string;
  baptismDate?: string;
  marriageDate?: string;
  group: string;
  status: 'ativo' | 'inativo' | 'visitante';
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'dizimo' | 'oferta' | 'contribuicao' | 'despesa';
  amount: number;
  date: string;
  description: string;
  memberId?: string; // For tithes/offerings
  category: string;
  status: 'pago' | 'pendente';
}

export interface ChurchEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  type: 'culto' | 'reuniao' | 'conferencia' | 'evento';
  attendeesCount: number;
}

export interface Volunteer {
  id: string;
  memberId: string;
  role: string;
  department: string;
  schedule: string[]; // Days of week or specific dates
  performanceRating?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'sms' | 'email' | 'whatsapp';
  sentAt: string;
  recipientCount: number;
}
