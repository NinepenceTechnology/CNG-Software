import { Language } from '../translations';
import { 
  History, 
  Users, 
  Award, 
  Heart, 
  ShieldCheck, 
  Sun, 
  Cross, 
  Compass, 
  BookOpen,
  Anchor,
  Star,
  MapPin,
  Calendar
} from 'lucide-react';
import { motion } from 'motion/react';

interface AboutProps {
  lang: Language;
}

export default function About({ lang }: AboutProps) {
  const isPt = lang === 'pt';

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-5xl mx-auto space-y-24 py-12 px-4"
    >
      {/* Hero Section */}
      <section className="text-center space-y-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-block"
        >
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <div className="relative w-32 h-32 bg-white rounded-full shadow-xl flex items-center justify-center p-4 border border-slate-100">
             <Sun className="w-20 h-20 text-orange-500 animate-pulse" />
          </div>
        </motion.div>
        
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Igreja Centro da <br/>
            <span className="text-primary">Nova Geração</span> Internacional
          </h1>
          <p className="text-xl md:text-2xl font-serif italic text-slate-500 max-w-3xl mx-auto">
            "Tocando vidas, mudando vidas e marcando um impacto que dura..."
          </p>
        </div>
      </section>

      {/* Origin & Foundation */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <motion.div variants={itemVariants} className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold uppercase tracking-wider">
            <History className="w-4 h-4" />
            {isPt ? 'Nossa Fundação' : 'Our Foundation'}
          </div>
          <h2 className="text-3xl font-bold text-slate-800 leading-tight">
            {isPt 
              ? 'Um Início Gravado na Perfeição do Sete' 
              : 'A Beginning Marked by Spiritual Perfection'}
          </h2>
          <div className="prose prose-slate prose-lg text-slate-600 font-medium leading-relaxed">
            <p>
              {isPt 
                ? 'Fundada em 26 de março de 2006 pelo Apóstolo Jonas F. Quembo e sua esposa Pastora Deborah Quembo. O primeiro culto oficial contou com precisamente sete pessoas — o número da perfeição espiritual.'
                : 'Founded on March 26, 2006, by Apostle Jonas F. Quembo and his wife Pastor Deborah Quembo. The first official service had exactly seven people — the number of spiritual perfection.'}
            </p>
            <p>
              {isPt
                ? 'A visão surgiu após encontros de oração e um chamado profundo recebido pelo Apóstolo ainda na sua juventude, consolidando uma missão de servir a Deus na sua própria geração.'
                : 'The vision emerged after prayer meetings and a profound calling received by the Apostle in his youth, consolidating a mission to serve God in his own generation.'}
            </p>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants} className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-tr from-primary to-orange-400 rounded-3xl opacity-10 group-hover:opacity-20 transition-opacity" />
          <div className="relative aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-white shadow-2xl flex items-center justify-center p-12 text-center">
            <div className="space-y-4">
              <Users className="w-16 h-16 text-primary mx-auto opacity-50" />
              <p className="font-serif text-2xl text-slate-700 italic">"Pois David serviu ao propósito de Deus na sua geração"</p>
              <p className="font-bold text-primary">— Atos 13:36</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* 8 Phases Timeline */}
      <section className="space-y-12">
        <h2 className="text-center text-3xl font-bold text-slate-900">{isPt ? 'Nossa Trajetória' : 'Our Journey'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { phase: '1ª', title: isPt ? 'JOCUM & Casa-Reon' : 'JOCUM & Casa-Reon', year: '2006', desc: isPt ? 'O início nas casas e no centro da cidade.' : 'Start in homes and city center.' },
            { phase: '2ª', title: isPt ? 'Instituto de Línguas' : 'Language Institute', year: '2007', desc: isPt ? 'Cultos num ginásio reabilitado com fé.' : 'Services in a gym restored with faith.' },
            { phase: '3ª', title: isPt ? 'Cinema Olímpia' : 'Olympia Cinema', year: '2008', desc: isPt ? 'Fase de luta e persistência nas escadas.' : 'Phase of struggle and persistence.' },
            { phase: '4ª', title: isPt ? 'ADI Ponta-Gêa' : 'ADI Ponta-Gêa', year: '2010', desc: isPt ? 'Apoio e acolhimento de igrejas parceiras.' : 'Support from partner churches.' },
            { phase: '5ª', title: isPt ? 'Tenda MorLuz' : 'MorLuz Tent', year: '2011', desc: isPt ? 'Criação da Academia da Nova Geração.' : 'Creation of New Generation Academy.' },
            { phase: '6ª', title: isPt ? 'Bairro do Goto' : 'Goto Neighborhood', year: '2015', desc: isPt ? 'Crescimento rápido e tenda pequena.' : 'Rapid growth and small tent.' },
            { phase: '7ª', title: isPt ? 'Auditório Municipal' : 'Municipal Auditorium', year: '2018', desc: isPt ? 'Novocine: Consagração e expansão.' : 'Consecration and expansion.' },
            { phase: '8ª', title: isPt ? 'Edifício Próprio' : 'Own Building', year: '2020+', desc: isPt ? 'Reconstrução pós-IDAI e templo atual.' : 'Post-IDAI reconstruction.' },
          ].map((item, id) => (
            <motion.div 
              key={id}
              variants={itemVariants} 
              className="p-6 transition-all hover:bg-white hover:shadow-lg rounded-2xl border border-transparent hover:border-slate-100 flex flex-col items-center text-center space-y-3"
            >
              <span className="text-xs font-black text-primary/50 uppercase tracking-widest">{item.phase} Fase</span>
              <h3 className="font-bold text-slate-800">{item.title}</h3>
              <p className="text-xs text-slate-400 font-bold">{item.year}</p>
              <p className="text-sm text-slate-500 font-medium leading-tight">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Core Values (Cultures) */}
      <section className="bg-slate-900 rounded-[48px] p-8 md:p-16 text-white space-y-16">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Nossa Cultura e Valores</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">Fundamentados em princípios que guiam nossa fé e conduta diária.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              icon: ShieldCheck, 
              title: isPt ? 'Honra' : 'Honor', 
              desc: isPt ? 'Homenagear qualidades, valorizar e ser leal a Deus, líderes e pais.' : 'Honoring God, leaders, and parents.' 
            },
            { 
              icon: Heart, 
              title: isPt ? 'Amor Incondicional' : 'Unconditional Love', 
              desc: isPt ? 'Amor pleno, generoso e altruísta, sem esperar nada em troca.' : 'Selfless love, expecting nothing in return.' 
            },
            { 
              icon: Award, 
              title: isPt ? 'Excelência' : 'Excellence', 
              desc: isPt ? 'Deus está nos detalhes. Fazer tudo da melhor forma para Sua glória.' : 'God is in the details. Best for His glory.' 
            },
            { 
              icon: Users, 
              title: isPt ? 'Servir' : 'Serving', 
              desc: isPt ? 'A nossa posição: Jesus não veio para ser servido, mas para servir.' : 'Not to be served, but to serve.' 
            },
            { 
              icon: Star, 
              title: isPt ? 'Generosidade' : 'Generosity', 
              desc: isPt ? 'Sinal de prioridades certas: dar dízimos, ofertas e sacrifícios.' : 'Tithing, offerings, and sacrifices.' 
            }
          ].map((item, i) => (
            <div key={i} className="space-y-4 p-8 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/10 transition-colors">
              <item.icon className="w-10 h-10 text-primary" />
              <h3 className="text-xl font-bold">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Logo Meaning */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { icon: Sun, title: 'Sol', desc: isPt ? 'Nova geração, renascer, novo dia e nova era.' : 'New generation, rebirth, new day.' },
          { icon: Cross, title: 'Cruz', desc: isPt ? 'Sacrifício de Jesus, perdão, salvação e mortificação da carne.' : 'Jesus sacrifice, salvation.' },
          { icon: Compass, title: 'Águia', desc: isPt ? 'Visão profética, dons espirituais e o sobrenatural de Deus.' : 'Prophetic vision, supernatural.' },
        ].map((item, i) => (
          <motion.div 
            key={i} 
            variants={itemVariants}
            className="group p-8 text-center space-y-4 bg-slate-50 rounded-3xl border border-slate-100 hover:border-primary/20 transition-all"
          >
            <item.icon className="w-12 h-12 text-primary mx-auto group-hover:scale-110 transition-transform" />
            <h3 className="text-xl font-black text-slate-800 uppercase tracking-tighter">{item.title}</h3>
            <p className="text-sm text-slate-500 font-medium leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Apostle Bio */}
      <section className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col md:row-reverse md:flex-row">
        <div className="md:w-1/3 bg-slate-50 flex items-center justify-center p-12">
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-0 group-hover:scale-110 transition-transform" />
            <motion.div className="w-48 h-48 bg-white rounded-full shadow-inner border border-slate-200 flex items-center justify-center relative">
               <span className="text-6xl font-black text-primary/20">AFQ</span>
            </motion.div>
          </div>
        </div>
        
        <div className="md:w-2/3 p-12 md:p-16 space-y-8">
          <div className="space-y-2">
            <span className="text-primary font-bold uppercase tracking-widest text-xs">Visão Celestial</span>
            <h2 className="text-4xl font-black text-slate-900 leading-tight">Apóstolo Jonas F. Quembo</h2>
            <p className="text-slate-500 font-serif italic">Nascido em 1981, na Beira. Fundou a ICNG com uma visão genuína.</p>
          </div>
          
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div className="space-y-1">
              <p className="text-slate-400 font-bold uppercase text-[10px]">Chamado</p>
              <p className="text-slate-700 font-medium">Iniciou aos 13 anos. Consagrado Apóstolo pelo Ap. Lázaro.</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-bold uppercase text-[10px]">Educação</p>
              <p className="text-slate-700 font-medium">Mestrado em Ciências Políticas. Intérprete NATO.</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-bold uppercase text-[10px]">Família</p>
              <p className="text-slate-700 font-medium">Casado com a Pa. Deborah Quembo. Pai de Jireldo Fortuna.</p>
            </div>
            <div className="space-y-1">
              <p className="text-slate-400 font-bold uppercase text-[10px]">Legado</p>
              <p className="text-slate-700 font-medium">Fundador da Academia Teológica de Moçambique.</p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate-100 flex gap-4">
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-slate-600 text-xs font-bold">
               <MapPin className="w-3 h-3" /> Beira, Moçambique
             </div>
             <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-lg text-slate-600 text-xs font-bold">
               <Calendar className="w-3 h-3" /> Est. 2006
             </div>
          </div>
        </div>
      </section>

      {/* Faith & Mission */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <motion.div variants={itemVariants} className="p-10 bg-primary/5 rounded-[40px] space-y-6">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary">
            <BookOpen className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Declaração de Fé</h3>
          <ul className="space-y-3 text-slate-600 font-medium text-sm">
            <li>• Cremos num único Deus (Pai, Filho e Espírito Santo).</li>
            <li>• Cremos na Bíblia como inspirada e infalível.</li>
            <li>• Cremos no batismo do Espírito Santo e dons espirituais.</li>
            <li>• Cremos que a igreja é uma família e a família é projeto de Deus.</li>
          </ul>
        </motion.div>

        <motion.div variants={itemVariants} className="p-10 bg-orange-50 rounded-[40px] space-y-6">
          <div className="w-12 h-12 bg-white rounded-2xl shadow-sm flex items-center justify-center text-orange-500">
            <Anchor className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-slate-800">Nossa Filosofia</h3>
          <p className="text-slate-600 font-medium text-sm leading-relaxed">
            Apresentamos um Cristianismo Prático, Dignidade Humana e Excelência. Acreditamos que a palavra deve produzir resultados reais quando aplicada à vida.
          </p>
          <div className="pt-4">
            <span className="text-xs font-black text-orange-400 uppercase tracking-widest italic">"Oásis de Amor e Centro de Aprendizado"</span>
          </div>
        </motion.div>
      </section>

      {/* Footer Meta */}
      <footer className="text-center text-slate-400 text-xs font-bold uppercase tracking-widest py-8 border-t border-slate-100">
        <p>© 2026 Igreja Centro da Nova Geração Internacional — Sede Beira, Moçambique</p>
      </footer>
    </motion.div>
  );
}
