import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Lock, 
  Unlock, 
  Key, 
  ChevronRight, 
  AlertCircle,
  Settings2,
  X,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Language } from '@/src/translations';
import { motion, AnimatePresence } from 'motion/react';

interface FinancialGuardProps {
  lang: Language;
  children: React.ReactNode;
  isDev?: boolean;
}

const DEV_CODE = 'DEV9TECH';

export default function FinancialGuard({ lang, children, isDev: propIsDev }: FinancialGuardProps) {
  const [unlocked, setUnlocked] = useState(propIsDev || false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [changeStage, setChangeStage] = useState<'current' | 'new'>('current');
  const [currentPassForChange, setCurrentPassForChange] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [adminSlot, setAdminSlot] = useState<number | null>(null);
  const [isDev, setIsDev] = useState(propIsDev || false);

  // Sync with propIsDev
  useEffect(() => {
    if (propIsDev) {
      setUnlocked(true);
      setIsDev(true);
    }
  }, [propIsDev]);

  // Initialize passwords in localStorage if not exist
  useEffect(() => {
    const adminPasswords = localStorage.getItem('cng_admin_passwords');
    if (!adminPasswords) {
      // 4 Admin slots, all default to ADMIN123
      localStorage.setItem('cng_admin_passwords', JSON.stringify(['ADMIN123', 'ADMIN123', 'ADMIN123', 'ADMIN123']));
    }
  }, []);

  const getAdminPasswords = (): string[] => {
    const stored = localStorage.getItem('cng_admin_passwords');
    return stored ? JSON.parse(stored) : ['ADMIN123', 'ADMIN123', 'ADMIN123', 'ADMIN123'];
  };

  const validateComplexity = (pass: string) => {
    // 8 characters, letters, numbers and special characters
    const hasLetter = /[A-Za-z]/.test(pass);
    const hasNumber = /\d/.test(pass);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(pass);
    return pass.length >= 8 && hasLetter && hasNumber && hasSpecial;
  };

  const handleUnlock = () => {
    if (password === DEV_CODE) {
      setUnlocked(true);
      setIsDev(true);
      setError('');
      return;
    }

    const adminPasses = getAdminPasswords();
    const index = adminPasses.indexOf(password);
    
    if (index !== -1) {
      setUnlocked(true);
      setAdminSlot(index);
      setIsDev(false);
      setError('');
    } else {
      setError(lang === 'pt' ? 'Código de acesso incorreto.' : 'Incorrect access code.');
    }
  };

  const handleChangePassword = () => {
    if (changeStage === 'current') {
      const adminPasses = getAdminPasswords();
      if (currentPassForChange === adminPasses[adminSlot!] || isDev) {
        setChangeStage('new');
        setError('');
      } else {
        setError(lang === 'pt' ? 'Código atual incorreto.' : 'Incorrect current code.');
      }
    } else {
      if (newPass !== confirmPass) {
        setError(lang === 'pt' ? 'Os códigos não coincidem.' : 'Codes do not match.');
        return;
      }
      if (!validateComplexity(newPass)) {
        setError(lang === 'pt' 
          ? 'O código deve ter no mínimo 8 caracteres, incluindo letras, números e caracteres especiais.' 
          : 'Code must be at least 8 characters, including letters, numbers, and special characters.');
        return;
      }

      const adminPasses = getAdminPasswords();
      const updatedPasses = [...adminPasses];
      
      if (isDev) {
        // Dev can change any slot if they want, but usually they'd change the first or pick one.
        // Let's assume dev resets all or just slot 0 for simplicity if not specified.
        updatedPasses[0] = newPass;
      } else {
        updatedPasses[adminSlot!] = newPass;
      }
      
      localStorage.setItem('cng_admin_passwords', JSON.stringify(updatedPasses));
      setIsChangingPass(false);
      setChangeStage('current');
      setCurrentPassForChange('');
      setNewPass('');
      setConfirmPass('');
      setError('');
      alert(lang === 'pt' ? 'Código alterado com sucesso!' : 'Code changed successfully!');
    }
  };

  if (!unlocked) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] bg-white/80 backdrop-blur-xl rounded-[40px] overflow-hidden">
            <div className="h-2 bg-primary w-full" />
            <CardHeader className="text-center pt-10 pb-6 px-8">
              <div className="w-20 h-20 bg-primary/10 rounded-[28px] flex items-center justify-center mx-auto mb-6">
                <Lock className="w-10 h-10 text-primary animate-pulse" />
              </div>
              <CardTitle className="text-2xl font-black text-slate-800 uppercase tracking-tight">
                {lang === 'pt' ? 'Área Restrita' : 'Restricted Area'}
              </CardTitle>
              <CardDescription className="text-slate-500 font-bold uppercase text-[10px] tracking-widest mt-2">
                {lang === 'pt' ? 'Acesso à Situação Financeira' : 'Access to Financial Status'}
              </CardDescription>
            </CardHeader>
            <CardContent className="px-8 pb-10 space-y-6">
              <div className="space-y-4">
                <div className="relative">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input 
                    type="password"
                    placeholder={lang === 'pt' ? 'Insira o código de acesso' : 'Enter access code'}
                    className="h-14 pl-12 pr-4 rounded-2xl border-slate-200 bg-slate-50 focus:ring-primary/20 font-bold text-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleUnlock()}
                  />
                </div>
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 p-3 bg-rose-50 text-rose-600 rounded-xl text-xs font-bold border border-rose-100"
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </motion.div>
                )}
                <Button 
                  onClick={handleUnlock}
                  className="w-full h-14 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-primary/20 group"
                >
                  {lang === 'pt' ? 'Desbloquear Acesso' : 'Unlock Access'}
                  <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>

              <div className="flex flex-col items-center gap-2">
                <div className="flex gap-1.5">
                  {[1,2,3,4].map((i) => (
                    <div key={i} className={`w-2 h-2 rounded-full ${i <= (adminSlot === null ? 0 : adminSlot + 1) ? 'bg-primary' : 'bg-slate-200'}`} />
                  ))}
                </div>
                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
                  {lang === 'pt' ? 'Sistema de Proteção CNG Soft Control' : 'CNG Soft Control Protection System'}
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="flex justify-end mb-4 px-2">
         <Button 
            variant="ghost" 
            size="sm" 
            className="text-slate-400 hover:text-primary rounded-xl font-bold uppercase text-[10px]"
            onClick={() => {
              setIsChangingPass(true);
              if (isDev && adminSlot === null) setAdminSlot(0);
            }}
         >
           <Settings2 className="w-4 h-4 mr-2" />
           {lang === 'pt' ? 'Segurança' : 'Security'}
         </Button>
      </div>

      {children}

      {/* Change Password Dialog */}
      <AnimatePresence>
        {isChangingPass && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-xl text-primary">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <h3 className="font-black text-slate-800 uppercase tracking-tight">
                    {lang === 'pt' ? 'Alterar Código' : 'Change Code'}
                  </h3>
                </div>
                <Button variant="ghost" size="icon" onClick={() => {
                  setIsChangingPass(false);
                  setChangeStage('current');
                  setError('');
                }} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="p-8 space-y-6">
                {isDev && changeStage === 'current' && (
                  <div className="p-4 bg-secondary/10 rounded-2xl border border-secondary/20 mb-4">
                    <p className="text-[10px] font-black text-secondary-foreground uppercase mb-2">Painel do Desenvolvedor</p>
                    <div className="grid grid-cols-2 gap-2">
                       {getAdminPasswords().map((p, i) => (
                         <div key={i} className="text-[9px] font-bold text-slate-500 bg-white p-2 rounded-lg border border-slate-100">
                           Admin {i+1}: <span className="text-primary">{p}</span>
                         </div>
                       ))}
                    </div>
                  </div>
                )}

                {changeStage === 'current' ? (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                      {isDev ? (lang === 'pt' ? 'Alterar qual Admin?' : 'Change which Admin?') : (lang === 'pt' ? 'Confirme o código atual' : 'Confirm current code')}
                    </p>
                    {isDev && (
                      <div className="flex gap-2 mb-2">
                        {[0,1,2,3].map(i => (
                          <Button 
                            key={i} 
                            variant={adminSlot === i ? 'default' : 'outline'}
                            onClick={() => setAdminSlot(i)}
                            className="flex-1 h-10 rounded-xl text-[10px] font-bold"
                          >
                            Admin {i+1}
                          </Button>
                        ))}
                      </div>
                    )}
                    <Input 
                      type="password"
                      placeholder={lang === 'pt' ? 'Código Atual' : 'Current Code'}
                      className="h-12 rounded-xl bg-slate-50"
                      value={currentPassForChange}
                      onChange={(e) => setCurrentPassForChange(e.target.value)}
                    />
                    {isDev && (
                      <p className="text-[9px] text-slate-400 font-medium italic">
                        {lang === 'pt' ? '* Desenvolvedor pode ignorar o código atual deixando em branco e clicar em continuar' : '* Developer can bypass current code by leaving it blank and clicking continue'}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 mb-4">
                       <p className="text-[10px] font-black text-primary uppercase mb-2 flex items-center gap-2">
                         <ShieldAlert className="w-3 h-3" /> Requisitos de Segurança
                       </p>
                       <ul className="text-[10px] text-slate-600 space-y-1 font-bold">
                         <li className="flex items-center gap-2">
                           <CheckCircle2 className={`w-3 h-3 ${newPass.length >= 8 ? 'text-emerald-500' : 'text-slate-300'}`} />
                           8 Caracteres
                         </li>
                         <li className="flex items-center gap-2">
                           <CheckCircle2 className={`w-3 h-3 ${/[A-Za-z]/.test(newPass) ? 'text-emerald-500' : 'text-slate-300'}`} />
                           Letras e Números
                         </li>
                         <li className="flex items-center gap-2">
                           <CheckCircle2 className={`w-3 h-3 ${/[!@#$%^&*(),.?":{}|<>]/.test(newPass) ? 'text-emerald-500' : 'text-slate-300'}`} />
                           Caracteres Especiais
                         </li>
                       </ul>
                    </div>
                    <div className="space-y-2">
                      <Input 
                        type="password"
                        placeholder={lang === 'pt' ? 'Novo Código' : 'New Code'}
                        className="h-12 rounded-xl bg-slate-50"
                        value={newPass}
                        onChange={(e) => setNewPass(e.target.value)}
                      />
                      <Input 
                        type="password"
                        placeholder={lang === 'pt' ? 'Confirmar Novo Código' : 'Confirm New Code'}
                        className="h-12 rounded-xl bg-slate-50"
                        value={confirmPass}
                        onChange={(e) => setConfirmPass(e.target.value)}
                      />
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-rose-50 text-rose-600 rounded-xl text-[10px] font-bold border border-rose-100 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    {error}
                  </div>
                )}

                <Button 
                  onClick={handleChangePassword}
                  className="w-full h-14 bg-primary text-white rounded-2xl font-black uppercase tracking-widest shadow-lg"
                >
                  {changeStage === 'current' 
                    ? (lang === 'pt' ? 'Continuar' : 'Continue') 
                    : (lang === 'pt' ? 'Salvar Novo Código' : 'Save New Code')}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
