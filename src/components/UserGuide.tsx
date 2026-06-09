import { translations, Language } from '../translations';
import { 
  BookOpen, 
  Users, 
  Wallet, 
  ShieldCheck, 
  UserCheck, 
  Box, 
  HeartHandshake, 
  CreditCard, 
  Calendar, 
  MessageSquare, 
  BarChart3,
  ChevronRight,
  Plus,
  Globe,
  Settings,
  LogOut
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface UserGuideProps {
  lang: Language;
}

export default function UserGuide({ lang }: UserGuideProps) {
  const t = translations[lang];

  const sections = [
    {
      title: lang === 'pt' ? '1. Introdução e Acesso' : '1. Introduction and Access',
      icon: ShieldCheck,
      content: [
        {
          sub: lang === 'pt' ? 'Sistema Multi-Papel' : 'Multi-Role System',
          desc: lang === 'pt' 
            ? 'O software utiliza Controle de Acesso Baseado em Cargas (RBAC). Dependendo do seu cargo (Admin, Tesoureiro, Secretário ou Líder), certas abas estarão ocultas ou visíveis.' 
            : 'The software uses Role-Based Access Control (RBAC). Depending on your role (Admin, Treasurer, Secretary, or Leader), certain tabs will be hidden or visible.'
        },
        {
          sub: lang === 'pt' ? 'Gestão de Filiais' : 'Branch Management',
          desc: lang === 'pt' 
            ? 'No cabeçalho, pode trocar entre a Sede Beira e outras filiais. Use o botão "+" para adicionar novas extensões da igreja.' 
            : 'In the header, you can switch between Sede Beira and other branches. Use the "+" button to add new church extensions.'
        }
      ]
    },
    {
      title: lang === 'pt' ? '2. Módulos de Gestão' : '2. Management Modules',
      icon: BookOpen,
      content: [
        {
          icon: Users,
          sub: t.members,
          desc: lang === 'pt' 
            ? 'Registo completo de membros, incluindo dados pessoais, contactos, morada e data de aniversário para sincronização automática com o módulo de Comunicação.' 
            : 'Complete member registration, including personal data, contacts, address, and birthday for automatic synchronization with the Communication module.'
        },
        {
          icon: Wallet,
          sub: t.finance,
          desc: lang === 'pt' 
            ? 'Controle de entradas e saídas. Visualização de fluxo de caixa e crescimento financeiro mensal.' 
            : 'Control of income and expenses. Visualization of cash flow and monthly financial growth.'
        },
        {
          icon: UserCheck,
          sub: t.presence,
          desc: lang === 'pt' 
            ? 'Registro de presença em cultos e eventos. Essencial para gerar estatísticas de fidelidade dos membros.' 
            : 'Attendance registration for services and events. Essential for generating member loyalty statistics.'
        },
        {
          icon: Box,
          sub: t.inventory,
          desc: lang === 'pt' 
            ? 'Gestão de todos os bens da igreja (instrumentos, mobiliário, imóveis), com registro de estado e localização.' 
            : 'Management of all church assets (instruments, furniture, real estate), with status and location records.'
        }
      ]
    },
    {
      title: lang === 'pt' ? '3. Comunicação e CRM' : '3. Communication and CRM',
      icon: MessageSquare,
      content: [
        {
          sub: t.communication,
          desc: lang === 'pt' 
            ? 'Envio de mensagens em massa (WhatsApp, SMS). Automatização de parabéns aos aniversariantes do dia e lembretes de eventos.' 
            : 'Bulk messaging (WhatsApp, SMS). Automation of birthday greetings and event reminders.'
        },
        {
          sub: t.chat,
          desc: lang === 'pt' 
            ? 'Canal de interação interna para comunicação rápida entre líderes e departamentos.' 
            : 'Internal interaction channel for quick communication between leaders and departments.'
        }
      ]
    },
    {
      title: lang === 'pt' ? '4. Relatórios e Secretaria' : '4. Reports and Secretary',
      icon: BarChart3,
      content: [
        {
          sub: t.reports,
          desc: lang === 'pt' 
            ? 'Exportação de dados em PDF ou Excel. Gráficos de crescimento e mapas financeiros detalhados.' 
            : 'Data export in PDF or Excel. Growth charts and detailed financial maps.'
        },
        {
          sub: t.secretary,
          desc: lang === 'pt' 
            ? 'Arquivo digital de atas de reuniões, documentos oficiais e registros históricos da congregação.' 
            : 'Digital archive of meeting minutes, official documents, and historical records of the congregation.'
        }
      ]
    }
  ];

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-widest"
        >
          <BookOpen className="w-4 h-4" />
          {t.userGuide}
        </motion.div>
        <h1 className="text-4xl font-black text-slate-800 tracking-tight">
          {lang === 'pt' ? 'Domine o Sistema CNG' : 'Master the CNG System'}
        </h1>
        <p className="text-slate-500 max-w-2xl mx-auto font-medium">
          {lang === 'pt' 
            ? 'Guia completo para aproveitar todas as ferramentas de gestão inteligente da sua igreja.' 
            : 'Complete guide to taking advantage of all your church\'s smart management tools.'}
        </p>
      </div>

      {/* Grid of Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {sections.map((section, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <Card className="h-full border-none shadow-xl shadow-slate-200/50 bg-white/80 backdrop-blur-md overflow-hidden rounded-[32px]">
              <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-white rounded-2xl shadow-sm text-primary">
                    <section.icon className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-xl font-bold text-slate-800">{section.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-8 space-y-6">
                {section.content.map((item, iIdx) => (
                  <div key={iIdx} className="space-y-2 group">
                    <div className="flex items-center gap-2">
                      {item.icon && <item.icon className="w-4 h-4 text-primary" />}
                      <h4 className="font-bold text-slate-700 group-hover:text-primary transition-colors flex items-center gap-2">
                        <ChevronRight className="w-3 h-3" />
                        {item.sub}
                      </h4>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed pl-5 border-l-2 border-slate-100 group-hover:border-primary/30 transition-colors">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Tips Footer */}
      <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <Rocket className="w-48 h-48" />
        </div>
        <div className="relative z-10 space-y-6">
          <h2 className="text-3xl font-black">
            {lang === 'pt' ? 'Dicas de Eficiência' : 'Efficiency Tips'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="space-y-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Plus className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-300">
                {lang === 'pt' ? 'Use o botão de adição rápida em cada módulo para poupar tempo.' : 'Use the quick addition button in each module to save time.'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Globe className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-300">
                {lang === 'pt' ? 'O sistema é bilíngue; pode alternar entre PT e EN no cabeçalho.' : 'The system is bilingual; you can switch between PT and EN in the header.'}
              </p>
            </div>
            <div className="space-y-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <p className="text-sm font-medium text-slate-300">
                {lang === 'pt' ? 'Configure as notificações no ícone de sino para alertas em tempo real.' : 'Set up notifications in the bell icon for real-time alerts.'}
              </p>
            </div>
          </div>
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold">{lang === 'pt' ? 'Suporte Técnico' : 'Technical Support'}</p>
                <p className="text-xs text-slate-400">9TECH SOLUTIONS - +258 82 704 3290</p>
              </div>
            </div>
            <button 
              onClick={() => window.print()}
              className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold text-sm hover:bg-slate-200 transition-colors flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              {lang === 'pt' ? 'Imprimir Guia (PDF)' : 'Print Guide (PDF)'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const Rocket = ({ className }: { className?: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    <path d="M9 12H4s.55-3.03 2-5c1.62-2.2 5-3 5-3" />
    <path d="M12 15v5s3.03-.55 5-2c2.2-1.62 3-5 3-5" />
  </svg>
);
