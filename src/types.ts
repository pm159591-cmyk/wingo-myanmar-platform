export type GameType = '30s' | '1m' | '3m' | '5m';

export interface User {
  phone: string;
  balance: number;
  inviteCode: string;
  referredBy?: string;
  vipLevel: number;
  totalDeposit: number;
  totalWithdraw: number;
  status: 'active' | 'suspended';
  createdAt: string;
}

export interface Transaction {
  id: string;
  phone: string;
  type: 'deposit' | 'withdrawal' | 'bonus' | 'bet' | 'win';
  amount: number;
  status: 'pending' | 'approved' | 'cancelled';
  method?: 'KBZPay' | 'WavePay';
  accountName?: string;
  accountNo?: string;
  createdAt: string;
}

export interface BetRecord {
  id: string;
  phone: string;
  gameType: GameType;
  period: string;
  choice: 'big' | 'small' | 'number';
  numberChoice?: number;
  amount: number;
  result?: string;
  status: 'pending' | 'won' | 'lost';
  payout: number;
  createdAt: string;
}

export interface GiftCode {
  code: string;
  totalAmount: number;
  remainingAmount: number;
  maxUses: number;
  usedCount: number;
  usedBy: string[];
}

export interface SystemConfig {
  siteName: string;
  maintenanceMode: boolean;
  minDeposit: number;
  maxDeposit: number;
  minWithdrawal: number;
  maxWithdrawal: number;
  kbzPhone: string;
  kbzName: string;
  wavePhone: string;
  waveName: string;
  announcement: string;
  defaultLang: 'mm' | 'en';
}
