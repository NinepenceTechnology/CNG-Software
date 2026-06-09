import { useState } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Lock, Phone, Save, X } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any;
  profile: any;
  lang: 'pt' | 'en';
}

export default function SettingsModal({ isOpen, onClose, user, profile, lang }: SettingsModalProps) {
  const [password, setPassword] = useState('');
  const [phoneForMassPub, setPhoneForMassPub] = useState(profile?.massPubPhone || '+258 ');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const updates: any = {
        massPubPhone: phoneForMassPub,
        updatedAt: new Date().toISOString()
      };
      
      // Password validation if changing
      if (password) {
        const isStrong = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,}$/.test(password);
        if (!isStrong) {
          alert(lang === 'pt' 
            ? 'A senha deve ter pelo menos 8 caracteres, misturando letras e números.' 
            : 'Password must have at least 8 characters, mixing letters and numbers.');
          setLoading(false);
          return;
        }
        updates.password = password; // In production, never store plaintext passwords
      }

      const path = `users/${user.uid}`;
      try {
        await updateDoc(doc(db, 'users', user.uid), updates);
        alert(lang === 'pt' ? 'Configurações salvas com sucesso!' : 'Settings saved successfully!');
        onClose();
      } catch (error) {
        console.error("Failed to update settings:", error);
        handleFirestoreError(error, OperationType.UPDATE, path);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-xl rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
        <div className="p-8 space-y-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black text-black uppercase tracking-tight flex items-center gap-2">
              <Lock className="w-6 h-6 text-primary" />
              {lang === 'pt' ? 'Definições de Perfil' : 'Profile Settings'}
            </DialogTitle>
            <DialogDescription className="text-black/50 font-bold uppercase text-[10px] tracking-widest">
              {lang === 'pt' ? 'Gerencie sua segurança e comunicações' : 'Manage your security and communications'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-black/40 flex items-center gap-2 px-1">
                <Lock className="w-3 h-3" /> {lang === 'pt' ? 'Alterar Palavra-passe' : 'Change Password'}
              </Label>
              <Input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-bold tracking-widest focus:ring-primary/20"
              />
              <p className="text-[9px] text-black/40 font-bold uppercase px-1">
                {lang === 'pt' ? '* Letras e números, mín. 8 caracteres' : '* Letters and numbers, min. 8 chars'}
              </p>
            </div>

            <div className="space-y-2">
              <Label className="text-[10px] font-black uppercase text-black/40 flex items-center gap-2 px-1">
                <Phone className="w-3 h-3" /> {lang === 'pt' ? 'Número para Cobrança Carrier' : 'Carrier Billing Number'}
              </Label>
              <Input 
                type="tel"
                placeholder="+258 84 000 0000"
                value={phoneForMassPub}
                onChange={(e) => setPhoneForMassPub(e.target.value)}
                className="h-12 rounded-2xl bg-slate-50 border-slate-200 font-bold focus:ring-primary/20"
              />
              <p className="text-[9px] text-black/40 font-bold uppercase px-1">
                {lang === 'pt' ? 'Número usado para cobrança de SMS e WhatsApp pela operadora' : 'Number used for carrier SMS and WhatsApp billing'}
              </p>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline"
              className="flex-1 h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest border-slate-200"
              onClick={onClose}
            >
              {lang === 'pt' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button 
              className="flex-1 h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest bg-primary shadow-lg shadow-primary/20"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? <Save className="w-4 h-4 animate-spin" /> : 
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {lang === 'pt' ? 'Salvar' : 'Save'}
                </>
              }
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
