import { FileText, Download, Plus, Search, FileCheck, FileSignature, Archive, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { translations, Language } from '@/src/translations';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';

interface SecretaryProps {
  lang: Language;
}

const mockDocs = [
  { id: '1', title: 'Ata de Reunião de Obreiros', type: 'Ata', date: '2024-03-15', status: 'Assinado' },
  { id: '2', title: 'Certificado de Batismo - Ana Silva', type: 'Certificado', date: '2024-03-10', status: 'Pendente' },
  { id: '3', title: 'Declaração de Membresia - João Gomes', type: 'Declaração', date: '2024-03-05', status: 'Emitido' },
  { id: '4', title: 'Relatório Trimestral de Atividades', type: 'Relatório', date: '2024-02-28', status: 'Arquivado' },
];

export default function Secretary({ lang }: SecretaryProps) {
  const t = translations[lang];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.secretaryManagement}</h2>
          <p className="text-slate-500">
            {lang === 'pt' 
              ? 'Gestão de atas, certificados e documentos oficiais da congregação.' 
              : 'Management of minutes, certificates, and official congregation documents.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-white/60 backdrop-blur-sm border-none shadow-sm">
            <Archive className="w-4 h-4 mr-2" />
            {lang === 'pt' ? 'Arquivo' : 'Archive'}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4 mr-2" />
                {lang === 'pt' ? 'Novo Documento' : 'New Document'}
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-[32px]">
              <DialogHeader>
                <DialogTitle>{lang === 'pt' ? 'Criar Novo Documento' : 'Create New Document'}</DialogTitle>
              </DialogHeader>
              <div className="grid grid-cols-2 gap-4 py-6">
                {[
                  { title: 'Ata de Reunião', icon: FileText },
                  { title: 'Certificado', icon: FileCheck },
                  { title: 'Declaração', icon: FileSignature },
                  { title: 'Relatório', icon: FileText },
                ].map((type) => (
                  <Button key={type.title} variant="outline" className="h-24 flex flex-col gap-2 rounded-2xl border-slate-100 hover:border-primary/50 hover:bg-primary/5">
                    <type.icon className="w-6 h-6 text-primary" />
                    <span className="text-[10px] font-bold uppercase">{type.title}</span>
                  </Button>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { title: lang === 'pt' ? 'Documentos Emitidos' : 'Documents Issued', value: '1,240', icon: FileCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
          { title: lang === 'pt' ? 'Assinaturas Pendentes' : 'Pending Signatures', value: '12', icon: FileSignature, color: 'text-amber-500', bg: 'bg-amber-50' },
          { title: lang === 'pt' ? 'Total de Atas' : 'Total Minutes', value: '450', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white/60 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{stat.title}</p>
                  <h3 className="text-2xl font-black text-slate-800 mt-1">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              {lang === 'pt' ? 'Compliance Legal e Estatutos' : 'Legal Compliance & Statutes'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: 'Estatuto Geral da Igreja', type: 'Institucional', date: '2023-01-01' },
              { title: 'Regulamento Interno de Filiais', type: 'Normativo', date: '2023-06-15' },
              { title: 'Contrato de Arrendamento Sede', type: 'Contrato', date: '2024-02-10' },
            ].map((doc, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-white/40 rounded-xl border border-white/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/5 rounded-lg text-primary">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">{doc.title}</p>
                    <p className="text-[10px] text-slate-400 uppercase">{doc.type} • {doc.date}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full rounded-xl border-dashed border-2 hover:bg-primary/5 hover:border-primary transition-all">
              <Plus className="w-4 h-4 mr-2" />
              {lang === 'pt' ? 'Adicionar Documento Legal' : 'Add Legal Document'}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-secondary" />
              {lang === 'pt' ? 'Assinatura Digital de Documentos' : 'Digital Document Signing'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-3 hover:border-primary/50 transition-colors cursor-pointer">
              <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-primary transition-colors">
                <FileSignature className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-700">{lang === 'pt' ? 'Arraste o documento para assinar' : 'Drag document to sign'}</p>
                <p className="text-[10px] text-slate-400 uppercase">{lang === 'pt' ? 'Válido para Certificados e Atas' : 'Valid for Certificates and Minutes'}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <p className="text-[10px] text-emerald-700 font-bold uppercase">{lang === 'pt' ? 'Proteção Criptográfica Ativa' : 'Cryptographic Protection Active'}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <CardTitle className="text-lg font-bold text-slate-800">
              {lang === 'pt' ? 'Documentos Recentes' : 'Recent Documents'}
            </CardTitle>
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder={lang === 'pt' ? 'Buscar documento...' : 'Search document...'} 
                className="pl-10 bg-white/40 border-none shadow-inner rounded-xl"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDocs.map((doc) => (
              <div 
                key={doc.id} 
                className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-white/20 hover:bg-white/60 transition-all cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/5 text-primary rounded-xl group-hover:bg-primary group-hover:text-white transition-colors">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{doc.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[10px] font-bold uppercase">{doc.type}</Badge>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{new Date(doc.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <Badge className={`font-bold ${
                    doc.status === 'Assinado' ? 'bg-emerald-100 text-emerald-700' : 
                    doc.status === 'Pendente' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {doc.status}
                  </Badge>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-primary">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
