import { useState, useEffect } from 'react';
import { doc, onSnapshot, getDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { db, auth, handleFirestoreError, OperationType } from './lib/firebase';
import { sendNotification, subscribeToNotifications, markAsRead, Notification } from './services/notificationService';
import { 
  Users, 
  Wallet, 
  Calendar, 
  UserCheck, 
  MessageSquare, 
  BarChart3, 
  Settings, 
  LayoutDashboard,
  Bell,
  Search,
  LogOut,
  Menu,
  X,
  BookOpen,
  Globe,
  Home as HomeIcon,
  ShieldCheck,
  MoreVertical,
  Box,
  HeartHandshake,
  CreditCard,
  Plus,
  Rocket,
  Info,
  Languages,
  Loader2,
  CheckCircle2,
  QrCode,
  ScanLine
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { motion, AnimatePresence } from 'motion/react';
import { Badge } from '@/components/ui/badge';
import { translations, Language } from './translations';
import Logo from './components/Logo';

// Components
import Dashboard from './components/Dashboard';
import Members from './components/Members';
import Finance from './components/Finance';
import Events from './components/Events';
import Communication from './components/Communication';
import Chat from './components/Chat';
import Reports from './components/Reports';
import Secretary from './components/Secretary';
import Presence from './components/Presence';
import Inventory from './components/Inventory';
import Pastoral from './components/Pastoral';
import Payments from './components/Payments';
import About from './components/About';
import UserGuide from './components/UserGuide';
import Login from './components/Login';
import Onboarding from './components/Onboarding';
import SettingsModal from './components/SettingsModal';
import FinancialGuard from './components/FinancialGuard';

type UserRole = 'admin' | 'treasurer' | 'secretary' | 'leader' | 'collaborator';

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  roles: UserRole[];
}

export default function App() {
  const [user, setUser] = useState<any>({ uid: 'local-admin', displayName: 'Administrador Local', isMock: true });
  const [profile, setProfile] = useState<any>({ role: 'admin', onboardingComplete: true, isDev: false });
  const [authLoading, setAuthLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [lang, setLang] = useState<Language>('pt');
  const [activeTab, setActiveTab] = useState('home');
  const [userRole, setUserRole] = useState<UserRole>('admin');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [activeBranch, setActiveBranch] = useState('Sede Beira');
  const [logoUrl, setLogoUrl] = useState("/Logo.png");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [branches, setBranches] = useState([
    'Sede Beira',
    'Assembleia do Chimoio',
    'Assembleia da Cerâmica',
    'Assembleia de Jangamo',
    'Assembleia de Mascarenha',
    'Assembleia de Maputo',
    'Assembleia de Mobeira',
    'Assembleia de Muzimbite',
    'Assembleia de Ndunda',
    'Assembleia de Munhava Matope',
    'Assembleia de Muchatazina',
    'Assembleia de Munhava Central',
    'Assembleia de Madjemane',
    'Assembleia de Tete',
    'Assembleia de Dondo',
    'Assembleia do 3º Congresso',
    'Assembleia de Nacala Baixa',
    'Assembleia de Gorongosa',
    'Assembleia de Texmoque',
    'Assembleia de Muegane',
    'Assembleia de Ceta',
    'Assembleia de Nacala 25',
    'Assembleia de Natikiri',
    'Assembleia de Agostinho Neto',
    'Assembleia de Mafambisse'
  ]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    const checkStandalone = () => {
      const isS = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;
      setIsStandalone(isS);
      if (!isS) {
        setShowInstallPrompt(true);
      }
    };
    checkStandalone();

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    const handleTabChange = (e: any) => setActiveTab(e.detail);
    window.addEventListener('changeTab', handleTabChange);
    
    const handlePopState = () => {
      if (activeTab !== 'home') {
        setActiveTab('home');
        // Push state again to prevent going back to previous site immediately
        window.history.pushState(null, '', window.location.pathname);
      }
    };

    window.addEventListener('popstate', handlePopState);
    // Push an initial state
    window.history.pushState(null, '', window.location.pathname);

    const unsubscribeAuth = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setProfileLoading(true);
        setUser(authUser);
        try {
          const path = `users/${authUser.uid}`;
          const docRef = doc(db, 'users', authUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile(data);
            setUserRole(data.role as UserRole);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          const path = `users/${authUser.uid}`;
          handleFirestoreError(error, OperationType.GET, path);
        } finally {
          setProfileLoading(false);
          setAuthLoading(false);
        }
      } else {
        setAuthLoading(false);
      }
    });

    const unsubscribeNotif = subscribeToNotifications((data) => {
      setNotifications(data);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('changeTab', handleTabChange);
      window.removeEventListener('popstate', handlePopState);
      unsubscribeAuth();
      unsubscribeNotif();
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      if (lang === 'pt') {
        alert('Para instalar no iOS: Clique no ícone de compartilhar e depois em "Adicionar à Tela de Início".');
      } else {
        alert('To install on iOS: Click the share icon and then "Add to Home Screen".');
      }
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
      setIsStandalone(true);
      setShowInstallPrompt(false);
    }
    setDeferredPrompt(null);
  };

  useEffect(() => {
    // Listen for global church settings (like logo)
    const path = 'settings/church';
    const unsubscribe = onSnapshot(doc(db, 'settings', 'church'), (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        if (data.logoUrl) {
          setLogoUrl(data.logoUrl);
        }
      }
    }, (error) => {
      console.error("Settings listener failed:", error);
      handleFirestoreError(error, OperationType.GET, path);
    });

    return () => unsubscribe();
  }, []);

  const addBranch = () => {
    const name = prompt(lang === 'pt' ? 'Nome da Nova Filial:' : 'New Branch Name:');
    if (name && !branches.includes(name)) {
      setBranches(prev => [...prev, name]);
      setActiveBranch(name);
    }
  };

  const t = translations[lang];

  const menuItems: MenuItem[] = [
    { id: 'home', label: t.home, icon: HomeIcon, roles: ['admin', 'treasurer', 'secretary', 'leader', 'collaborator'] },
    { id: 'administracao', label: t.administration, icon: ShieldCheck, roles: ['admin'] },
    { id: 'membros', label: t.members, icon: Users, roles: ['admin', 'secretary', 'leader'] },
    { id: 'financeiro', label: t.finance, icon: Wallet, roles: ['admin', 'treasurer'] },
    { id: 'presenca', label: t.presence, icon: UserCheck, roles: ['admin', 'secretary', 'leader'] },
    { id: 'secretaria', label: t.secretary, icon: BookOpen, roles: ['admin', 'secretary'] },
    { id: 'patrimonio', label: t.inventory, icon: Box, roles: ['admin'] },
    { id: 'pastoral', label: t.pastoral, icon: HeartHandshake, roles: ['admin', 'leader'] },
    { id: 'pagamentos', label: t.donations, icon: CreditCard, roles: ['admin', 'treasurer'] },
    { id: 'eventos', label: t.events, icon: Calendar, roles: ['admin', 'secretary', 'leader', 'collaborator'] },
    { id: 'chat', label: t.chat, icon: MessageSquare, roles: ['admin', 'treasurer', 'secretary', 'leader', 'collaborator'] },
    { id: 'comunicacao', label: t.communication, icon: MessageSquare, roles: ['admin', 'secretary'] },
    { id: 'relatorios', label: t.reports, icon: BarChart3, roles: ['admin', 'treasurer', 'secretary', 'leader'] },
  ];

  const filteredMenuItems = (profile?.isDev || profile?.role === 'dev') 
    ? menuItems 
    : menuItems.filter(item => item.roles.includes(userRole));

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="py-8">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredMenuItems.filter(i => i.id !== 'home').map((item, idx) => (
              <motion.button
                key={item.id}
                whileHover={{ scale: 1.05, translateY: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(item.id)}
                className="flex flex-col items-center justify-center p-8 bg-white shadow-sm border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/10 transition-all group rounded-[32px]"
              >
                <div className={`w-16 h-16 rounded-3xl flex items-center justify-center mb-4 transition-all ${
                  idx % 2 === 0 ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white' : 'bg-secondary/10 text-secondary group-hover:bg-secondary group-hover:text-black'
                }`}>
                  <item.icon className="w-8 h-8" />
                </div>
                <span className="font-bold text-black text-center tracking-tight">{item.label}</span>
              </motion.button>
            ))}
            </div>
          </div>
        );
      case 'administracao': return <Dashboard lang={lang} userRole={userRole} activeBranch={activeBranch} />;
      case 'membros': return <Members lang={lang} activeBranch={activeBranch} />;
      case 'financeiro': return (
        <FinancialGuard lang={lang} isDev={profile?.isDev}>
          <Finance lang={lang} activeBranch={activeBranch} />
        </FinancialGuard>
      );
      case 'eventos': return <Events lang={lang} activeBranch={activeBranch} />;
      case 'comunicacao': return <Communication lang={lang} />;
      case 'chat': return <Chat lang={lang} user={user} />;
      case 'relatorios': return <Reports lang={lang} activeBranch={activeBranch} userRole={userRole} />;
      case 'secretaria': return <Secretary lang={lang} />;
      case 'presenca': return <Presence lang={lang} />;
      case 'patrimonio': return <Inventory lang={lang} />;
      case 'pastoral': return <Pastoral lang={lang} />;
      case 'pagamentos': return <Payments lang={lang} />;
      case 'sobre': return <About lang={lang} />;
      case 'guia': return <UserGuide lang={lang} />;
      default:
        return (
          <div className="flex flex-col items-center justify-center h-[60vh] text-muted-foreground">
            <div className="p-4 bg-slate-100 rounded-full mb-4">
              <Settings className="w-8 h-8 text-slate-400" />
            </div>
            <p className="text-xl font-medium">
              {lang === 'pt' ? `Módulo ${menuItems.find(i => i.id === activeTab)?.label} em desenvolvimento` : `${menuItems.find(i => i.id === activeTab)?.label} module under development`}
            </p>
            <p className="text-sm">
              {lang === 'pt' ? 'Estamos preparando as melhores ferramentas para sua gestão.' : 'We are preparing the best tools for your management.'}
            </p>
          </div>
        );
    }
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'pt' ? 'en' : 'pt');
  };

  if (!user && !authLoading) {
    return <Login onLogin={(u) => {
      setUser(u);
      setProfile({ role: u.role || 'admin', onboardingComplete: true, isDev: u.isDev });
      if (u.role) setUserRole(u.role as UserRole);
    }} lang={lang} />;
  }

  if (authLoading && !user) {
    return (
      <div className="min-h-screen bg-app-gradient-vibrant flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-gradient-vibrant flex flex-col lg:flex-row relative overflow-hidden">
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        user={user} 
        profile={profile} 
        lang={lang} 
      />
      {/* PWA Install Prompt */}
      <AnimatePresence>
        {showInstallPrompt && !isStandalone && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md bg-white rounded-[40px] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] border border-white/20 flex flex-col items-center text-center gap-6 relative overflow-hidden"
            >
              {/* Decorative background circle */}
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/5 rounded-full blur-3xl" />
              
              <button 
                onClick={() => setShowInstallPrompt(false)} 
                className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors z-10"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="p-4 bg-primary/10 rounded-3xl relative z-10">
                <Rocket className="w-12 h-12 text-primary animate-bounce shadow-sm" />
              </div>

              <div className="space-y-2 relative z-10">
                <h3 className="font-black text-2xl text-slate-900 leading-tight uppercase tracking-tight">
                  {lang === 'pt' ? 'App Oficial CNG' : 'CNG Official App'}
                </h3>
                <p className="font-bold text-slate-500 uppercase text-[10px] tracking-widest">
                  {lang === 'pt' ? 'Performance Máxima' : 'Maximum Performance'}
                </p>
                <p className="text-sm text-slate-600 font-medium leading-relaxed max-w-[280px] mx-auto">
                  {lang === 'pt' 
                    ? 'Instale para acesso instantâneo, notificações em tempo real e experiência em tela inteira.' 
                    : 'Install for instant access, real-time notifications, and full-screen experience.'}
                </p>
              </div>

              <div className="flex flex-col gap-3 w-full relative z-10">
                <Button 
                  onClick={handleInstallClick} 
                  className="w-full h-16 rounded-2xl font-black uppercase text-xs tracking-[0.2em] bg-primary shadow-xl shadow-primary/30 hover:scale-[1.02] transition-transform"
                >
                  {lang === 'pt' ? 'Instalar Agora' : 'Install Now'}
                </Button>
                <Button 
                  onClick={() => setShowInstallPrompt(false)} 
                  variant="ghost"
                  className="w-full h-12 rounded-xl font-bold uppercase text-[10px] tracking-widest text-slate-400"
                >
                  {lang === 'pt' ? 'Mais Tarde' : 'Later'}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Background Overlay for Softness */}
      <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px] pointer-events-none z-0"></div>
      
      {/* Background Logo */}
      <div className="fixed inset-0 pointer-events-none flex items-center justify-center opacity-[0.2] z-0">
        <Logo className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] opacity-20" size="xl" />
      </div>

      {/* Mobile Header */}
      <header className="lg:hidden h-20 bg-primary border-b-2 border-secondary/30 flex items-center justify-between px-4 sticky top-0 z-50 shadow-lg">
        <div 
          className="flex items-center gap-3 cursor-pointer shrink-0"
          onClick={() => {
            setActiveTab('home');
            setIsMobileMenuOpen(false);
          }}
        >
          <Logo size="md" />
          <div className="flex flex-col text-white">
            <span className="font-black text-xs leading-none uppercase tracking-tighter">CNG SOFTWARE</span>
            <span className="text-[10px] font-black uppercase mt-1 opacity-80">Soft Control</span>
          </div>
        </div>

        {/* Mobile Branch Selector Button */}
        <div className="flex-1 px-2 flex items-center justify-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-10 w-10 bg-white/10 text-white rounded-xl border border-white/20 hover:bg-white/20"
              >
                <Plus className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-64 rounded-[24px] shadow-2xl border-none p-2 mt-2 bg-white/95 backdrop-blur-md z-[100] max-h-[80vh] overflow-y-auto">
              <div className="px-3 py-2 border-b border-slate-100 mb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t.filiais}</p>
                <p className="text-xs font-black text-primary truncate uppercase">{activeBranch}</p>
              </div>
              {branches.map((b) => (
                <DropdownMenuItem 
                  key={b} 
                  onClick={() => setActiveBranch(b)}
                  className={`flex items-center gap-2 p-3 rounded-xl mb-1 cursor-pointer transition-all ${
                    activeBranch === b ? 'bg-primary/10 text-primary font-black' : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <Globe className="w-4 h-4" />
                  <span className="text-xs uppercase">{b}</span>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={addBranch}
                className="flex items-center gap-2 p-3 rounded-xl text-primary font-black hover:bg-primary/5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="text-xs uppercase">{lang === 'pt' ? 'Adicionar Filial' : 'Add Branch'}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {!isStandalone && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setShowInstallPrompt(true)}
              className="text-white hover:bg-white/10 rounded-full h-11 w-11"
              title={lang === 'pt' ? 'Instalar App' : 'Install App'}
            >
              <Rocket className="w-5 h-5 text-secondary animate-pulse" />
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleLanguage}
            className="text-white hover:bg-white/10 rounded-full h-11 w-11"
          >
            <Globe className="w-5 h-5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-white hover:bg-white/10 rounded-full h-11 w-11"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-white" />}
          </Button>
        </div>
      </header>

      {/* Sidebar (Desktop) */}
      <aside 
        className={`${isSidebarOpen ? 'w-80' : 'w-24'} bg-white/90 backdrop-blur-xl border-r border-slate-100 shadow-2xl transition-all duration-500 hidden lg:flex flex-col z-50 sticky top-0 h-screen rounded-r-[48px] m-4 mr-0`}
      >
        <div 
          className="p-10 flex items-center gap-4 overflow-hidden cursor-pointer group"
          onClick={() => setActiveTab('home')}
        >
          <Logo size="lg" />
          {isSidebarOpen && (
            <div className="flex flex-col truncate">
              <span className="font-black text-black leading-tight text-xl uppercase tracking-tighter">CNG SOFTWARE</span>
              <span className="text-[10px] text-primary font-black uppercase tracking-widest leading-none">Soft Control</span>
            </div>
          )}
        </div>

        <nav className="flex-1 px-6 space-y-2 mt-2 overflow-y-auto custom-scrollbar">
          {filteredMenuItems.filter(i => i.id !== 'home').map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all duration-300 group ${
                activeTab === item.id 
                  ? 'bg-transparent border border-primary/40 text-black shadow-none' 
                  : 'text-slate-500 hover:bg-primary/5 hover:text-black'
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 transition-transform ${activeTab === item.id ? '' : 'group-hover:scale-110'} ${activeTab === item.id ? 'text-primary' : 'text-primary'}`} />
              {isSidebarOpen && <span className={`font-black text-sm tracking-tight text-black`}>{item.label}</span>}
              {activeTab === item.id && isSidebarOpen && (
                <div className="ml-auto w-2.5 h-2.5 bg-secondary rounded-full shadow-[0_0_10px_gold]" />
              )}
            </button>
          ))}
        </nav>

        <div className="px-6 py-8 space-y-2 border-t border-slate-100">
          <button
            onClick={() => setActiveTab('guia')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all duration-300 group ${
              activeTab === 'guia' 
                ? 'bg-transparent border border-primary/40 text-black shadow-none' 
                : 'text-slate-500 hover:bg-primary/5 hover:text-black'
            }`}
          >
            <BookOpen className={`w-5 h-5 flex-shrink-0 transition-transform ${activeTab === 'guia' ? 'text-primary' : 'text-primary'} group-hover:scale-110`} />
            {isSidebarOpen && <span className={`font-black text-sm ${activeTab === 'guia' ? 'text-black' : 'text-black'}`}>{t.userGuide}</span>}
          </button>

          <button
            onClick={() => setActiveTab('sobre')}
            className={`w-full flex items-center gap-4 px-5 py-4 rounded-[24px] transition-all duration-300 group ${
              activeTab === 'sobre' 
                ? 'bg-transparent border border-primary/40 text-black shadow-none' 
                : 'text-slate-500 hover:bg-primary/5 hover:text-black'
            }`}
          >
            <Info className={`w-5 h-5 flex-shrink-0 transition-transform ${activeTab === 'sobre' ? 'text-primary' : 'text-primary'} group-hover:scale-110`} />
            {isSidebarOpen && <span className={`font-black text-sm ${activeTab === 'sobre' ? 'text-black' : 'text-black'}`}>{t.about}</span>}
          </button>
          
          <button 
            onClick={() => {
              // Sign out from firebase but keep local bypass
              signOut(auth).catch(() => {});
              window.location.reload(); 
            }}
            className="w-full flex items-center gap-4 px-5 py-4 text-rose-500 hover:bg-rose-50 rounded-[24px] transition-all group mt-2"
          >
            <LogOut className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
            {isSidebarOpen && <span className="font-black text-sm uppercase tracking-wider">{t.logout}</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            className="fixed inset-0 bg-white z-[60] lg:hidden flex flex-col"
          >
            <div className="p-4 flex items-center justify-between border-b border-primary/10 bg-white">
              <div 
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => {
                  setActiveTab('home');
                  setIsMobileMenuOpen(false);
                }}
              >
                <Logo size="md" />
                <div className="flex flex-col">
                  <span className="font-black text-black leading-none uppercase">CNG SOFTWARE</span>
                  <span className="text-[10px] text-primary font-black uppercase mt-1">Soft Control</span>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)} className="rounded-full text-black hover:bg-primary/5">
                <X className="w-6 h-6 text-primary" />
              </Button>
            </div>

            {/* Profile Section (Mobile Interface Fix) */}
            <div className="p-6 bg-slate-50/80 border-b border-primary/10">
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-2 border-white shadow-xl">
                  <AvatarImage src={user?.photoURL || ""} />
                  <AvatarFallback className="bg-secondary text-black font-black">{user?.displayName?.slice(0,2).toUpperCase() || 'US'}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <p className="font-black text-black text-lg leading-none mb-1">{user?.displayName || 'Usuário'}</p>
                  <Badge className="w-fit bg-primary text-white text-[10px] font-black uppercase tracking-widest px-2 py-0.5">
                    {t.niveis}: {userRole.toUpperCase()}
                  </Badge>
                </div>
              </div>
            </div>

            <nav className="flex-1 p-6 space-y-3 overflow-y-auto bg-white/50 backdrop-blur-md">
              {filteredMenuItems.filter(i => i.id !== 'home').map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                    activeTab === item.id 
                      ? 'bg-transparent border border-primary/40 text-black shadow-none' 
                      : 'text-black/70 hover:bg-white border border-transparent hover:border-primary/10'
                  }`}
                >
                  <item.icon className={`w-6 h-6 text-primary`} />
                  <span className="font-black uppercase text-sm tracking-wide">{item.label}</span>
                </button>
              ))}
            </nav>
            <div className="p-6 border-t border-primary/10 space-y-3 bg-white">
              <button
                onClick={() => {
                  setActiveTab('guia');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                  activeTab === 'guia' 
                    ? 'bg-transparent border border-primary/40 text-black shadow-none' 
                    : 'text-black/70 hover:bg-slate-50'
                }`}
              >
                <BookOpen className={`w-6 h-6 text-primary`} />
                <span className="font-black text-sm uppercase tracking-wide">{t.userGuide}</span>
              </button>

              <button
                onClick={() => {
                  setActiveTab('sobre');
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${
                  activeTab === 'sobre' 
                    ? 'bg-transparent border border-primary/40 text-black shadow-none' 
                    : 'text-black/70 hover:bg-slate-50'
                }`}
              >
                <Info className={`w-6 h-6 text-primary`} />
                <span className="font-black text-sm uppercase tracking-wide">{t.about}</span>
              </button>

              <button 
                onClick={() => {
                  signOut(auth).catch(() => {});
                  window.location.reload();
                }}
                className="w-full flex items-center gap-4 px-5 py-4 text-rose-600 hover:bg-rose-50 rounded-2xl transition-all border border-rose-100"
              >
                <LogOut className="w-6 h-6" />
                <span className="font-black text-sm uppercase tracking-wide">{t.logout}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 relative z-10 px-4">
        {/* Header (Desktop) */}
        <header className="h-24 bg-primary/95 backdrop-blur-md border-b-2 border-secondary/30 hidden lg:flex items-center justify-between px-10 sticky top-4 z-40 shadow-2xl rounded-[32px] mx-4">
          <div className="flex items-center gap-6">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-white hover:bg-white/10 rounded-2xl transition-all h-12 w-12"
            >
              <Menu className="w-6 h-6 text-white" />
            </Button>
            <div className="h-8 w-px bg-white/20 mx-1"></div>
            
            {/* Branch Switcher */}
            <div className="flex items-center gap-2 bg-white/10 pr-2 py-2 rounded-[20px] border border-white/20 shadow-inner backdrop-blur-sm">
              <div className="flex flex-col px-4 text-white">
                <span className="text-[9px] font-black text-white/60 tracking-widest leading-none mb-1 uppercase">{t.branches}</span>
                <select 
                  value={activeBranch} 
                  onChange={(e) => setActiveBranch(e.target.value)}
                  className="bg-transparent text-xs font-black outline-none cursor-pointer uppercase text-white"
                >
                  {branches.map(b => (
                    <option key={b} value={b} className="text-black">
                      {b}
                    </option>
                  ))}
                </select>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-9 w-9 rounded-xl hover:bg-white/20 text-white shadow-sm"
                onClick={addBranch}
              >
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="h-8 w-px bg-white/20 mx-1"></div>
            <div className="flex flex-col">
              <h1 className="text-xl font-black text-white leading-none tracking-tighter uppercase">
                CNG SOFTWARE
              </h1>
              <span className="text-[10px] font-black text-white/60 mt-1 uppercase tracking-widest leading-none">
                {menuItems.find(i => i.id === activeTab)?.label}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {!isStandalone && (
              <Button 
                variant="ghost" 
                onClick={() => setShowInstallPrompt(true)}
                className="hidden xl:flex items-center gap-2 text-white hover:bg-white/10 rounded-2xl h-12 px-4 border border-secondary/30 bg-secondary/5"
              >
                <Rocket className="w-5 h-5 text-secondary animate-bounce" />
                <span className="text-[10px] font-black uppercase tracking-widest">{lang === 'pt' ? 'Instalar App' : 'Install App'}</span>
              </Button>
            )}
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white hover:bg-white/10 rounded-2xl h-12 w-12 border border-white/10 backdrop-blur-sm hidden xl:flex"
            >
              <Search className="w-6 h-6 text-white" />
            </Button>
            
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsSettingsOpen(true)}
                className="rounded-2xl hover:bg-white/10 text-white h-12 w-12 border border-white/10 backdrop-blur-sm"
              >
                <Settings className="w-5 h-5" />
              </Button>
              <Button variant="ghost" onClick={toggleLanguage} className="rounded-2xl hover:bg-white/10 text-white flex items-center gap-2 h-12 px-4 border border-white/10 backdrop-blur-sm">
                <Globe className="w-5 h-5" />
                <span className="text-xs font-black tracking-widest">{lang.toUpperCase()}</span>
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white relative hover:bg-white/10 rounded-2xl h-12 w-12 border border-white/10 backdrop-blur-sm">
                    <Bell className="w-6 h-6 text-white" />
                    {notifications.filter(n => !n.read).length > 0 && (
                      <span className="absolute top-3 right-3 w-3 h-3 bg-rose-600 rounded-full border-2 border-primary animate-bounce"></span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-96 rounded-[32px] shadow-2xl border-none p-4 mt-2 bg-white/95 backdrop-blur-md z-[100]">
                  <div className="px-2 py-2 flex items-center justify-between mb-2">
                    <p className="text-sm font-black text-black tracking-tight">{lang === 'pt' ? 'Centro de Notificações' : 'Notification Center'}</p>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-none font-black text-[10px] rounded-sm px-3">
                      {notifications.filter(n => !n.read).length} NOVAS
                    </Badge>
                  </div>
                  <div className="max-h-[450px] overflow-y-auto pr-1">
                    {notifications.length === 0 ? (
                      <div className="py-12 text-center">
                        <Bell className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Sem novas atualizações</p>
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <DropdownMenuItem 
                          key={notif.id} 
                          onClick={() => notif.id && markAsRead(notif.id)}
                          className={`flex flex-col items-start gap-2 p-5 rounded-3xl mb-2 cursor-pointer transition-all border outline-none ${
                            notif.read ? 'bg-slate-50/50 border-transparent opacity-60' : 'bg-primary/5 border-primary/10 hover:bg-primary/10'
                          }`}
                        >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary underline underline-offset-4">
                              {notif.type}
                            </span>
                            {!notif.read && <div className="w-2.5 h-2.5 bg-secondary rounded-full shadow-[0_0_8px_gold]" />}
                          </div>
                          <p className="text-sm font-black text-black leading-tight">{notif.title}</p>
                          <p className="text-[11px] text-black/70 leading-relaxed font-medium">{notif.message}</p>
                        </DropdownMenuItem>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-4 pl-6 border-l border-white/20">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-white tracking-tight leading-none mb-1">{user?.displayName || 'Usuário'}</p>
                <span className="text-[10px] text-white/60 font-black uppercase tracking-[0.2em]">{userRole.toUpperCase()}</span>
              </div>
              <Avatar className="h-12 w-12 border-2 border-white shadow-xl">
                <AvatarImage src={user?.photoURL || ""} />
                <AvatarFallback className="bg-secondary text-black font-black">
                  {user?.displayName?.slice(0,2).toUpperCase() || 'US'}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 lg:p-8 max-w-7xl mx-auto w-full flex-1 pb-16 pt-24">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="h-full"
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer */}
        <footer className="py-4 text-center z-20">
          <a 
            href="https://wa.me/258827043290" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-[10px] text-black/40 hover:text-primary transition-colors font-medium uppercase tracking-widest"
          >
            Desenvolvido pela: <span className="font-bold">9TECH</span>
          </a>
        </footer>
      </main>
    </div>
  );
}
