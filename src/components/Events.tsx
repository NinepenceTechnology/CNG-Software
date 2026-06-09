import { 
  Calendar as CalendarIcon, 
  Plus, 
  MapPin, 
  Clock, 
  Users,
  Search,
  ChevronRight,
  BellRing,
  Settings2,
  Rocket,
  Send,
  Play,
  MessageCircle,
  Loader2,
  HeartHandshake
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { DayPicker } from 'react-day-picker';
import { ptBR, enUS } from 'date-fns/locale';
import { translations, Language } from '@/src/translations';
import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { auth } from '@/src/lib/firebase';
import { subscribeToEvents, addEvent, ChurchEvent } from '@/src/services/eventsService';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

interface EventsProps {
  lang: Language;
  activeBranch: string;
}

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: string;
  userId?: string;
}

export default function Events({ lang, activeBranch }: EventsProps) {
  const t = translations[lang];
  const locale = lang === 'pt' ? ptBR : enUS;
  const [isLive, setIsLive] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connected, setConnected] = useState(false);
  const [events, setEvents] = useState<ChurchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const chatScrollRef = useRef<HTMLDivElement>(null);
  const currentUser = auth.currentUser;

  const [formData, setFormData] = useState({
    title: '',
    date: new Date(),
    time: '',
    location: '',
    category: 'culto',
    description: ''
  });

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToEvents(activeBranch, (data) => {
      setEvents(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [activeBranch]);

  useEffect(() => {
    const newSocket = io(window.location.origin, {
      path: '/socket.io/',
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000
    });
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setConnected(true);
      console.log('Events chat connected:', newSocket.id);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Events socket error:', error);
      setConnected(false);
    });

    newSocket.on('message', (message: Message) => {
      setChatMessages((prev) => [...prev, message]);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const handleCreateEvent = async () => {
    try {
      await addEvent(activeBranch, formData);
      setIsDialogOpen(false);
      setFormData({
        title: '',
        date: new Date(),
        time: '',
        location: '',
        category: 'culto',
        description: ''
      });
    } catch (error) {
      console.error("Error adding event:", error);
    }
  };

  const handleSendLiveMessage = () => {
    if (chatInput.trim() && socket && connected) {
      const messageData = {
        user: currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Membro',
        userId: currentUser?.uid,
        text: chatInput,
        timestamp: new Date().toISOString()
      };
      socket.emit('message', messageData);
      setChatInput('');
    }
  };

  const eventDays = events.map(e => e.date instanceof Date ? e.date : (e.date?.toDate ? e.date.toDate() : new Date(e.date)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.eventManagement}</h2>
          <p className="text-slate-500">
            {lang === 'pt' ? `Eventos da assembleia ${activeBranch}` : `Events for ${activeBranch} assembly`}
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 h-11 px-6">
              <Plus className="w-5 h-5 mr-2" />
              {t.newEvent}
            </Button>
          </DialogTrigger>
          <DialogContent className="rounded-3xl">
            <DialogHeader>
              <DialogTitle>{t.newEvent}</DialogTitle>
              <DialogDescription>
                {lang === 'pt' ? 'Agende um novo evento para esta assembleia.' : 'Schedule a new event for this assembly.'}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <Label>{lang === 'pt' ? 'Título' : 'Title'}</Label>
                <Input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="rounded-xl" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label>Data</Label>
                  <Input type="date" onChange={e => setFormData({...formData, date: new Date(e.target.value)})} className="rounded-xl" />
                </div>
                <div className="space-y-1">
                  <Label>{lang === 'pt' ? 'Hora' : 'Time'}</Label>
                  <Input type="time" value={formData.time} onChange={e => setFormData({...formData, time: e.target.value})} className="rounded-xl" />
                </div>
              </div>
              <div className="space-y-1">
                <Label>{lang === 'pt' ? 'Local' : 'Location'}</Label>
                <Input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className="rounded-xl" />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateEvent} className="bg-primary rounded-xl w-full">{lang === 'pt' ? 'Criar Evento' : 'Create Event'}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-bold flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full ${isLive ? 'bg-rose-500 animate-pulse' : 'bg-slate-300'}`} />
                  {lang === 'pt' ? 'Transmissão ao Vivo' : 'Live Streaming'}
                </CardTitle>
                {isLive && (
                  <Badge className="bg-rose-500 text-white border-none animate-pulse">
                    {lang === 'pt' ? 'AO VIVO' : 'LIVE'}
                  </Badge>
                )}
              </div>
              <CardDescription>
                {lang === 'pt' ? 'Acompanhe os cultos em tempo real diretamente pelo painel.' : 'Watch services in real-time directly through the dashboard.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="aspect-video bg-slate-900 relative flex items-center justify-center overflow-hidden">
                {!isLive ? (
                  <div className="flex flex-col items-center gap-6 text-white text-center p-8">
                    <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center animate-pulse">
                      <Play className="w-10 h-10 text-primary fill-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2">
                        {lang === 'pt' ? 'Culto de Domingo - Manhã' : 'Sunday Service - Morning'}
                      </h3>
                      <p className="text-white/60 text-sm max-w-md mx-auto">
                        {lang === 'pt' 
                          ? 'A transmissão não é gravada para garantir a privacidade e fluidez do servidor.' 
                          : 'The stream is not recorded to ensure privacy and server fluidity.'}
                      </p>
                    </div>
                    {currentUser?.email?.includes('admin') || currentUser?.email?.includes('leader') ? (
                      <Button 
                        onClick={() => setIsLive(true)}
                        className="bg-primary hover:bg-primary/90 px-8 h-12 text-lg font-bold"
                      >
                        <Rocket className="w-5 h-5 mr-2" />
                        {lang === 'pt' ? 'Iniciar Transmissão (Admin)' : 'Start Streaming (Admin)'}
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => setIsLive(true)}
                        className="bg-secondary text-black hover:bg-secondary/90 px-8 h-12 text-lg font-bold"
                      >
                        <Play className="w-5 h-5 mr-2" />
                        {lang === 'pt' ? 'Assistir Transmissão' : 'Watch Streaming'}
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src={`https://meet.jit.si/CNG_Live_Event_${activeBranch.replace(/\s+/g, '_')}#config.p2p.enabled=false&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","chat","raisehand","tileview"]`}
                      allow="camera; microphone; fullscreen; display-capture"
                      className="absolute inset-0"
                    ></iframe>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => setIsLive(false)}
                      className="absolute top-4 left-4 z-50 rounded-xl"
                    >
                      {lang === 'pt' ? 'Sair da Transmissão' : 'Exit Streaming'}
                    </Button>
                  </div>
                )}
              </div>
              
              <div className="p-4 bg-white/40 border-t border-slate-100 flex flex-col md:flex-row gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <MessageCircle className="w-3 h-3" />
                      {lang === 'pt' ? 'Chat ao Vivo' : 'Live Chat'}
                      {!connected && <Loader2 className="w-2 h-2 animate-spin ml-2" />}
                    </p>
                    <span className="text-[10px] font-bold text-emerald-500">
                      {chatMessages.length + 12} {lang === 'pt' ? 'pessoas assistindo' : 'people watching'}
                    </span>
                  </div>
                  
                  <div 
                    ref={chatScrollRef}
                    className="h-48 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200"
                  >
                    {chatMessages.length === 0 && (
                      <div className="text-[10px] text-slate-400 italic text-center py-4">
                        {lang === 'pt' ? 'Seja o primeiro a deixar uma mensagem!' : 'Be the first to leave a message!'}
                      </div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <div key={msg.id || i} className="flex gap-2 animate-in fade-in slide-in-from-bottom-2">
                        <span className={`text-[11px] font-black shrink-0 ${msg.userId === currentUser?.uid ? 'text-primary' : 'text-slate-500'}`}>
                          {msg.user}:
                        </span>
                        <p className="text-[11px] text-slate-700 leading-tight">{msg.text}</p>
                      </div>
                    ))}
                    {/* Dummy messages to make it look full if empty */}
                    {chatMessages.length < 3 && (
                      <>
                        <div className="flex gap-2">
                          <span className="text-[11px] font-black text-slate-500 shrink-0">Ir. João:</span>
                          <p className="text-[11px] text-slate-700 leading-tight">A paz do Senhor! Igreja abençoada.</p>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-[11px] font-black text-slate-500 shrink-0">Ir. Maria:</span>
                          <p className="text-[11px] text-slate-700 leading-tight">Amém, glória a Deus por este culto!</p>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="relative">
                    <Input 
                      placeholder={lang === 'pt' ? 'Comentar...' : 'Comment...'} 
                      value={chatInput}
                      onChange={(e) => setChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendLiveMessage()}
                      className="pr-10 h-10 rounded-xl bg-white border-slate-100 shadow-sm" 
                    />
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={handleSendLiveMessage}
                      disabled={!chatInput.trim() || !connected}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-primary hover:bg-primary/5"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold">
                  {lang === 'pt' ? 'Próximos Eventos' : 'Upcoming Events'}
                </CardTitle>
                <div className="relative w-64 hidden md:block">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <Input 
                    placeholder={lang === 'pt' ? 'Buscar eventos...' : 'Search events...'} 
                    className="pl-10 h-9 bg-slate-50 border-none rounded-lg" 
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                  </div>
                ) : events.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 font-medium">
                    {lang === 'pt' ? 'Nenhum evento agendado.' : 'No events scheduled.'}
                  </div>
                ) : (
                  <>
                    {/* Pastoral Reminders Integrated */}
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-2xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
                          <HeartHandshake className="w-4 h-4" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-amber-600 uppercase tracking-widest leading-none mb-1">Lembrete Pastoral</p>
                          <p className="text-xs font-bold text-slate-800">Visita Pastoral: Ricardo Gomes (Amanhã)</p>
                        </div>
                      </div>
                      <Badge className="bg-amber-100 text-amber-700 border-none font-black text-[9px]">SINCRO</Badge>
                    </div>

                    {events.map((event) => (
                      <div key={event.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:border-primary/20 hover:bg-primary/5 transition-all group cursor-pointer">
                        <div className="w-16 h-16 bg-primary/10 rounded-xl flex flex-col items-center justify-center text-primary border border-primary/20 shadow-sm shrink-0">
                          <span className="text-[10px] font-bold uppercase tracking-tighter">
                            {event.date?.toDate ? event.date.toDate().toLocaleDateString(lang === 'pt' ? 'pt-MZ' : 'en-MZ', { month: 'short' }) : '...'}
                          </span>
                          <span className="text-xl font-black leading-none">
                            {event.date?.toDate ? event.date.toDate().getDate() : '??'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <Badge variant="outline" className="text-[9px] uppercase tracking-widest bg-white border-slate-200 shrink-0">{event.category}</Badge>
                            <h3 className="font-bold text-slate-800 group-hover:text-primary transition-colors truncate">{event.title}</h3>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-primary/60" />
                              {event.time}
                            </div>
                            <div className="flex items-center gap-1 truncate">
                              <MapPin className="w-3.5 h-3.5 text-primary/60" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-primary transition-transform group-hover:translate-x-1 shrink-0" />
                      </div>
                    ))}
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BellRing className="w-5 h-5 text-primary" />
                {t.automatedMessages}
              </CardTitle>
              <CardDescription>
                {lang === 'pt' ? 'Configure como os membros recebem lembretes de eventos.' : 'Configure how members receive event reminders.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="font-bold text-slate-800 mb-2">{lang === 'pt' ? 'Lembrete 24h Antes' : '24h Reminder'}</p>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary/10 text-primary border-none">WhatsApp</Badge>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <p className="font-bold text-slate-800 mb-2">{lang === 'pt' ? 'Lembrete 1h Antes' : '1h Reminder'}</p>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-primary/10 text-primary border-none">WhatsApp</Badge>
                    <Badge className="bg-primary/10 text-primary border-none">SMS</Badge>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full h-11 rounded-xl border-slate-200 hover:bg-slate-50">
                <Settings2 className="w-4 h-4 mr-2" />
                {lang === 'pt' ? 'Personalizar Mensagens de Lembrete' : 'Customize Reminder Messages'}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md overflow-hidden">
            <CardHeader className="bg-primary/5 border-b border-primary/10">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-primary" />
                {lang === 'pt' ? 'Calendário da Igreja' : 'Church Calendar'}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex justify-center p-4">
                <DayPicker 
                  mode="multiple"
                  selected={eventDays}
                  locale={locale}
                  className="border-none"
                  modifiersClassNames={{
                    selected: 'bg-primary text-white rounded-full font-bold'
                  }}
                />
              </div>
              <div className="p-4 bg-slate-50 border-t border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  {lang === 'pt' ? 'Legenda' : 'Legend'}
                </p>
                <div className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-3 h-3 bg-primary rounded-full"></div>
                  {lang === 'pt' ? 'Dias com Eventos' : 'Days with Events'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-primary to-primary/80 text-white border-none shadow-lg shadow-primary/20">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <div className="p-3 bg-white/20 rounded-2xl w-fit backdrop-blur-sm">
                  <CalendarIcon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl">
                    {lang === 'pt' ? 'Sincronizar Agenda' : 'Sync Schedule'}
                  </h3>
                  <p className="text-primary-foreground/80 text-sm leading-relaxed">
                    {lang === 'pt' ? 'Mantenha-se atualizado integrando o calendário da igreja com seu dispositivo pessoal.' : 'Stay updated by integrating the church calendar with your personal device.'}
                  </p>
                </div>
                <Button variant="secondary" className="w-full h-11 bg-white text-primary hover:bg-white/90 font-bold rounded-xl">
                  {lang === 'pt' ? 'Configurar Agora' : 'Set Up Now'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
