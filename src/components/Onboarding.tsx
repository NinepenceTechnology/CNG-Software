import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';
import { User, Users, Lock, ChevronRight } from 'lucide-react';

interface OnboardingProps {
  user: any;
  lang: 'pt' | 'en';
  onComplete: (profile: any) => void;
}

export default function Onboarding({ user, lang, onComplete }: OnboardingProps) {
  const [name, setName] = useState(user.displayName || '');
  const [group, setGroup] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const groups = [
    { id: 'admin', label: lang === 'pt' ? 'Administrador Geral' : 'General Administrator' },
    { id: 'treasurer', label: lang === 'pt' ? 'Tesoureiro' : 'Treasurer' },
    { id: 'secretary', label: lang === 'pt' ? 'Secretário' : 'Secretary' },
    { id: 'leader', label: lang === 'pt' ? 'Pastor / Líder' : 'Pastor / Leader' },
    { id: 'collaborator', label: lang === 'pt' ? 'Colaborador' : 'Collaborator' },
    { id: 'youth', label: lang === 'pt' ? 'Jovens' : 'Youth' },
    { id: 'musicians', label: lang === 'pt' ? 'Músicos' : 'Musicians' }
  ];

  const handleComplete = async () => {
    if (!name || !group || !password) return;
    setLoading(true);
    
    // Check password strength for the 8-character mixed constraint if they are admin or changing default
    const isStrong = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/.test(password);
    
    if (user.providedCode === 'ABC12345' && !isStrong) {
      alert(lang === 'pt' 
        ? 'A senha deve ter pelo menos 8 caracteres, misturando letras e números.' 
        : 'Password must have at least 8 characters, mixing letters and numbers.');
      setLoading(false);
      return;
    }

    const profileData = {
      uid: user.uid,
      name,
      group,
      role: ['admin', 'treasurer', 'secretary', 'leader', 'collaborator'].includes(group) ? group : 'leader',
      onboardingComplete: true,
      email: user.email || '',
      updatedAt: new Date().toISOString()
    };

    const path = `users/${user.uid}`;
    try {
      await setDoc(doc(db, 'users', user.uid), profileData);
      onComplete(profileData);
    } catch (error) {
      console.error("Failed to save profile:", error);
      handleFirestoreError(error, OperationType.WRITE, path);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-app-gradient-vibrant flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full bg-white/90 backdrop-blur-2xl rounded-[48px] shadow-2xl p-10 border border-white/20"
      >
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-primary/20">
            <User className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight">
            {lang === 'pt' ? 'Bem-vindo ao CNG' : 'Welcome to CNG'}
          </h1>
          <p className="text-black/50 text-sm mt-2 font-bold uppercase tracking-widest">
            {lang === 'pt' ? 'Complete seu perfil para começar' : 'Complete your profile to start'}
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 px-1 ml-1 flex items-center gap-2">
              <User className="w-3 h-3" /> {lang === 'pt' ? 'Seu Nome Completo' : 'Your Full Name'}
            </label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-16 px-6 rounded-3xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none font-bold text-lg transition-all"
              placeholder={lang === 'pt' ? 'João Maria' : 'John Doe'}
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 px-1 ml-1 flex items-center gap-2">
              <Users className="w-3 h-3" /> {lang === 'pt' ? 'Grupo / Ministério' : 'Group / Ministry'}
            </label>
            <select 
              value={group}
              onChange={(e) => setGroup(e.target.value)}
              className="w-full h-16 px-6 rounded-3xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none font-bold text-lg transition-all appearance-none cursor-pointer"
            >
              <option value="" disabled>{lang === 'pt' ? 'Selecione seu grupo' : 'Select your group'}</option>
              {groups.map(g => (
                <option key={g.id} value={g.id}>{g.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 px-1 ml-1 flex items-center gap-2">
              <Lock className="w-3 h-3" /> {lang === 'pt' ? 'Sua Senha Pessoal' : 'Your Personal Password'}
            </label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-16 px-6 rounded-3xl bg-slate-50 border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none font-bold text-lg tracking-widest transition-all"
              placeholder="••••••••"
            />
            {user.providedCode === 'ABC12345' && (
              <p className="text-[9px] text-rose-500 font-bold uppercase mt-1 ml-1">
                {lang === 'pt' 
                  ? '* Mínimo 8 caracteres, letras e números obrigatórios.' 
                  : '* Minimum 8 characters, letters and numbers required.'}
              </p>
            )}
          </div>

          <Button 
            onClick={handleComplete}
            disabled={loading || !name || !group || !password}
            className="w-full h-20 bg-primary hover:bg-primary/90 text-white rounded-[32px] text-xl font-black uppercase tracking-widest shadow-2xl shadow-primary/30 transition-all flex items-center justify-center gap-3 mt-8 group"
          >
            {loading ? (lang === 'pt' ? 'Salvando...' : 'Saving...') : (
              <>
                {lang === 'pt' ? 'Concluir e Entrar' : 'Complete and Enter'}
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
