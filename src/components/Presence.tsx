import { useState } from 'react';
import { UserCheck, Scan, Camera, Users, History, CheckCircle2, XCircle, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { translations, Language } from '@/src/translations';
import { mockMembers } from '@/src/mockData';

interface PresenceProps {
  lang: Language;
}

export default function Presence({ lang }: PresenceProps) {
  const t = translations[lang];
  const [isScanning, setIsScanning] = useState(false);
  const [lastCheckin, setLastCheckin] = useState<any>(null);

  const simulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      const randomMember = mockMembers[Math.floor(Math.random() * mockMembers.length)];
      setLastCheckin({
        ...randomMember,
        time: new Date().toLocaleTimeString(),
        status: 'Presença Confirmada'
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.presenceManagement}</h2>
          <p className="text-slate-500">
            {lang === 'pt' 
              ? 'Controle de presença manual e gestão de escalas de ministérios.' 
              : 'Manual presence control and ministry schedule management.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <History className="w-5 h-5 text-secondary" />
              {lang === 'pt' ? 'Check-ins Recentes' : 'Recent Check-ins'}
            </CardTitle>
            <Button variant="outline" size="sm" className="rounded-xl">
               <Plus className="w-4 h-4 mr-2" />
               {lang === 'pt' ? 'Chamada Manual' : 'Manual Roll Call'}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockMembers.map((member, i) => (
              <div key={member.id} className="flex items-center justify-between p-3 rounded-2xl bg-white/40 border border-white/20">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.name}`} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{member.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">{member.group}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className="text-[10px] text-slate-500 font-bold">08:45 AM</span>
                  <Badge className="bg-emerald-100 text-emerald-700 font-bold">PRESENTE</Badge>
                </div>
              </div>
            ))}
          </CardContent>
          <div className="p-4 border-t border-slate-100/50 bg-white/20">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 uppercase">
              <span>Total: {mockMembers.length}</span>
              <span className="text-primary cursor-pointer hover:underline">Ver Todos</span>
            </div>
          </div>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md rounded-[24px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            {lang === 'pt' ? 'Escalas de Voluntários e Ministérios' : 'Volunteer & Ministry Schedules'}
          </CardTitle>
          <Button variant="outline" size="sm" className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            {lang === 'pt' ? 'Nova Escala' : 'New Schedule'}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { ministry: 'Louvor e Adoração', status: 'Ativa', members: 8, lead: 'Ricardo' },
              { ministry: 'Midia e Transmissão', status: 'Ativa', members: 4, lead: 'Sarah' },
              { ministry: 'Acolhimento', status: 'Em Revisão', members: 6, lead: 'Marta' },
            ].map((min, i) => (
              <div key={i} className="p-4 rounded-2xl bg-white/40 border border-white/20 hover:border-primary/30 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className={`px-2 py-1 rounded-lg text-[9px] font-black uppercase ${
                    min.status === 'Ativa' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {min.status}
                  </div>
                  <UserCheck className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-bold text-slate-800">{min.ministry}</h3>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(j => (
                      <Avatar key={j} className="w-6 h-6 border-2 border-white">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=volunteer${i}${j}`} />
                      </Avatar>
                    ))}
                    <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold border-2 border-white">+{min.members - 3}</div>
                  </div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase">{lang === 'pt' ? 'Líder' : 'Lead'}: {min.lead}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
