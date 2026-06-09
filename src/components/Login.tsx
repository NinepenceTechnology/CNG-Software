import { useState } from 'react';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Globe, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from './Logo';

interface LoginProps {
  onLogin: (user: any) => void;
  lang: 'pt' | 'en';
}

export default function Login({ onLogin, lang }: LoginProps) {
  const [loading, setLoading] = useState(false);
  const [showCodeLogin, setShowCodeLogin] = useState(false);
  const [accessCode, setAccessCode] = useState('');
  const [selectedRole, setSelectedRole] = useState<'admin' | 'treasurer' | 'secretary' | 'leader' | 'collaborator'>('admin');

  const handleGoogleLogin = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      onLogin(result.user);
    } catch (error) {
      console.error("Login failed:", error);
      alert(lang === 'pt' ? "Falha no login. Tente novamente." : "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeLogin = () => {
    if (!accessCode) return;
    
    // Developer absolute access
    if (accessCode === 'DEV9TECH') {
      const devUser = {
        uid: 'dev_absolute',
        displayName: 'DEVELOPER ABSOLUTE',
        email: 'dev@9tech.app',
        isCodeLogin: true,
        role: 'admin',
        isDev: true,
        providedCode: accessCode
      };
      onLogin(devUser);
      return;
    }

    // Admin default access or check against local storage if we wanted to sync them
    // But for now, we'll follow "absolute access" logic for DEV9TECH here.
    
    const mockUser = {
      uid: `code_${accessCode}`,
      displayName: selectedRole.toUpperCase(),
      email: `${selectedRole}@cng.app`,
      isCodeLogin: true,
      role: selectedRole,
      providedCode: accessCode
    };
    onLogin(mockUser);
  };

  return (
    <div className="min-h-screen bg-app-gradient-vibrant flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-[40px] shadow-2xl p-10 border border-white/20 text-center"
      >
        <div className="mb-8 flex justify-center">
          <Logo size="xl" className="shadow-2xl" />
        </div>

        <h1 className="text-3xl font-black text-black mb-2">CNG SOFTWARE</h1>
        <p className="text-black/60 font-medium mb-8">
          {lang === 'pt' 
            ? 'Gestão Eclesiástica de Alta Performance' 
            : 'High Performance Ecclesiastical Management'}
        </p>

        <div className="space-y-4">
          {!showCodeLogin ? (
            <>
              <Button 
                className="w-full h-14 bg-white hover:bg-slate-50 text-black font-bold rounded-2xl border border-slate-200 shadow-sm transition-all flex items-center justify-center gap-3"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
                {lang === 'pt' ? 'Entrar com Google' : 'Sign in with Google'}
              </Button>
              <Button 
                variant="ghost"
                className="w-full text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
                onClick={() => setShowCodeLogin(true)}
              >
                {lang === 'pt' ? 'Entrar com Código de Acesso' : 'Sign in with Access Code'}
              </Button>
            </>
          ) : (
            <div className="space-y-4 text-left">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 px-1">
                  {lang === 'pt' ? 'Função/Cargo' : 'Role/Position'}
                </label>
                <select 
                  value={selectedRole}
                  onChange={(e: any) => setSelectedRole(e.target.value)}
                  className="w-full h-12 px-4 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm"
                >
                  <option value="admin">Administrador</option>
                  <option value="treasurer">Tesoureiro</option>
                  <option value="secretary">Secretário</option>
                  <option value="leader">Pastor/Líder</option>
                  <option value="collaborator">Colaborador</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-black/40 px-1">
                  {lang === 'pt' ? 'Código de Acesso' : 'Access Code'}
                </label>
                <input 
                  type="password"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-12 px-4 rounded-2xl bg-white border border-slate-200 focus:ring-2 focus:ring-primary/20 outline-none font-bold text-sm tracking-widest"
                />
              </div>
              <Button 
                className="w-full h-14 bg-primary hover:bg-primary/90 text-white font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all"
                onClick={handleCodeLogin}
                disabled={!accessCode}
              >
                {lang === 'pt' ? 'Entrar' : 'Sign In'}
              </Button>
              <Button 
                variant="ghost"
                className="w-full text-[10px] font-black uppercase tracking-widest text-primary/60 hover:text-primary transition-colors"
                onClick={() => setShowCodeLogin(false)}
              >
                {lang === 'pt' ? 'Voltar para Google' : 'Back to Google'}
              </Button>
            </div>
          )}

          <div className="flex items-center gap-4 py-4">
            <div className="h-px bg-slate-200 flex-1"></div>
            <span className="text-[10px] font-bold text-black/40 uppercase tracking-widest">{lang === 'pt' ? 'Segurança Total' : 'Total Security'}</span>
            <div className="h-px bg-slate-200 flex-1"></div>
          </div>

          <div className="flex items-center justify-center gap-6 text-primary">
            <div className="flex flex-col items-center opacity-60">
              <ShieldCheck className="w-5 h-5 mb-1 text-primary" />
              <span className="text-[8px] font-bold uppercase text-black">SSL Encrypted</span>
            </div>
            <div className="flex flex-col items-center opacity-60">
              <Globe className="w-5 h-5 mb-1 text-secondary" />
              <span className="text-[8px] font-bold uppercase text-black">Cloud Sync</span>
            </div>
          </div>
        </div>

        <p className="mt-10 text-[10px] text-black/40 font-medium leading-relaxed">
          {lang === 'pt' 
            ? 'Ao entrar, você concorda com nossos termos de privacidade e uso de dados eclesiásticos.' 
            : 'By entering, you agree to our terms of privacy and use of ecclesiastical data.'}
        </p>
      </motion.div>
    </div>
  );
}
