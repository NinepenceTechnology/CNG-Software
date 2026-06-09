import { useState } from 'react';
import { HeartHandshake, UserPlus, Search, MessageSquare, Flame, CheckCircle2, MoreVertical, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { translations, Language } from '@/src/translations';

interface PastoralProps {
  lang: Language;
}

const mockPastoral = [
  { id: '1', name: 'Ricardo Gomes', stage: 'Novo Convertido', visit: 'Amanhã', urgency: 'Alta' },
  { id: '2', name: 'Maria Santos', stage: 'Discipulado', visit: 'Há 2 dias', urgency: 'Normal' },
  { id: '3', name: 'Pedro Afonso', stage: 'Liderança', visit: 'Hoje', urgency: 'Baixa' },
  { id: '4', name: 'Ana Paula', stage: 'Consolidação', visit: 'Há 1 semana', urgency: 'Normal' },
];

export default function Pastoral({ lang }: PastoralProps) {
  const t = translations[lang];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.pastoralManagement}</h2>
          <p className="text-slate-500">
            {lang === 'pt' 
              ? 'Acompanhamento espiritual, visitas e cuidado pastoral da congregação.' 
              : 'Spiritual follow-up, visits, and pastoral care of the congregation.'}
          </p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
          <UserPlus className="w-4 h-4 mr-2" />
          {lang === 'pt' ? 'Nova Ficha Pastoral' : 'New Pastoral Record'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border-none shadow-sm bg-white/60 backdrop-blur-md">
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <HeartHandshake className="w-5 h-5 text-primary" />
                {lang === 'pt' ? 'Membros em Acompanhamento' : 'Members in Follow-up'}
              </CardTitle>
              <div className="relative w-full md:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <Input 
                  placeholder={lang === 'pt' ? 'Buscar membro...' : 'Search member...'} 
                  className="pl-10 h-9 bg-white/40 border-none rounded-xl"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockPastoral.map((p) => (
                <div key={p.id} className="flex items-center justify-between p-4 rounded-3xl bg-white/40 border border-white/20 hover:bg-white/60 transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 border-2 border-white">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${p.name}`} />
                      <AvatarFallback>{p.name[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-bold text-slate-800">{p.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[10px] font-bold uppercase">{p.stage}</Badge>
                        <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> {p.visit}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={`font-bold ${
                      p.urgency === 'Alta' ? 'bg-rose-100 text-rose-700' : 
                      p.urgency === 'Normal' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {p.urgency}
                    </Badge>
                    <Button variant="ghost" size="icon" className="text-slate-400">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-primary text-white overflow-hidden relative">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-300" />
                {lang === 'pt' ? 'Resumo Espiritual' : 'Spiritual Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              {[
                { label: 'Novos Convertidos', value: '45', pct: '25%' },
                { label: 'Discipulado', value: '120', pct: '60%' },
                { label: 'Preparados p/ Batismo', value: '12', pct: '5%' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase">
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                  <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-300" style={{ width: item.pct }}></div>
                  </div>
                </div>
              ))}
            </CardContent>
            <div className="absolute bottom-[-20px] right-[-20px] opacity-10">
              <HeartHandshake className="w-40 h-40" />
            </div>
          </Card>

          <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800">
                {lang === 'pt' ? 'Atividades Pastoral' : 'Pastoral Activities'}
              </CardTitle>
            </CardHeader>
          <CardContent className="space-y-4">
            <div className="mb-4 p-4 bg-primary/5 rounded-2xl border border-primary/10">
              <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-2">Próximos Eventos da Agenda</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Culto de Oração</span>
                  <Badge variant="secondary" className="text-[9px]">HOJE 18:00</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700">Consagração</span>
                  <Badge variant="secondary" className="text-[9px]">SÁB 05:00</Badge>
                </div>
              </div>
            </div>
            {[
              { icon: MessageSquare, label: 'Aconselhamentos hoje', value: '4' },
                { icon: CheckCircle2, label: 'Visitas concluídas', value: '28' },
                { icon: HeartHandshake, label: 'Pedidos de Oração', value: '15' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-white/50 rounded-2xl border border-white">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 text-primary rounded-xl">
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                  </div>
                  <span className="text-lg font-black text-slate-800">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
