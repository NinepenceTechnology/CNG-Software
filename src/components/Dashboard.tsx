import { 
  Users, 
  Wallet, 
  Calendar, 
  UserCheck, 
  TrendingUp,
  Cake,
  ChevronRight,
  MessageSquare,
  Rocket
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
} from 'recharts';
import { translations, Language } from '@/src/translations';
import { useState, useEffect } from 'react';
import { subscribeToMembers } from '@/src/services/membersService';
import { subscribeToEvents } from '@/src/services/eventsService';
import { subscribeToFinanceSummary, FinanceSummary } from '@/src/services/financeService';

interface DashboardProps {
  lang: Language;
  userRole: string;
  activeBranch: string;
}

export default function Dashboard({ lang, userRole, activeBranch }: DashboardProps) {
  const t = translations[lang];
  const [memberCount, setMemberCount] = useState(0);
  const [eventCount, setEventCount] = useState(0);
  const [financeSummary, setFinanceSummary] = useState<FinanceSummary | null>(null);

  useEffect(() => {
    const unsubMembers = subscribeToMembers(activeBranch, (members) => setMemberCount(members.length));
    const unsubEvents = subscribeToEvents(activeBranch, (events) => setEventCount(events.length));
    const unsubFinance = subscribeToFinanceSummary(activeBranch, (summary) => setFinanceSummary(summary));

    return () => {
      unsubMembers();
      unsubEvents();
      unsubFinance();
    };
  }, [activeBranch]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Members */}
        {(userRole === 'admin' || userRole === 'leader' || userRole === 'secretary') && (
          <Card className="border-none shadow-sm bg-white/70 backdrop-blur-md rounded-[32px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-black text-black/60 uppercase tracking-widest">{t.totalMembers}</CardTitle>
              <div className="p-2 bg-indigo-500/10 rounded-xl">
                <Users className="w-4 h-4 text-indigo-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">{memberCount}</div>
            </CardContent>
          </Card>
        )}

        {/* Attendance - Admin, Leader, Secretary */}
        {(userRole === 'admin' || userRole === 'leader' || userRole === 'secretary') && (
          <Card className="border-none shadow-sm bg-white/70 backdrop-blur-md rounded-[32px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-black text-black/60 uppercase tracking-widest">{t.avgAttendance}</CardTitle>
              <div className="p-2 bg-primary/10 rounded-xl">
                <UserCheck className="w-4 h-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">85%</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-black/40 ml-1">{t.vsLastMonth} (+5%)</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Events - Admin, Leader, Collaborator, Secretary */}
        {(userRole === 'admin' || userRole === 'leader' || userRole === 'collaborator' || userRole === 'secretary') && (
          <Card className="border-none shadow-sm bg-white/70 backdrop-blur-md rounded-[32px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-black text-black/60 uppercase tracking-widest">{t.activeEvents}</CardTitle>
              <div className="p-2 bg-secondary/10 rounded-xl">
                <Calendar className="w-4 h-4 text-secondary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-black">{eventCount}</div>
              <div className="flex items-center gap-1 mt-1">
                <span className="text-xs text-black/50 font-bold uppercase">
                  {eventCount > 0 
                    ? (lang === 'pt' ? `${eventCount} eventos programados` : `${eventCount} scheduled events`)
                    : (lang === 'pt' ? 'Nenhum agendado' : 'None scheduled')}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Finance Stats - Admin, Treasurer */}
        {(userRole === 'admin' || userRole === 'treasurer') && (
          <Card className="border-none shadow-sm bg-white/70 backdrop-blur-md rounded-[32px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-black text-black/60 uppercase tracking-widest">{lang === 'pt' ? 'Saldo Atual' : 'Current Balance'}</CardTitle>
              <div className="p-2 bg-emerald-500/10 rounded-xl">
                <Wallet className="w-4 h-4 text-emerald-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black text-emerald-600">
                {t.currency} {financeSummary?.totalBalance.toLocaleString() || '0,00'}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm bg-white/70 backdrop-blur-md rounded-[40px]">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black text-black tracking-tight uppercase">{t.recentActivities}</CardTitle>
          </CardHeader>
          <CardContent>
            {financeSummary?.recentTransactions.length ? (
              <div className="space-y-4">
                {financeSummary.recentTransactions.slice(0, 5).map((tx, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-xl ${tx.type === 'despesa' ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                        <Wallet className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{tx.description}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-black">{tx.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-black ${tx.type === 'despesa' ? 'text-rose-500' : 'text-emerald-500'}`}>
                        {tx.type === 'despesa' ? '-' : '+'} {t.currency} {tx.amount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold">{new Date(tx.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center space-y-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto opacity-40">
                  <Rocket className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                  {lang === 'pt' ? 'Nenhuma atividade recente registrada' : 'No recent activity recorded'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="lg:col-span-1 space-y-6">
          {/* Analysis - Admin and Leader/Secretary */}
          {(userRole === 'admin' || userRole === 'leader' || userRole === 'secretary') && (
            <Card className="border-none shadow-sm bg-primary text-white rounded-[40px] p-6 overflow-hidden relative group">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60 mb-1">{lang === 'pt' ? 'Análise de Crescimento' : 'Growth Analysis'}</p>
                <h3 className="text-2xl font-black leading-tight mb-4">
                  {lang === 'pt' ? 'Pronto para novos dados' : 'Ready for new data'}
                </h3>
                <p className="text-xs opacity-80 leading-relaxed">
                  {lang === 'pt' 
                    ? 'Insira novos membros e eventos para gerar análises preditivas.' 
                    : 'Enter new members and events to generate predictive analysis.'}
                </p>
              </div>
              <TrendingUp className="absolute right-[-20px] bottom-[-20px] w-32 h-32 opacity-10 group-hover:scale-110 transition-transform" />
            </Card>
          )}

          {/* Birthdays - All except Treasurer (as per request "finance only") */}
          {userRole !== 'treasurer' && (
            <Card className="border-none shadow-sm bg-white/70 backdrop-blur-md rounded-[40px]">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-black text-black flex items-center gap-2 uppercase tracking-tight">
                  <Cake className="w-5 h-5 text-secondary" />
                  {t.upcomingBirthdays}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs font-bold text-black/30 uppercase tracking-widest text-center py-4">
                  {lang === 'pt' ? 'Nenhum aniversário nos próximos dias' : 'No birthdays in the coming days'}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
