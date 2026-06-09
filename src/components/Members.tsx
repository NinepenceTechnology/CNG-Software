import { 
  Users, 
  Search,
  Plus,
  Filter,
  MoreVertical,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Info,
  Download,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { translations, Language } from '@/src/translations';
import { useState, useEffect } from 'react';
import { addMember, subscribeToMembers, Member } from '@/src/services/membersService';

interface MembersProps {
  lang: Language;
  activeBranch: string;
}

export default function Members({ lang, activeBranch }: MembersProps) {
  const t = translations[lang];
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [regError, setRegError] = useState<string | null>(null);
  const [regSuccess, setRegSuccess] = useState<boolean>(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthday: '',
    ministry: 'assembleia',
    cell: '',
    group: 'fiel' as const,
    status: 'ativo' as const,
    address: ''
  });

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToMembers(activeBranch, (data) => {
      setMembers(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [activeBranch]);

  const handleRegister = async () => {
    if (!formData.name.trim()) {
      setRegError(lang === 'pt' ? 'Por favor, insira o nome do membro.' : 'Please enter the member name.');
      return;
    }
    setIsRegistering(true);
    setRegError(null);
    setRegSuccess(false);
    try {
      await addMember(activeBranch, formData);
      setRegSuccess(true);
      // Clean form and close dialog after brief success celebration
      setTimeout(() => {
        setIsDialogOpen(false);
        setRegSuccess(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          birthday: '',
          ministry: 'assembleia',
          cell: '',
          group: 'fiel',
          status: 'ativo',
          address: ''
        });
      }, 1000);
    } catch (error: any) {
      console.error("Error adding member:", error);
      let errorMsg = lang === 'pt' 
        ? 'Erro na sincronização imediata. O registo foi salvo localmente e será enviado de forma resiliente.' 
        : 'Immediate synchronization failure. The record is saved locally and will sync resiliently.';
      
      // Attempt to deserialize or show details
      if (error?.message) {
        try {
          const parsed = JSON.parse(error.message);
          if (parsed && parsed.error) {
            errorMsg += ` (${parsed.error})`;
          }
        } catch (_) {
          errorMsg += ` (${error.message})`;
        }
      }
      setRegError(errorMsg);
    } finally {
      setIsRegistering(false);
    }
  };

  const [searchTerm, setSearchTerm] = useState('');
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.memberManagement}</h2>
          <p className="text-slate-500">
            {lang === 'pt' ? `Gerenciando fiéis da ${activeBranch}` : `Managing faithful for ${activeBranch}`}
          </p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              {t.newMember}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px] rounded-3xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-slate-800">{t.newMember}</DialogTitle>
              <DialogDescription className="text-slate-500">
                {lang === 'pt' ? 'Preencha os dados abaixo para registar um novo fiel.' : 'Fill in the details below to register a new faithful.'}
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t.memberName}</Label>
                  <Input 
                    id="name" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Ex: João Manuel" 
                    className="rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">{t.memberEmail}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="joao@exemplo.com" 
                    className="rounded-xl" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">{t.memberPhone}</Label>
                  <Input 
                    id="phone" 
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                    placeholder="+258 8X XXX XXXX" 
                    className="rounded-xl" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="birthday">{t.memberBirthday}</Label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      id="birthday" 
                      type="date" 
                      value={formData.birthday}
                      onChange={e => setFormData({...formData, birthday: e.target.value})}
                      className="pl-10 rounded-xl" 
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ministry">{t.ministries}</Label>
                  <Select value={formData.ministry} onValueChange={v => setFormData({...formData, ministry: v})}>
                    <SelectTrigger className="rounded-xl">
                      <SelectValue placeholder={lang === 'pt' ? 'Ministério' : 'Ministry'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="louvor_adoracao">Louvor e adoração</SelectItem>
                      <SelectItem value="obreiros">Obreiros</SelectItem>
                      <SelectItem value="protocolo">Protocolo</SelectItem>
                      <SelectItem value="secretariado">Secretariado</SelectItem>
                      <SelectItem value="interseccao">Intersecção</SelectItem>
                      <SelectItem value="assembleia">Assembleia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cell">{t.cells}</Label>
                  <Input 
                    id="cell" 
                    value={formData.cell}
                    onChange={e => setFormData({...formData, cell: e.target.value})}
                    placeholder={lang === 'pt' ? 'Celulá' : 'Cell'} 
                    className="rounded-xl" 
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="group">{t.memberGroup}</Label>
                <Select value={formData.group} onValueChange={v => setFormData({...formData, group: v as any})}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder={lang === 'pt' ? 'Selecionar categoria...' : 'Select category...'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fiel">{lang === 'pt' ? 'Membro Fiel' : 'Faithful Member'}</SelectItem>
                    <SelectItem value="visitante">{lang === 'pt' ? 'Visitante' : 'Visitor'}</SelectItem>
                    <SelectItem value="pastor">{lang === 'pt' ? 'Pastor/Líder' : 'Pastor/Leader'}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{t.memberAddress}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                  <Textarea 
                    id="address" 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    placeholder={lang === 'pt' ? 'Localização...' : 'Location...'} 
                    className="pl-10 rounded-xl min-h-[80px]" 
                  />
                </div>
              </div>

              <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex gap-3">
                <Info className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  <span className="font-bold text-primary">{lang === 'pt' ? 'Sincronização Automática:' : 'Auto Sync:'}</span> {t.autoSyncNotice}
                </p>
              </div>

              {regError && (
                <div className="p-4 bg-red-50 text-red-700 text-xs rounded-2xl border border-red-200">
                  {regError}
                </div>
              )}

              {regSuccess && (
                <div className="p-4 bg-green-50 text-green-700 text-xs rounded-2xl border border-green-200 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-ping" />
                  <span>{lang === 'pt' ? 'Membro registado com sucesso!' : 'Member registered successfully!'}</span>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)} 
                className="rounded-xl"
                disabled={isRegistering || regSuccess}
              >
                {lang === 'pt' ? 'Cancelar' : 'Cancel'}
              </Button>
              <Button 
                onClick={handleRegister} 
                className="bg-primary hover:bg-primary/90 rounded-xl px-8"
                disabled={isRegistering || regSuccess}
              >
                {isRegistering ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {lang === 'pt' ? 'A Registar...' : 'Registering...'}
                  </>
                ) : regSuccess ? (
                  lang === 'pt' ? 'Sucesso!' : 'Success!'
                ) : (
                  lang === 'pt' ? 'Registar Membro' : 'Register Member'
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md rounded-[32px] overflow-hidden">
        <CardHeader className="border-b border-slate-50/50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder={lang === 'pt' ? 'Buscar...' : 'Search...'} 
                className="pl-10 bg-slate-50/50 border-slate-200 rounded-2xl"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-slate-100">
                  <TableHead className="font-bold text-slate-800">{lang === 'pt' ? 'Membro' : 'Member'}</TableHead>
                  <TableHead className="font-bold text-slate-800">{lang === 'pt' ? 'Grupo' : 'Group'}</TableHead>
                  <TableHead className="font-bold text-slate-800">Status</TableHead>
                  <TableHead className="font-bold text-slate-800">{lang === 'pt' ? 'Data' : 'Date'}</TableHead>
                  <TableHead className="text-right font-bold text-slate-800">{lang === 'pt' ? 'Ações' : 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-10 text-slate-400">
                      {lang === 'pt' ? 'Nenhum membro encontrado.' : 'No members found.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMembers.map((member) => (
                    <TableRow key={member.id} className="border-slate-50 hover:bg-slate-50/50 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                            <AvatarFallback className="bg-primary/10 text-primary font-bold">{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="flex items-center gap-2">
                              <p className="font-bold text-slate-800">{member.name}</p>
                              {member.hasPendingWrites ? (
                                <Badge variant="outline" className="text-[9px] bg-amber-50 text-amber-600 border-amber-200 py-0 px-1.5 animate-pulse rounded-full select-none">
                                  {lang === 'pt' ? 'A Sincronizar...' : 'Syncing...'}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-[9px] bg-green-50 text-green-600 border-green-200 py-0 px-1.5 rounded-full select-none">
                                  {lang === 'pt' ? 'Sincronizado' : 'Synced'}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-slate-500">{member.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize bg-slate-100 text-slate-600 border-none rounded-lg px-2 py-0.5">
                          {member.group}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          className={
                            member.status === 'ativo' 
                              ? 'bg-green-100 text-green-700 hover:bg-green-100 border-none rounded-lg' 
                              : 'bg-slate-100 text-slate-700 hover:bg-slate-100 border-none rounded-lg'
                          }
                        >
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-500 text-sm">
                        {member.createdAt ? member.createdAt.toDate().toLocaleDateString() : '-'}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg">
                            <Mail className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-lg">
                            <Phone className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
