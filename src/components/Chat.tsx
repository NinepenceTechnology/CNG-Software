import { useState, useEffect, useRef } from 'react';
import { Send, Hash, Loader2, Video, Phone, X, MessageSquare } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { translations, Language } from '@/src/translations';
import { db, handleFirestoreError, OperationType } from '@/src/lib/firebase';
import { 
  collection, 
  query, 
  orderBy, 
  limit, 
  onSnapshot, 
  addDoc, 
  serverTimestamp 
} from 'firebase/firestore';

interface Message {
  id: string;
  user: string;
  text: string;
  timestamp: any;
  avatar?: string;
  userId?: string;
}

interface ChatProps {
  lang: Language;
  user?: any;
}

export default function Chat({ lang, user }: ChatProps) {
  const t = translations[lang];
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [activeChannel, setActiveChannel] = useState('Geral');
  const [connected, setConnected] = useState(true); // Always true because Firestore works online and offline perfectly
  const [isVideoActive, setIsVideoActive] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Membro';
  const userId = user?.uid || 'guest';
  const userAvatar = user?.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userId}`;

  // Channels list
  const channels = ['Geral', 'Liderança', 'Louvor', 'Jovens'];

  // Subscribe to real-time messages in the active channel inside Firestore
  useEffect(() => {
    // Reference: chat_channels/{channelName}/messages
    const path = `chat_channels/${activeChannel}/messages`;
    const messagesRef = collection(db, 'chat_channels', activeChannel, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'), limit(100));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        let timestampStr = new Date().toISOString();
        if (data.timestamp) {
          // Guard for firestore serverTimestamp
          timestampStr = data.timestamp.toDate ? data.timestamp.toDate().toISOString() : new Date(data.timestamp).toISOString();
        }
        msgs.push({
          id: doc.id,
          user: data.user || 'Anônimo',
          text: data.text || '',
          timestamp: timestampStr,
          avatar: data.avatar || '',
          userId: data.userId || ''
        });
      });
      setMessages(msgs);
    }, (error) => {
      console.error("Firestore chat subscripton error:", error);
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => {
      unsubscribe();
    };
  }, [activeChannel]);

  // Auto-scroll to latest messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const textToSend = inputValue;
    setInputValue(''); // Clear immediately for snappy UI

    const path = `chat_channels/${activeChannel}/messages`;
    try {
      const messagesRef = collection(db, 'chat_channels', activeChannel, 'messages');
      await addDoc(messagesRef, {
        user: displayName,
        userId: userId,
        text: textToSend,
        avatar: userAvatar,
        timestamp: serverTimestamp()
      });
    } catch (error) {
      console.error("Failed to send message:", error);
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.chatManagement}</h2>
          <p className="text-slate-500 text-xs sm:text-sm">
            {lang === 'pt' ? 'Comunique-se de verdade, online e offline, protegendo todas as conversas.' : 'Communicate for real, online and offline, keeping all conversations safe.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant={isVideoActive ? "destructive" : "outline"} 
            size="sm" 
            onClick={() => setIsVideoActive(!isVideoActive)}
            className="rounded-xl border-slate-200 hover:bg-rose-50 hover:text-rose-600 transition-all font-bold"
          >
            {isVideoActive ? <X className="w-4 h-4 mr-2" /> : <Video className="w-4 h-4 mr-2" />}
            {isVideoActive ? (lang === 'pt' ? 'Encerrar Video' : 'End Video') : (lang === 'pt' ? 'Video Conferência' : 'Video Conference')}
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 min-h-0">
        {/* Channels Column */}
        <Card className="lg:col-span-1 border-none shadow-sm bg-white/60 backdrop-blur-md hidden lg:flex flex-col">
          <CardHeader>
            <CardTitle className="text-lg font-bold flex items-center gap-2 text-slate-800">
              <Hash className="w-5 h-5 text-primary" />
              {lang === 'pt' ? 'Canais Real' : 'Real Channels'}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto space-y-2">
            {channels.map((channel) => (
              <button
                key={channel}
                onClick={() => {
                  setActiveChannel(channel);
                  setIsVideoActive(false); // Reset video chat when switching channels
                }}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all font-bold flex items-center gap-2 ${
                  channel === activeChannel 
                    ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                    : 'text-slate-600 hover:bg-white hover:text-slate-800'
                }`}
              >
                <Hash className="w-4 h-4 shrink-0" />
                <span># {channel}</span>
              </button>
            ))}
          </CardContent>
        </Card>

        {/* Main Chat Area */}
        <Card className="lg:col-span-3 border-none shadow-sm bg-white/60 backdrop-blur-md flex flex-col overflow-hidden">
          {isVideoActive ? (
            <div className="flex-1 bg-slate-900 relative flex flex-col h-full">
              <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                <Badge className="bg-primary hover:bg-primary text-white font-bold px-3 py-1 shadow-md">
                  VÍDEO CONFERÊNCIA: #{activeChannel.toUpperCase()}
                </Badge>
                <Badge variant="outline" className="text-white border-white/25 bg-black/40 backdrop-blur-md font-bold text-[10px] hidden sm:inline-flex">
                  LIVRE • QUALQUER UM PODE ENTRAR
                </Badge>
              </div>
              <iframe 
                src={`https://meet.jit.si/CNG_SharedVideoChat_${activeChannel}#userInfo.displayName="${displayName}"&config.prejoinPageEnabled=false&config.p2p.enabled=false&interfaceConfig.TOOLBAR_BUTTONS=["microphone","camera","chat","tileview","hangup"]`}
                allow="camera; microphone; fullscreen; display-capture"
                className="w-full h-full border-none flex-1 mt-0"
              ></iframe>
            </div>
          ) : (
            <>
              <CardHeader className="border-b border-slate-100 bg-white/40">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                      <Hash className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                      <CardTitle className="text-lg font-bold text-slate-800">
                        #{activeChannel}
                      </CardTitle>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                        <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                          {lang === 'pt' ? 'Seguro & Persistido' : 'Secure & Persisted'}
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Small screens channel pill */}
                  <div className="lg:hidden">
                    <select
                      value={activeChannel}
                      onChange={(e) => setActiveChannel(e.target.value)}
                      className="text-xs font-black bg-white select-none border border-slate-200 text-slate-700 h-9 px-3 rounded-xl outline-none"
                    >
                      {channels.map(ch => (
                        <option key={ch} value={ch}># {ch}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-hidden flex flex-col p-0 bg-slate-50/50">
                <div 
                  ref={scrollRef}
                  className="flex-1 overflow-y-auto p-6 space-y-6"
                >
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4 max-w-sm mx-auto text-center py-12">
                      <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center opacity-70 border border-slate-200 shadow-inner">
                        <MessageSquare className="w-10 h-10 text-primary" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">{lang === 'pt' ? 'Sem conversas anteriores' : 'No previous conversations'}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          {lang === 'pt' 
                            ? `Envie a primeira mensagem persistente no canal #${activeChannel}!` 
                            : `Send the first persistent message on #${activeChannel} channel!`}
                        </p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div key={msg.id} className={`flex gap-4 ${msg.userId === userId ? 'flex-row-reverse' : ''}`}>
                        <Avatar className="h-10 w-10 border-2 border-white shadow-sm shrink-0">
                          <AvatarImage src={msg.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${msg.user}`} referrerPolicy="no-referrer" />
                          <AvatarFallback className="font-bold bg-slate-200 text-slate-700">{msg.user.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className={`flex flex-col max-w-[75%] ${msg.userId === userId ? 'items-end' : ''}`}>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-slate-800">{msg.user}</span>
                            <span className="text-[10px] text-slate-400">
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className={`p-4 rounded-2xl shadow-sm relative group/msg ${
                            msg.userId === userId 
                              ? 'bg-primary text-white rounded-tr-none' 
                              : 'bg-white text-slate-700 rounded-tl-none border border-slate-100'
                          }`}>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap breakdown-words">{msg.text}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-4 bg-white/80 border-t border-slate-100">
                  <div className="flex gap-2">
                    <Input 
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder={lang === 'pt' ? `Enviar mensagem em #${activeChannel}...` : `Send message in #${activeChannel}...`}
                      className="bg-white border-none rounded-xl h-12 shadow-sm px-6 font-medium text-slate-800 focus-visible:ring-primary/20"
                      disabled={!connected}
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={!inputValue.trim() || !connected}
                      className="h-12 w-12 rounded-xl bg-primary hover:bg-primary/95 shadow-lg shadow-primary/20 shrink-0"
                    >
                      <Send className="w-5 h-5 text-white" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
