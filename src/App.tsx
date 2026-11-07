import React, { useState, useEffect } from 'react';
import { 
  Shield, Wallet, User as UserIcon, History, Gift, Headphones, 
  Settings, Users, DollarSign, Lock, Globe, Bell, CheckCircle, XCircle, 
  Clock, Play, Award, ChevronRight, LogOut, Menu, X, ArrowUpRight, ArrowDownLeft 
} from 'lucide-react';
import { User, Transaction, BetRecord, GiftCode, SystemConfig, GameType } from './types';

export default function App() {
  const [lang, setLang] = useState<'mm' | 'en'>('mm');
  const [currentView, setCurrentView] = useState<'home' | 'wingo' | 'wallet' | 'promotion' | 'support' | 'profile' | 'admin' | 'history'>('home');
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [phoneInput, setPhoneInput] = useState('');

  const [config, setConfig] = useState<SystemConfig>({
    siteName: 'LUCKY WIN MYANMAR',
    maintenanceMode: false,
    minDeposit: 1000,
    maxDeposit: 5000000,
    minWithdrawal: 3000,
    maxWithdrawal: 3000000,
    kbzPhone: '09798384893',
    kbzName: 'Win Mg Mg',
    wavePhone: '09798384893',
    waveName: 'Win Mg Mg',
    announcement: 'ကြိုဆိုပါတယ်ခင်ဗျာ။ WinGo ဂိမ်းများကို 24/7 အချိန်မရွေး ကစားနိုင်ပါပြီ။',
    defaultLang: 'mm'
  });

  const [users, setUsers] = useState<User[]>([
    { phone: '9798384893', balance: 500000, inviteCode: 'OWNER99', vipLevel: 5, totalDeposit: 1000000, totalWithdraw: 500000, status: 'active', createdAt: '2026-01-01' }
  ]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [bets, setBets] = useState<BetRecord[]>([]);
  const [giftCodes, setGiftCodes] = useState<GiftCode[]>([
    { code: 'LUCKY2026', totalAmount: 50000, remainingAmount: 50000, maxUses: 10, usedCount: 0, usedBy: [] }
  ]);

  const [activeGameType, setActiveGameType] = useState<GameType>('1m');
  const [timeLeft, setTimeLeft] = useState(60);
  const [gamePeriod, setGamePeriod] = useState('2026110701001');
  const [recentResults, setRecentResults] = useState<{ period: string; number: number; type: 'big' | 'small' }[]>([
    { period: '2026110701000', number: 7, type: 'big' },
    { period: '2026110700999', number: 3, type: 'small' },
  ]);

  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawAccNo, setWithdrawAccNo] = useState('');
  const [withdrawAccName, setWithdrawAccName] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          generateGameResult();
          return activeGameType === '30s' ? 30 : activeGameType === '1m' ? 60 : activeGameType === '3m' ? 180 : 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [activeGameType, bets]);

  const generateGameResult = () => {
    const winningNumber = Math.floor(Math.random() * 10);
    const winningType: 'big' | 'small' = winningNumber >= 5 ? 'big' : 'small';
    const newPeriod = String(parseInt(gamePeriod) + 1);

    setGamePeriod(newPeriod);
    setRecentResults(prev => [{ period: newPeriod, number: winningNumber, type: winningType }, ...prev.slice(0, 9)]);

    setBets(prevBets => prevBets.map(bet => {
      if (bet.status === 'pending' && bet.gameType === activeGameType) {
        let isWin = false;
        if (bet.choice === winningType) isWin = true;
        if (bet.choice === 'number' && bet.numberChoice === winningNumber) isWin = true;

        const payout = isWin ? bet.amount * 1.98 : 0;
        if (isWin) {
          setUsers(usrs => usrs.map(u => u.phone === bet.phone ? { ...u, balance: u.balance + payout } : u));
          if (currentUser && currentUser.phone === bet.phone) {
            setCurrentUser(cu => cu ? { ...cu, balance: cu.balance + payout } : cu);
          }
        }
        return { ...bet, status: isWin ? 'won' : 'lost', payout, result: `${winningNumber} (${winningType})` };
      }
      return bet;
    }));
  };

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneInput || phoneInput.length < 9) {
      alert(lang === 'mm' ? 'မှန်ကန်သော ဖုန်းနံပါတ် ထည့်ပါ' : 'Please enter a valid phone number');
      return;
    }
    const existing = users.find(u => u.phone === phoneInput);
    if (authMode === 'login') {
      if (existing) {
        setCurrentUser(existing);
        setCurrentView('home');
      } else {
        alert(lang === 'mm' ? 'အကောင့်မရှိသေးပါ။ Register လုပ်ပါ။' : 'Account not found.');
      }
    } else {
      if (existing) {
        alert(lang === 'mm' ? 'ဤဖုန်းနံပါတ်ဖြင့် အကောင့်ရှိပြီးသားဖြစ်ပါသည်' : 'Phone already registered');
        return;
      }
      const newUser: User = {
        phone: phoneInput,
        balance: 0,
        inviteCode: 'REF' + Math.floor(1000 + Math.random() * 9000),
        vipLevel: 1,
        totalDeposit: 0,
        totalWithdraw: 0,
        status: 'active',
        createdAt: new Date().toISOString().split('T')[0]
      };
      setUsers([newUser, ...users]);
      setCurrentUser(newUser);
      setCurrentView('home');
    }
  };

  const requestDeposit = () => {
    const amt = parseFloat(depositAmount);
    if (!currentUser || isNaN(amt) || amt < config.minDeposit) {
      alert('Invalid amount');
      return;
    }
    setTransactions([{
      id: 'DEP' + Date.now(),
      phone: currentUser.phone,
      type: 'deposit',
      amount: amt,
      status: 'pending',
      createdAt: new Date().toLocaleString()
    }, ...transactions]);
    setDepositAmount('');
    alert('Deposit requested successfully.');
  };

  const requestWithdrawal = () => {
    const amt = parseFloat(withdrawAmount);
    if (!currentUser || isNaN(amt) || currentUser.balance < amt) {
      alert('Invalid amount or insufficient balance');
      return;
    }
    setTransactions([{
      id: 'WIT' + Date.now(),
      phone: currentUser.phone,
      type: 'withdrawal',
      amount: amt,
      status: 'pending',
      accountName: withdrawAccName,
      accountNo: withdrawAccNo,
      createdAt: new Date().toLocaleString()
    }, ...transactions]);
    setCurrentUser({ ...currentUser, balance: currentUser.balance - amt });
    setWithdrawAmount('');
    alert('Withdrawal requested.');
  };

  const placeBet = (choice: 'big' | 'small' | 'number', amount: number, num?: number) => {
    if (!currentUser) {
      setCurrentView('profile');
      return;
    }
    if (currentUser.balance < amount) {
      alert('Insufficient balance');
      return;
    }
    setCurrentUser({ ...currentUser, balance: currentUser.balance - amount });
    setBets([{
      id: 'BET' + Date.now(),
      phone: currentUser.phone,
      gameType: activeGameType,
      period: gamePeriod,
      choice,
      numberChoice: num,
      amount,
      status: 'pending',
      payout: 0,
      createdAt: new Date().toLocaleTimeString()
    }, ...bets]);
    alert('Bet placed successfully.');
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans pb-20">
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-50 px-4 py-3 flex items-center justify-between">
        <div className="bg-gradient-to-r from-amber-500 to-red-600 text-slate-950 font-black px-3 py-1 rounded-lg text-lg">
          {config.siteName}
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setLang(lang === 'mm' ? 'en' : 'mm')} className="bg-slate-800 px-2.5 py-1 rounded-full text-xs text-amber-400">
            {lang === 'mm' ? 'MM' : 'EN'}
          </button>
          {currentUser ? (
            <span className="text-xs text-emerald-400 font-bold">Ks {currentUser.balance.toLocaleString()}</span>
          ) : (
            <button onClick={() => setCurrentView('profile')} className="bg-amber-500 text-slate-950 px-3 py-1 rounded-full text-xs font-bold">Login</button>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto p-4">
        {currentView === 'home' && (
          <div className="space-y-4">
            <div onClick={() => setCurrentView('wingo')} className="bg-gradient-to-br from-red-950 to-amber-950 p-5 rounded-2xl border border-amber-500/40 cursor-pointer">
              <h2 className="text-2xl font-bold text-white">WinGo Lottery</h2>
              <p className="text-xs text-slate-300">Click to Play Now</p>
            </div>
            <div className="grid grid-cols-4 gap-3">
              <button onClick={() => setCurrentView('wallet')} className="bg-slate-800 p-3 rounded-xl text-xs">Wallet</button>
              <button onClick={() => setCurrentView('promotion')} className="bg-slate-800 p-3 rounded-xl text-xs">Bonus</button>
              <button onClick={() => setCurrentView('history')} className="bg-slate-800 p-3 rounded-xl text-xs">History</button>
              <button onClick={() => setCurrentView('support')} className="bg-slate-800 p-3 rounded-xl text-xs">Support</button>
            </div>
            {currentUser?.phone === '9798384893' && (
              <button onClick={() => setCurrentView('admin')} className="w-full bg-red-600 p-3 rounded-xl font-bold text-xs">Admin Panel</button>
            )}
          </div>
        )}

        {currentView === 'wingo' && (
          <div className="space-y-4">
            <button onClick={() => setCurrentView('home')} className="text-xs text-amber-400">← Back</button>
            <div className="grid grid-cols-4 gap-2">
              {(['30s', '1m', '3m', '5m'] as GameType[]).map(t => (
                <button key={t} onClick={() => setActiveGameType(t)} className={`py-2 rounded-xl text-xs font-bold ${activeGameType === t ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300'}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 flex justify-between items-center">
              <span>Period: {gamePeriod}</span>
              <span className="text-2xl font-bold text-red-500">00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}</span>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => placeBet('big', 1000)} className="bg-emerald-600 p-4 rounded-xl font-bold">Big (x1.98)</button>
              <button onClick={() => placeBet('small', 1000)} className="bg-blue-600 p-4 rounded-xl font-bold">Small (x1.98)</button>
            </div>
          </div>
        )}

        {currentView === 'wallet' && (
          <div className="space-y-4">
            <button onClick={() => setCurrentView('home')} className="text-xs text-amber-400">← Back</button>
            <div className="bg-slate-950 p-5 rounded-2xl space-y-3">
              <h3 className="text-sm font-bold text-emerald-400">Deposit</h3>
              <input type="number" placeholder="Amount" value={depositAmount} onChange={e => setDepositAmount(e.target.value)} className="w-full bg-slate-900 p-2.5 rounded-xl text-xs text-white" />
              <button onClick={requestDeposit} className="w-full bg-emerald-600 p-2.5 rounded-xl text-xs font-bold">Submit Deposit</button>
            </div>
          </div>
        )}

        {currentView === 'profile' && (
          <div className="space-y-4">
            <button onClick={() => setCurrentView('home')} className="text-xs text-amber-400">← Back</button>
            <form onSubmit={handleAuth} className="bg-slate-950 p-5 rounded-2xl space-y-3">
              <input type="tel" placeholder="Phone Number" value={phoneInput} onChange={e => setPhoneInput(e.target.value)} className="w-full bg-slate-900 p-2.5 rounded-xl text-xs text-white" />
              <button type="submit" className="w-full bg-amber-500 p-2.5 rounded-xl text-xs font-bold text-slate-950">Continue</button>
            </form>
          </div>
        )}

        {currentView === 'admin' && currentUser?.phone === '9798384893' && (
          <div className="space-y-4">
            <button onClick={() => setCurrentView('home')} className="text-xs text-amber-400">← Back</button>
            <div className="bg-slate-950 p-5 rounded-2xl border border-amber-500/40">
              <h2 className="text-sm font-bold text-amber-400 mb-2">Admin Control Panel</h2>
              <p className="text-xs text-slate-400">Owner access verified for 9798384893.</p>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-slate-950 border-t border-slate-800 p-2 flex justify-around">
        <button onClick={() => setCurrentView('home')} className="text-xs text-amber-400">Home</button>
        <button onClick={() => setCurrentView('wingo')} className="text-xs text-slate-400">WinGo</button>
        <button onClick={() => setCurrentView('wallet')} className="text-xs text-slate-400">Wallet</button>
        <button onClick={() => setCurrentView('profile')} className="text-xs text-slate-400">Profile</button>
      </nav>
    </div>
  );
}
