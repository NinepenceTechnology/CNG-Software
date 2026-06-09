import { useState, useEffect } from 'react';
import { 
  Wallet, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  Download,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  CreditCard,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { translations, Language } from '@/src/translations';
import { subscribeToFinanceSummary, FinanceSummary, addTransaction } from '@/src/services/financeService';

interface FinanceProps {
  lang: Language;
  activeBranch: string;
}

export default function Finance({ lang, activeBranch }: FinanceProps) {
  const t = translations[lang];
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<FinanceSummary | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToFinanceSummary(activeBranch, (data) => {
      setSummary(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [activeBranch]);

  const handleManualAdd = async () => {
    const desc = prompt(lang === 'pt' ? 'Descrição:' : 'Description:');
    const amountStr = prompt(lang === 'pt' ? 'Valor (MZN):' : 'Amount (MZN):');
    const type = prompt(lang === 'pt' ? 'Tipo (dizimo, oferta, despesa):' : 'Type (tithe, offering, expense):') as any;
    
    if (desc && amountStr && type) {
      const amount = parseFloat(amountStr);
      await addTransaction(activeBranch, {
        description: desc,
        amount: amount,
        type: type === 'tithe' ? 'dizimo' : (type === 'offering' ? 'oferta' : (type === 'expense' ? 'despesa' : 'contribuicao')),
        status: 'pago',
        category: type,
        date: new Date()
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
        <p className="text-slate-500 font-medium">
          {lang === 'pt' ? 'Calculando finanças inteligentes...' : 'Calculating intelligent finances...'}
        </p>
      </div>
    );
  }

  const filteredTransactions = summary?.recentTransactions.filter(tx => 
    tx.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.type.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.financeManagement}</h2>
          <p className="text-slate-500">
            {lang === 'pt' ? `Gestão financeira da ${activeBranch}` : `Financial management for ${activeBranch}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 font-bold rounded-xl"
            onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'pagamentos' }))}
          >
            <CreditCard className="w-4 h-4 mr-2" />
            {lang === 'pt' ? 'Portal de Doação' : 'Donation Portal'}
          </Button>
          <Button variant="outline" className="rounded-xl" onClick={() => window.dispatchEvent(new CustomEvent('changeTab', { detail: 'relatorios' }))}>
            <Download className="w-4 h-4 mr-2" />
            {t.reports}
          </Button>
          <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl" onClick={handleManualAdd}>
            <Plus className="w-4 h-4 mr-2" />
            {t.newTransaction}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white/80 backdrop-blur-md border-none shadow-sm rounded-2xl overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Wallet className="w-12 h-12" />
          </div>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-slate-500 uppercase tracking-wider">
              {lang === 'pt' ? 'Saldo Total' : 'Total Balance'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-slate-800">{t.currency} {summary?.totalBalance.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-emerald-500 mt-2 flex items-center gap-1 font-bold">
              {summary?.totalBalance && summary.totalBalance >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3 text-rose-500" />}
              {lang === 'pt' ? 'Recursos disponíveis' : 'Available resources'}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-emerald-50/50 backdrop-blur-md border-emerald-100 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-emerald-600 uppercase tracking-wider">
              {lang === 'pt' ? 'Entradas (Mês)' : 'Incomes (Month)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-emerald-700">{t.currency} {summary?.monthlyIncome.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-emerald-600/70 mt-2 flex items-center gap-1 font-bold">
              <TrendingUp className="w-3 h-3" /> {summary?.incomeTrend.toFixed(1)}% {t.vsLastMonth}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-rose-50/50 backdrop-blur-md border-rose-100 rounded-2xl overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold text-rose-600 uppercase tracking-wider">
              {lang === 'pt' ? 'Saídas (Mês)' : 'Expenses (Month)'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-black text-rose-700">{t.currency} {summary?.monthlyExpenses.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })}</div>
            <p className="text-xs text-rose-600 mt-2 flex items-center gap-1 font-bold">
              {summary?.expenseTrend && summary.expenseTrend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              {summary?.expenseTrend.toFixed(1)}% {t.vsLastMonth}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white/80 backdrop-blur-md border-none shadow-xl rounded-3xl overflow-hidden">
        <CardHeader className="border-b border-slate-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder={lang === 'pt' ? 'Filtrar histórico...' : 'Filter history...'} 
                className="pl-10 border-slate-200 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="ghost" size="sm" className="rounded-lg text-slate-500">
              <Filter className="w-4 h-4 mr-2" />
              {lang === 'pt' ? 'Filtros' : 'Filters'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50/50">
              <TableRow>
                <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest pl-6">{lang === 'pt' ? 'Descrição' : 'Description'}</TableHead>
                <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">{lang === 'pt' ? 'Categoria' : 'Category'}</TableHead>
                <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">{lang === 'pt' ? 'Data' : 'Date'}</TableHead>
                <TableHead className="font-bold text-slate-500 uppercase text-[10px] tracking-widest text-right pr-8">{lang === 'pt' ? 'Valor' : 'Amount'}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="h-32 text-center text-slate-400">
                    {lang === 'pt' ? 'Nenhuma transação encontrada.' : 'No transactions found.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredTransactions.map((tx) => (
                  <TableRow key={tx.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell className="font-bold text-slate-700 py-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${tx.type === 'despesa' ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-600'}`}>
                          {tx.type === 'despesa' ? (
                            <ArrowDownRight className="w-4 h-4" />
                          ) : (
                            <ArrowUpRight className="w-4 h-4" />
                          )}
                        </div>
                        {tx.description}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize rounded-md text-[10px] px-2">
                        {tx.category || tx.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-slate-400 text-sm">
                      {new Date(tx.date).toLocaleDateString(lang === 'pt' ? 'pt-MZ' : 'en-MZ')}
                    </TableCell>
                    <TableCell className={`text-right pr-8 font-black ${tx.type === 'despesa' ? 'text-rose-600' : 'text-emerald-700'}`}>
                      {tx.type === 'despesa' ? '-' : '+'} {t.currency} {tx.amount.toLocaleString('pt-MZ', { minimumFractionDigits: 2 })}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
