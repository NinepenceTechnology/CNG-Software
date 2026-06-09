import { 
  MessageSquare, 
  Send, 
  History, 
  Smartphone, 
  Mail as MailIcon, 
  CheckCircle2,
  Zap,
  Clock,
  Cake,
  Calendar as CalendarIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { translations, Language } from '@/src/translations';

interface CommunicationProps {
  lang: Language;
}

export default function Communication({ lang }: CommunicationProps) {
  const t = translations[lang];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.commManagement}</h2>
          <p className="text-slate-500">
            {lang === 'pt' ? 'Envie comunicados em massa e gerencie automações.' : 'Send bulk announcements and manage automations.'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white/60 backdrop-blur-md border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                {t.bulkMessaging}
              </CardTitle>
              <CardDescription>
                {lang === 'pt' ? 'Envie mensagens para toda a igreja ou grupos específicos.' : 'Send messages to the entire church or specific groups.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="whatsapp" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6 bg-transparent border border-slate-200/30 p-1">
                  <TabsTrigger value="whatsapp" className="flex items-center gap-2 data-[state=active]:bg-white/50 data-[state=active]:backdrop-blur-sm">
                    <MessageSquare className="w-4 h-4" /> WhatsApp
                  </TabsTrigger>
                  <TabsTrigger value="sms" className="flex items-center gap-2 data-[state=active]:bg-white/50 data-[state=active]:backdrop-blur-sm">
                    <Smartphone className="w-4 h-4" /> SMS
                  </TabsTrigger>
                </TabsList>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{lang === 'pt' ? 'Número Associado (Cobrança Carrier)' : 'Associated Number (Carrier Billing)'}</Label>
                    <div className="flex gap-2">
                       <Input 
                         placeholder="+258 ..." 
                         defaultValue="+258 84 000 0000"
                         className="rounded-xl border-slate-200"
                       />
                       <Button variant="outline" className="rounded-xl border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                         {lang === 'pt' ? 'Ativar' : 'Activate'}
                       </Button>
                    </div>
                    <p className="text-[10px] text-slate-400 uppercase font-bold leading-tight">
                       {lang === 'pt' 
                         ? 'Este é o número que a sua operadora de rede usará para cobrar as SMS e o consumo de dados (MB) do WhatsApp.' 
                         : 'This is the number your network carrier will use to charge for SMS and WhatsApp data consumption (MB).'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>{lang === 'pt' ? 'Campanha de Marketing' : 'Marketing Campaign'}</Label>
                    <select className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/50 outline-none transition-all text-sm">
                      <option>{lang === 'pt' ? 'Nenhuma (Mensagem Avulsa)' : 'None (Single Message)'}</option>
                      <option>{lang === 'pt' ? 'Campanha de Edificação' : 'Edification Campaign'}</option>
                      <option>{lang === 'pt' ? 'Campanha de Arrecadação' : 'Fundraising Campaign'}</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label>{lang === 'pt' ? 'Destinatários' : 'Recipients'}</Label>
                    <div className="flex flex-wrap gap-2 py-2">
                      <Button variant="outline" size="sm" className="rounded-full bg-primary/5 border-primary/20 text-primary">
                        {lang === 'pt' ? 'Todos os Membros' : 'All Members'}
                      </Button>
                      {[
                        'Mulheres de destino', 'Obreiros', 'Protocolo', 'Secretariado', 
                        'Ornamentação', 'Midia', 'Intersecção', 'Assembleia', 
                        'Homens vencedores', 'Jovens radicais', 'Jurídico', 'Dorcas', 
                        'Crianças', 'Adolescentes', 'Finanças', 'Assuntos disciplinares', 
                        'Louvor e adoração'
                      ].map((group) => (
                        <Button key={group} variant="outline" size="sm" className="rounded-full hover:bg-primary/5 hover:text-primary transition-colors text-xs font-normal">
                          {group}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>{lang === 'pt' ? 'Mensagem (Suporta Newsletter & IA)' : 'Message (Supports Newsletter & AI)'}</Label>
                    <textarea 
                      className="w-full min-h-[150px] p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/50 outline-none transition-all resize-none"
                      placeholder={lang === 'pt' ? 'Digite sua mensagem ou template de newsletter...' : 'Type your message or newsletter template...'}
                    ></textarea>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-widest animate-pulse">IA: {lang === 'pt' ? 'Padrão de engajamento alto detectado' : 'High engagement pattern detected'}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-slate-50/50 rounded-xl border border-slate-100">
                    <div className="text-sm">
                      <p className="font-bold text-slate-800">{lang === 'pt' ? 'Rede Local' : 'Local Network'}</p>
                      <p className="text-slate-500">{lang === 'pt' ? 'Envio via servidor local da igreja' : 'Sending via church local server'}</p>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100 border-none">
                      {lang === 'pt' ? 'Conectado' : 'Connected'}
                    </Badge>
                  </div>

                  <Button className="w-full bg-primary hover:bg-primary/90 h-12 text-lg font-bold">
                    <Send className="w-5 h-5 mr-2" />
                    {t.bulkMessaging}
                  </Button>
                </div>
              </Tabs>
            </CardContent>
          </Card>

          <Card className="bg-white/60 backdrop-blur-md border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                {t.automatedMessages}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                    <Cake className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{t.birthdayGreetings}</p>
                    <p className="text-sm text-slate-500">{lang === 'pt' ? 'Envio automático às 08:00 no dia do aniversário.' : 'Automatic sending at 08:00 on the birthday.'}</p>
                  </div>
                </div>
                <Switch checked={true} />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{t.eventReminders}</p>
                    <p className="text-sm text-slate-500">{lang === 'pt' ? 'Lembretes 24h e 1h antes de cada evento (WhatsApp & SMS).' : 'Reminders 24h and 1h before each event (WhatsApp & SMS).'}</p>
                  </div>
                </div>
                <Switch checked={true} />
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Button variant="outline" className="w-full">
                  {t.saveSettings}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="bg-white/60 backdrop-blur-md border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">
                {lang === 'pt' ? 'Status de Envio' : 'Sending Status'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { title: lang === 'pt' ? 'Informativo Semanal' : 'Weekly News', status: 'Enviado', count: 1200, time: lang === 'pt' ? 'Hoje, 09:00' : 'Today, 09:00' },
                  { title: lang === 'pt' ? 'Reunião de Líderes' : 'Leaders Meeting', status: 'Enviado', count: 45, time: lang === 'pt' ? 'Ontem, 18:30' : 'Yesterday, 18:30' },
                  { title: lang === 'pt' ? 'Parabéns (Automático)' : 'Birthday (Auto)', status: 'Enviado', count: 3, time: lang === 'pt' ? 'Hoje, 08:00' : 'Today, 08:00' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100">
                    <div className="p-2 rounded-full bg-green-50 text-green-600">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-800">{item.title}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">
                        {item.count} {lang === 'pt' ? 'destinatários' : 'recipients'} • {item.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-primary hover:text-primary/90 hover:bg-primary/5">
                <History className="w-3.5 h-3.5 mr-2" />
                {lang === 'pt' ? 'Ver Histórico Completo' : 'View Full History'}
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-secondary/10 border-secondary/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-3 bg-secondary/20 rounded-lg w-fit text-secondary-foreground">
                  <Smartphone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">
                    {lang === 'pt' ? 'Portal do Membro' : 'Member Portal'}
                  </h3>
                  <p className="text-slate-500 text-sm">
                    {lang === 'pt' ? 'Seus membros podem acessar notícias e documentos através do portal.' : 'Your members can access news and documents through the portal.'}
                  </p>
                </div>
                <Button variant="secondary" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90">
                  {lang === 'pt' ? 'Gerenciar Portal' : 'Manage Portal'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
