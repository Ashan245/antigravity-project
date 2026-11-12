import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ExpenseRecord, ExpenseCategory } from '../../types';
import { formatLKR, formatSinhalaDate, getCurrentMonthString } from '../../utils/formatters';
import { ConfirmModal } from '../common/ConfirmModal';
import { 
  TrendingDown, 
  Plus, 
  Filter, 
  Trash2, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight,
  Receipt
} from 'lucide-react';

const CATEGORIES: { id: ExpenseCategory; label: string }[] = [
  { id: 'teacher_payout', label: 'ගුරු වැටුප් (Teacher Payouts)' },
  { id: 'building_rent', label: 'ගොඩනැගිලි කුලිය (Building Rent)' },
  { id: 'electricity_water', label: 'විදුලි සහ ජල බිල්පත් (Electricity & Water)' },
  { id: 'stationery_printing', label: 'මුද්‍රණ සහ ටියුට් වියදම් (Printing & Stationery)' },
  { id: 'staff_salary', label: 'කාර්ය මණ්ඩල වැටුප් (Staff Salaries)' },
  { id: 'advertising', label: 'ප්‍රචාරණ සහ දැන්වීම් (Advertising)' },
  { id: 'maintenance', label: 'නඩත්තු කටයුතු (Maintenance)' },
  { id: 'other', label: 'වෙනත් වියදම් (Other Expenses)' }
];

export const ExpensesManagement: React.FC = () => {
  const { expenses, payments, addExpense, deleteExpense } = useData();

  const [filterMonth, setFilterMonth] = useState(getCurrentMonthString());
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Add modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ExpenseCategory>('stationery_printing');
  const [amount, setAmount] = useState<number>(0);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidTo, setPaidTo] = useState('');
  const [receiptRef, setReceiptRef] = useState('');
  const [notes, setNotes] = useState('');

  // Delete confirm
  const [deleteConfirmExpense, setDeleteConfirmExpense] = useState<ExpenseRecord | null>(null);

  // Filter expenses
  const filteredExpenses = expenses.filter(e => {
    const matchesMonth = !filterMonth || e.date.startsWith(filterMonth);
    const matchesCategory = categoryFilter === 'all' || e.category === categoryFilter;
    return matchesMonth && matchesCategory;
  });

  // Calculate monthly income for profit comparison
  const monthlyIncome = payments
    .filter(p => p.month === filterMonth || p.paymentDate.startsWith(filterMonth))
    .reduce((sum, p) => sum + p.paidAmount, 0);

  const totalFilteredExpense = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = monthlyIncome - totalFilteredExpense;

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || amount <= 0) {
      alert('කරුණාකර වියදමේ විස්තරය සහ මුදල ඇතුළත් කරන්න.');
      return;
    }

    addExpense({
      title: title.trim(),
      category,
      amount,
      date,
      paidTo: paidTo.trim(),
      receiptRef: receiptRef.trim() || undefined,
      notes: notes.trim() || undefined
    });

    setTitle('');
    setAmount(0);
    setPaidTo('');
    setReceiptRef('');
    setNotes('');
    setIsAddOpen(false);
  };

  const handleDelete = () => {
    if (deleteConfirmExpense) {
      deleteExpense(deleteConfirmExpense.id);
      setDeleteConfirmExpense(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <TrendingDown className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              වියදම් සහ ගිණුම්කරණය (Expenses & Accounts)
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            ආයතනයේ මාසික වියදම්, කුලී, බිල්පත් සහ ශුද්ධ ලාභ විශ්ලේෂණය
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold shadow-md shadow-primary-500/25 active:scale-95 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>නව වියදමක් එක් කරන්න</span>
        </button>
      </div>

      {/* Financial Health / Net Profit Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-100 dark:border-emerald-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">මෙම මාසයේ ආදායම</span>
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-2">
            {formatLKR(monthlyIncome)}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-rose-100 dark:border-rose-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">මෙම මාසයේ වියදම</span>
            <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600">
              <ArrowDownRight className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 dark:text-rose-400 mt-2">
            {formatLKR(totalFilteredExpense)}
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-100 dark:border-indigo-900/40 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">ශුද්ධ ලාභය (Net Profit)</span>
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className={`text-2xl font-black mt-2 ${netProfit >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600'}`}>
            {formatLKR(netProfit)}
          </p>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">මාසය අනුව (Month):</label>
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-500 mb-1">කාණ්ඩය අනුව (Category):</label>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white"
          >
            <option value="all">සියලු කාණ්ඩ (All Categories)</option>
            {CATEGORIES.map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
        </div>

        <div className="flex items-end">
          <button
            onClick={() => {
              setFilterMonth(getCurrentMonthString());
              setCategoryFilter('all');
            }}
            className="w-full py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          >
            පෙරහන් ඉවත් කරන්න
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/75 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-4">වියදමේ විස්තරය (Title)</th>
                <th className="py-3.5 px-4">කාණ්ඩය (Category)</th>
                <th className="py-3.5 px-4">ගෙවූ පාර්ශ්වය (Paid To)</th>
                <th className="py-3.5 px-4">දිනය (Date)</th>
                <th className="py-3.5 px-4 text-right">මුදල (Amount LKR)</th>
                <th className="py-3.5 px-4 text-right">ඉවත් කිරීම</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    වියදම් සටහන් කිසිවක් හමු නොවීය.
                  </td>
                </tr>
              ) : (
                filteredExpenses.map(exp => (
                  <tr key={exp.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <span className="font-extrabold text-slate-900 dark:text-white block">{exp.title}</span>
                      {exp.receiptRef && <span className="text-[10px] text-slate-400 font-mono">Ref: {exp.receiptRef}</span>}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-[10px]">
                        {CATEGORIES.find(c => c.id === exp.category)?.label.split('(')[0] || exp.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{exp.paidTo || '-'}</span>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-400">
                      {exp.date}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className="font-black text-rose-600 dark:text-rose-400 text-sm">
                        {formatLKR(exp.amount)}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setDeleteConfirmExpense(exp)}
                        className="p-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50"
                        title="මකා දමන්න"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
              <h3 className="text-base font-black text-slate-900 dark:text-white">නව වියදමක් එක් කිරීම</h3>
              <button onClick={() => setIsAddOpen(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-600">
                <Plus className="w-5 h-5 rotate-45" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">වියදමේ විස්තරය (Title) *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. මාර්තු මස විදුලි බිල"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3.5 py-2 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">කාණ්ඩය (Category)</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">මුදල (LKR) *</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 font-black text-rose-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">දිනය</label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">ගෙවූ පාර්ශ්වය</label>
                  <input
                    type="text"
                    placeholder="e.g. ලංකා විදුලිබල මණ්ඩලය"
                    value={paidTo}
                    onChange={(e) => setPaidTo(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">බිල්පත් අංකය (Ref)</label>
                  <input
                    type="text"
                    placeholder="e.g. CEB-883921"
                    value={receiptRef}
                    onChange={(e) => setReceiptRef(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 font-semibold"
                >
                  අවලංගු කරන්න
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold"
                >
                  එක් කරන්න
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirmExpense}
        title="වියදම මකා දැමීම තහවුරු කරන්න"
        message={`'${deleteConfirmExpense?.title}' (රු. ${deleteConfirmExpense?.amount.toLocaleString()}) වියදම් සටහන ඉවත් කිරීමට ඔබට විශ්වාසද?`}
        confirmText="ඔව්, මකා දමන්න"
        cancelText="අවලංගු කරන්න"
        isDestructive={true}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirmExpense(null)}
      />
    </div>
  );
};
