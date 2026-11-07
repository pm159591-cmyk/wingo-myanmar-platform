import React, { useState } from 'react';

export default function App() {
  const [balance, setBalance] = useState<number>(50000);
  const [selectedPeriod, setSelectedPeriod] = useState<string>('30s');
  const [betAmount, setBetAmount] = useState<number>(1000);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center p-4">
      {/* Header */}
      <header className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-4 mb-4 flex justify-between items-center shadow-lg">
        <div>
          <h1 className="text-xl font-bold text-emerald-400">WinGo Myanmar</h1>
          <p className="text-xs text-slate-400">Live Gaming Platform</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400">Balance</p>
          <p className="text-lg font-bold text-amber-400">{balance.toLocaleString()} MMK</p>
        </div>
      </header>

      {/* Main Game Card */}
      <main className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col gap-4">
        {/* Timer Selection */}
        <div className="grid grid-cols-4 gap-2">
          {['30s', '1m', '3m', '5m'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`py-2 rounded-xl text-sm font-semibold transition-all ${
                selectedPeriod === period
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              WinGo {period}
            </button>
          ))}
        </div>

        {/* Timer & Status Display */}
        <div className="bg-slate-950 rounded-xl p-6 text-center border border-slate-800 relative overflow-hidden">
          <p className="text-xs text-slate-400 mb-1">Time Remaining</p>
          <div className="text-4xl font-black tracking-wider text-emerald-400 mb-2">00:24</div>
          <p className="text-xs text-slate-500">Period ID: 2026110801042</p>
        </div>

        {/* Betting Options */}
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-3 gap-2">
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-900/30">
              Green (2x)
            </button>
            <button className="bg-purple-600 hover:bg-purple-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-purple-900/30">
              Violet (4.5x)
            </button>
            <button className="bg-rose-600 hover:bg-rose-500 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-rose-900/30">
              Red (2x)
            </button>
          </div>

          {/* Number Picker */}
          <div className="grid grid-cols-5 gap-2 pt-2">
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                className="bg-slate-800 hover:bg-slate-700 text-slate-200 py-2.5 rounded-lg font-bold text-sm border border-slate-700"
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button 
          onClick={() => alert('Bet Placed Successfully!')}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-500/20 hover:opacity-95 transition-all mt-2"
        >
          Place Bet ({betAmount.toLocaleString()} MMK)
        </button>
      </main>
    </div>
  );
}
