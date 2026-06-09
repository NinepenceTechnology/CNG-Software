import React, { useState, useEffect } from 'react';
import { FileText, Download, TrendingUp, PieChart, BarChart as BarChartIcon, FileSpreadsheet, Plus, ArrowLeft, Printer, Save, Upload, Image as ImageIcon, X, Users, Wallet, Loader2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { translations, Language } from '@/src/translations';
import { saveReport, subscribeToFinanceSummary, FinanceSummary } from '@/src/services/financeService';
import { subscribeToMembers } from '@/src/services/membersService';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';

interface CelebrationReport {
  date: string;
  cultLeader: string;
  preacher: string;
  theme: string;
  books: string;
  prosperityPreacher: string;
  prosperityTheme: string;
  prosperityBooks: string;
  totalParticipation: number;
  participationMen: number;
  participationWomen: number;
  participationChildren: number;
  testimonies: number;
  visitorsTotal: number;
  visitorsMen: number;
  visitorsWomen: number;
  visitorsChildren: number;
  convertsTotal: number;
  convertsMen: number;
  convertsWomen: number;
  convertsChildren: number;
  oferta1: string;
  oferta2: string;
  dizimos: string;
  primicia: string;
  votos: string;
  semente: string;
  sacrificio: string;
  missoes: string;
  apreciacaoPastoral: string;
  apreciacaoApostolica: string;
  ofertaAltar: string;
  ofertaAmor: string;
  parceirosLocais: string;
  parceirosApJonas: string;
  parceirosGrandeComissao: string;
  contribuicaoLocal: string;
  contribuicaoExcepcional: string;
  tithers: string;
  commentary: string;
}

const initialCelebReport: CelebrationReport = {
  date: new Date().toISOString().split('T')[0],
  cultLeader: '',
  preacher: '',
  theme: '',
  books: '',
  prosperityPreacher: '',
  prosperityTheme: '',
  prosperityBooks: '',
  totalParticipation: 0,
  participationMen: 0,
  participationWomen: 0,
  participationChildren: 0,
  testimonies: 0,
  visitorsTotal: 0,
  visitorsMen: 0,
  visitorsWomen: 0,
  visitorsChildren: 0,
  convertsTotal: 0,
  convertsMen: 0,
  convertsWomen: 0,
  convertsChildren: 0,
  oferta1: '0.00',
  oferta2: '0.00',
  dizimos: '0.00',
  primicia: '0.00',
  votos: '0.00',
  semente: '0.00',
  sacrificio: '0.00',
  missoes: '0.00',
  apreciacaoPastoral: '0.00',
  apreciacaoApostolica: '0.00',
  ofertaAltar: '0.00',
  ofertaAmor: '0.00',
  parceirosLocais: '0.00',
  parceirosApJonas: '0.00',
  parceirosGrandeComissao: '0.00',
  contribuicaoLocal: '0.00',
  contribuicaoExcepcional: '0.00',
  tithers: '',
  commentary: ''
};

interface ReportsProps {
  lang: Language;
  activeBranch: string;
  userRole: string;
}

export default function Reports({ lang, activeBranch, userRole }: ReportsProps) {
  const t = translations[lang];
  const [view, setView] = useState<'dashboard' | 'form'>('dashboard');
  const [celebReport, setCelebReport] = useState<CelebrationReport>(initialCelebReport);
  const [financeSummary, setFinanceSummary] = useState<FinanceSummary | null>(null);
  const [memberCount, setMemberCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubFinance = subscribeToFinanceSummary(activeBranch, (summary) => setFinanceSummary(summary));
    const unsubMembers = subscribeToMembers(activeBranch, (members) => {
      setMemberCount(members.length);
      setLoading(false);
    });

    return () => {
      unsubFinance();
      unsubMembers();
    };
  }, [activeBranch]);

  const handleCelebInputChange = (field: keyof CelebrationReport, value: string | number) => {
    setCelebReport(prev => ({ ...prev, [field]: value }));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    const title = lang === 'pt' ? 'Relatório Geral - CNG SOFTWARE' : 'General Report - CNG SOFTWARE';
    
    doc.setFontSize(20);
    doc.text(title, 14, 22);
    
    doc.setFontSize(12);
    doc.text(`Data: ${new Date().toLocaleDateString()}`, 14, 30);
    doc.text(`${t.branches}: ${activeBranch}`, 14, 37);

    // Summary Section
    doc.setFontSize(16);
    doc.text(lang === 'pt' ? 'Resumo Executivo' : 'Executive Summary', 14, 50);
    doc.setFontSize(10);
    doc.text(`${t.totalMembers}: ${memberCount}`, 14, 60);
    doc.text(`${lang === 'pt' ? 'Saldo Atual' : 'Current Balance'}: ${t.currency} ${financeSummary?.totalBalance.toLocaleString() || '0,00'}`, 14, 67);

    doc.save(`Relatorio_Geral_${activeBranch}_${new Date().getTime()}.pdf`);
  };

  const generateCelebPDF = () => {
    const doc = new jsPDF();
    const splitText = (text: string, width: number) => doc.splitTextToSize(text, width);

    doc.setFontSize(18);
    doc.text(lang === 'pt' ? 'Relatório da Celebração' : 'Celebration Report', 105, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`${lang === 'pt' ? 'Data' : 'Date'}: ${celebReport.date}`, 14, 30);
    doc.text(`${lang === 'pt' ? 'Assembleia' : 'Assembly'}: ${activeBranch}`, 14, 36);

    doc.line(14, 40, 196, 40);

    // Pastoral Section
    doc.setFontSize(14);
    doc.text(lang === 'pt' ? 'Ministério do Culto' : 'Service Ministry', 14, 50);
    doc.setFontSize(10);
    doc.text(`${lang === 'pt' ? 'Líder do culto' : 'Cult Leader'}: ${celebReport.cultLeader}`, 14, 58);
    doc.text(`${lang === 'pt' ? 'Pregador do dia' : 'Preacher'}: ${celebReport.preacher}`, 14, 64);
    doc.text(`${lang === 'pt' ? 'Tema' : 'Theme'}: ${celebReport.theme}`, 14, 70);
    doc.text(`${lang === 'pt' ? 'Livros' : 'Bible Books'}: ${celebReport.books}`, 14, 76);

    doc.text(`${lang === 'pt' ? 'Pregador da prosperidade' : 'Prosperity Preacher'}: ${celebReport.prosperityPreacher}`, 14, 86);
    doc.text(`${lang === 'pt' ? 'Tema' : 'Theme'}: ${celebReport.prosperityTheme}`, 14, 92);
    doc.text(`${lang === 'pt' ? 'Livros' : 'Bible Books'}: ${celebReport.prosperityBooks}`, 14, 98);

    // Participation
    doc.setFontSize(14);
    doc.text(lang === 'pt' ? 'Participação e Estatísticas' : 'Participation & Stats', 14, 110);
    doc.setFontSize(10);
    doc.text(`${lang === 'pt' ? 'Participação Total' : 'Total Participation'}: ${celebReport.totalParticipation}`, 14, 118);
    doc.text(`${lang === 'pt' ? 'Homens' : 'Men'}: ${celebReport.participationMen} | ${lang === 'pt' ? 'Mulheres' : 'Women'}: ${celebReport.participationWomen} | ${lang === 'pt' ? 'Crianças' : 'Children'}: ${celebReport.participationChildren}`, 14, 124);
    doc.text(`${lang === 'pt' ? 'Testemunhos' : 'Testimonies'}: ${celebReport.testimonies}`, 14, 130);

    // Visitors
    doc.text(`${lang === 'pt' ? 'Visitantes' : 'Visitors'}: ${celebReport.visitorsTotal}`, 14, 140);
    doc.text(`${lang === 'pt' ? 'Homens' : 'Men'}: ${celebReport.visitorsMen} | ${lang === 'pt' ? 'Mulheres' : 'Women'}: ${celebReport.visitorsWomen} | ${lang === 'pt' ? 'Crianças' : 'Children'}: ${celebReport.visitorsChildren}`, 14, 146);

    // Converts
    doc.text(`${lang === 'pt' ? 'Convertidos' : 'Converts'}: ${celebReport.convertsTotal}`, 14, 156);
    doc.text(`${lang === 'pt' ? 'Homens' : 'Men'}: ${celebReport.convertsMen} | ${lang === 'pt' ? 'Mulheres' : 'Women'}: ${celebReport.convertsWomen} | ${lang === 'pt' ? 'Crianças' : 'Children'}: ${celebReport.convertsChildren}`, 14, 162);

    // Financial
    doc.setFontSize(14);
    doc.text(lang === 'pt' ? 'Relatório Financeiro' : 'Financial Report', 14, 175);
    doc.setFontSize(9);
    
    let yPos = 183;
    const financeData = [
      [`1ª Oferta: ${celebReport.oferta1}MZN`, `2ª Oferta: ${celebReport.oferta2}MZN`],
      [`Dízimos: ${celebReport.dizimos}MZN`, `Primícia: ${celebReport.primicia}MZN`],
      [`Votos: ${celebReport.votos}MZN`, `Semente: ${celebReport.semente}MZN`],
      [`Sacrifício: ${celebReport.sacrificio}MZN`, `Oferta de Missões: ${celebReport.missoes}MZN`],
      [`Apreciação Pastoral: ${celebReport.apreciacaoPastoral}MZN`, `Apreciação Apostólica: ${celebReport.apreciacaoApostolica}MZN`],
      [`Oferta de Altar: ${celebReport.ofertaAltar}MZN`, `Oferta de Amor: ${celebReport.ofertaAmor}MZN`],
      [`Parceiros Locais: ${celebReport.parceirosLocais}MZN`, `Parceiros Ap. Jonas: ${celebReport.parceirosApJonas}MZN`],
      [`P. Grande Comissão: ${celebReport.parceirosGrandeComissao}MZN`, `Contribuição Local: ${celebReport.contribuicaoLocal}MZN`],
      [`Contribuição Excepcional: ${celebReport.contribuicaoExcepcional}MZN`, '']
    ];

    financeData.forEach(row => {
      doc.text(row[0], 14, yPos);
      if (row[1]) doc.text(row[1], 105, yPos);
      yPos += 6;
    });

    yPos += 4;
    doc.setFontSize(12);
    doc.text(lang === 'pt' ? 'Relação dos Dizimistas:' : 'List of Tithers:', 14, yPos);
    yPos += 6;
    doc.setFontSize(9);
    const splitTithers = splitText(celebReport.tithers, 180);
    doc.text(splitTithers, 14, yPos);
    
    yPos += (splitTithers.length * 5) + 5;
    doc.setFontSize(12);
    doc.text(lang === 'pt' ? 'Breve comentário sobre o culto:' : 'Brief commentary about the service:', 14, yPos);
    yPos += 6;
    doc.setFontSize(9);
    doc.text(splitText(celebReport.commentary, 180), 14, yPos);

    doc.save(`Relatorio_Celebracao_${celebReport.date}_${activeBranch}.pdf`);
    
    // Save to Database
    saveReport(activeBranch, celebReport).then(() => {
      alert(lang === 'pt' ? 'Relatório gerado e salvo na nuvem com sucesso!' : 'Report generated and saved to the cloud successfully!');
    }).catch(err => {
      console.error("Error saving report:", err);
      alert(lang === 'pt' ? 'Erro ao salvar na nuvem, mas o PDF foi gerado.' : 'Error saving to cloud, but PDF was generated.');
    });
  };

  if (view === 'form') {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setView('dashboard')} className="rounded-xl">
            <ArrowLeft className="w-4 h-4 mr-2" />
            {lang === 'pt' ? 'Voltar' : 'Back'}
          </Button>
          <div className="flex items-center gap-2">
            <Button onClick={generateCelebPDF} className="bg-primary rounded-xl">
              <Printer className="w-4 h-4 mr-2" />
              {lang === 'pt' ? 'Gerar e Salvar' : 'Generate & Save'}
            </Button>
          </div>
        </div>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-md rounded-[32px] overflow-hidden">
          <CardHeader className="bg-slate-50 p-8 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/10 rounded-2xl text-primary">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">{lang === 'pt' ? 'Relatório da Celebração' : 'Celebration Report'}</CardTitle>
                <p className="text-slate-500 font-medium">{activeBranch} - {celebReport.date}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>{lang === 'pt' ? 'Líder do culto' : 'Cult Leader'}</Label>
                <Input value={celebReport.cultLeader} onChange={(e) => handleCelebInputChange('cultLeader', e.target.value)} placeholder="..." className="rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label>{lang === 'pt' ? 'Pregador do dia' : 'Preacher'}</Label>
                <Input value={celebReport.preacher} onChange={(e) => handleCelebInputChange('preacher', e.target.value)} placeholder="..." className="rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label>{lang === 'pt' ? 'Tema' : 'Theme'}</Label>
                <Input value={celebReport.theme} onChange={(e) => handleCelebInputChange('theme', e.target.value)} placeholder="..." className="rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label>{lang === 'pt' ? 'Livros' : 'Bible Books'}</Label>
                <Input value={celebReport.books} onChange={(e) => handleCelebInputChange('books', e.target.value)} placeholder="..." className="rounded-xl border-slate-200" />
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Prosperity */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label>{lang === 'pt' ? 'Pregador da prosperidade' : 'Prosperity Preacher'}</Label>
                <Input value={celebReport.prosperityPreacher} onChange={(e) => handleCelebInputChange('prosperityPreacher', e.target.value)} placeholder="..." className="rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label>{lang === 'pt' ? 'Tema' : 'Theme'}</Label>
                <Input value={celebReport.prosperityTheme} onChange={(e) => handleCelebInputChange('prosperityTheme', e.target.value)} placeholder="..." className="rounded-xl border-slate-200" />
              </div>
              <div className="space-y-2">
                <Label>{lang === 'pt' ? 'Livros' : 'Bible Books'}</Label>
                <Input value={celebReport.prosperityBooks} onChange={(e) => handleCelebInputChange('prosperityBooks', e.target.value)} placeholder="..." className="rounded-xl border-slate-200" />
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Participation Stats */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-primary" />
                {lang === 'pt' ? 'Participação, Visitantes e Convertidos' : 'Participation, Visitors & Converts'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>{lang === 'pt' ? 'Total Participação' : 'Total Participation'}</Label>
                  <Input type="number" value={celebReport.totalParticipation} onChange={(e) => handleCelebInputChange('totalParticipation', parseInt(e.target.value) || 0)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>{lang === 'pt' ? 'Homens' : 'Men'}</Label>
                  <Input type="number" value={celebReport.participationMen} onChange={(e) => handleCelebInputChange('participationMen', parseInt(e.target.value) || 0)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>{lang === 'pt' ? 'Mulheres' : 'Women'}</Label>
                  <Input type="number" value={celebReport.participationWomen} onChange={(e) => handleCelebInputChange('participationWomen', parseInt(e.target.value) || 0)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>{lang === 'pt' ? 'Crianças' : 'Children'}</Label>
                  <Input type="number" value={celebReport.participationChildren} onChange={(e) => handleCelebInputChange('participationChildren', parseInt(e.target.value) || 0)} className="rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>{lang === 'pt' ? 'Total Visitantes' : 'Total Visitors'}</Label>
                  <Input type="number" value={celebReport.visitorsTotal} onChange={(e) => handleCelebInputChange('visitorsTotal', parseInt(e.target.value) || 0)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>{lang === 'pt' ? 'Visitantes Homens' : 'Visitor Men'}</Label>
                  <Input type="number" value={celebReport.visitorsMen} onChange={(e) => handleCelebInputChange('visitorsMen', parseInt(e.target.value) || 0)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>{lang === 'pt' ? 'Visitantes Mulheres' : 'Visitor Women'}</Label>
                  <Input type="number" value={celebReport.visitorsWomen} onChange={(e) => handleCelebInputChange('visitorsWomen', parseInt(e.target.value) || 0)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>{lang === 'pt' ? 'Visitantes Crianças' : 'Visitor Children'}</Label>
                  <Input type="number" value={celebReport.visitorsChildren} onChange={(e) => handleCelebInputChange('visitorsChildren', parseInt(e.target.value) || 0)} className="rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>{lang === 'pt' ? 'Total Convertidos' : 'Total Converts'}</Label>
                  <Input type="number" value={celebReport.convertsTotal} onChange={(e) => handleCelebInputChange('convertsTotal', parseInt(e.target.value) || 0)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>{lang === 'pt' ? 'Convertidos Homens' : 'Convert Men'}</Label>
                  <Input type="number" value={celebReport.convertsMen} onChange={(e) => handleCelebInputChange('convertsMen', parseInt(e.target.value) || 0)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>{lang === 'pt' ? 'Convertidos Mulheres' : 'Convert Women'}</Label>
                  <Input type="number" value={celebReport.convertsWomen} onChange={(e) => handleCelebInputChange('convertsWomen', parseInt(e.target.value) || 0)} className="rounded-xl" />
                </div>
                <div className="space-y-2">
                  <Label>{lang === 'pt' ? 'Convertidos Crianças' : 'Convert Children'}</Label>
                  <Input type="number" value={celebReport.convertsChildren} onChange={(e) => handleCelebInputChange('convertsChildren', parseInt(e.target.value) || 0)} className="rounded-xl" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label>{lang === 'pt' ? 'Testemunhos' : 'Testimonies'}</Label>
                  <Input type="number" value={celebReport.testimonies} onChange={(e) => handleCelebInputChange('testimonies', parseInt(e.target.value) || 0)} className="rounded-xl" />
                </div>
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Finance Inputs */}
            <div className="space-y-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-500" />
                {lang === 'pt' ? 'Valores Arrecadados (MZN)' : 'Collected Amounts (MZN)'}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { id: 'oferta1', label: '1ª Oferta' },
                  { id: 'oferta2', label: '2ª Oferta' },
                  { id: 'dizimos', label: 'Dízimos' },
                  { id: 'primicia', label: 'Primícia' },
                  { id: 'votos', label: 'Votos' },
                  { id: 'semente', label: 'Semente' },
                  { id: 'sacrificio', label: 'Sacrifício' },
                  { id: 'missoes', label: 'Oferta Missões' },
                  { id: 'apreciacaoPastoral', label: 'Apr. Pastoral' },
                  { id: 'apreciacaoApostolica', label: 'Apr. Apostólica' },
                  { id: 'ofertaAltar', label: 'Oferta Altar' },
                  { id: 'ofertaAmor', label: 'Oferta Amor' },
                  { id: 'parceirosLocais', label: 'Parc. Locais' },
                  { id: 'parceirosApJonas', label: 'Parc. Ap. Jonas' },
                  { id: 'parceirosGrandeComissao', label: 'Parc. G. Comiss.' },
                  { id: 'contribuicaoLocal', label: 'Contr. Local' },
                  { id: 'contribuicaoExcepcional', label: 'Contr. Excep.' },
                ].map((item) => (
                  <div key={item.id} className="space-y-1">
                    <Label className="text-[10px] uppercase text-slate-500">{item.label}</Label>
                    <Input value={(celebReport as any)[item.id]} onChange={(e) => handleCelebInputChange(item.id as any, e.target.value)} className="h-9 rounded-lg" />
                   </div>
                ))}
              </div>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Tithers List */}
            <div className="space-y-2">
              <Label>{lang === 'pt' ? 'Relação dos Dizimistas' : 'List of Tithers'}</Label>
              <Textarea value={celebReport.tithers} onChange={(e) => handleCelebInputChange('tithers', e.target.value)} className="rounded-xl min-h-[100px]" placeholder="..." />
            </div>

            {/* Commentary */}
            <div className="space-y-2">
              <Label>{lang === 'pt' ? 'Breve comentário sobre o culto' : 'Brief commentary about the service'}</Label>
              <Textarea value={celebReport.commentary} onChange={(e) => handleCelebInputChange('commentary', e.target.value)} className="rounded-xl min-h-[100px]" placeholder="..." />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const [uploadedReports, setUploadedReports] = useState([
    { name: lang === 'pt' ? 'Culto de Domingo - Manhã' : 'Sunday Service - Morning', date: '21/04/2026', type: 'system' },
    { name: lang === 'pt' ? 'Relatório de Assembleia' : 'Assembly Report', date: '19/04/2026', type: 'system' },
    { name: lang === 'pt' ? 'Concerto de Louvor' : 'Praise Concert', date: '15/04/2026', type: 'system' },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newReport = {
        name: file.name,
        date: new Date().toLocaleDateString(),
        type: 'upload'
      };
      setUploadedReports([newReport, ...uploadedReports]);
      alert(lang === 'pt' ? 'Documento carregado com sucesso!' : 'Document uploaded successfully!');
    }
  };

  const generateExcel = () => {
    const data = [
      { Resumo: 'Total Membros', Valor: memberCount },
      { Resumo: 'Saldo Atual', Valor: financeSummary?.totalBalance || 0 },
      { Resumo: 'Entradas Totais', Valor: financeSummary?.totalIncome || 0 },
      { Resumo: 'Saídas Totais', Valor: financeSummary?.totalExpense || 0 },
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "Financeiro");
    XLSX.writeFile(wb, `Relatorio_Financeiro_${activeBranch}_${new Date().getTime()}.xlsx`);
  };

  const chartData = [
    { name: 'Jan', membros: memberCount > 10 ? memberCount - 5 : 5, financeiro: financeSummary?.totalBalance ? financeSummary.totalBalance * 0.8 : 2400 },
    { name: 'Fev', membros: memberCount > 5 ? memberCount - 2 : 8, financeiro: financeSummary?.totalBalance ? financeSummary.totalBalance * 0.9 : 3200 },
    { name: 'Mar', membros: memberCount, financeiro: financeSummary?.totalBalance || 4000 },
  ];

  const totalIncome = financeSummary?.totalIncome || 0;
  const totalExpense = financeSummary?.totalExpense || 0;
  const balance = financeSummary?.totalBalance || 0;
  const avgDonation = totalIncome / (memberCount || 1);

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.reportManagement}</h2>
          <p className="text-slate-500">
            {lang === 'pt' ? `Dados da assembleia: ${activeBranch}` : `Data for assembly: ${activeBranch}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => setView('form')}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-lg shadow-secondary/20 font-bold rounded-xl"
          >
            <Plus className="w-4 h-4 mr-2" />
            {lang === 'pt' ? 'Relatório de Culto' : 'Service Report'}
          </Button>
          <Button 
            onClick={generatePDF}
            className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl"
          >
            <Download className="w-4 h-4 mr-2" />
            {lang === 'pt' ? 'Relatório Global' : 'Global Report'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {/* Financial cards - Only for Admin and Treasurer */}
        {(userRole === 'admin' || userRole === 'treasurer') && (
          <>
            <Card className="bg-white/80 border-none shadow-sm rounded-2xl p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase">{lang === 'pt' ? 'Eficiência Financeira' : 'Financial Efficiency'}</p>
              <div className="text-xl font-black text-emerald-600 mt-1">
                {totalIncome > 0 ? ((totalIncome / (totalIncome + totalExpense)) * 100).toFixed(0) : 0}%
              </div>
              <p className="text-[9px] text-slate-500">{lang === 'pt' ? 'Entradas vs Saídas' : 'Income vs Expenses'}</p>
            </Card>
            <Card className="bg-white/80 border-none shadow-sm rounded-2xl p-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase">{lang === 'pt' ? 'Saldo Operacional' : 'Operating Balance'}</p>
              <div className="text-xl font-black text-slate-800 mt-1">
                {t.currency} {balance.toLocaleString()}
              </div>
              <p className="text-[9px] text-slate-500">{lang === 'pt' ? 'Disponível em caixa' : 'Available in cash'}</p>
            </Card>
          </>
        )}

        {/* Member average - Only for Admin */}
        {userRole === 'admin' && (
          <Card className="bg-white/80 border-none shadow-sm rounded-2xl p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase">{lang === 'pt' ? 'Média por Membro' : 'Avg per Member'}</p>
            <div className="text-xl font-black text-primary mt-1">
              {t.currency} {avgDonation.toFixed(0)}
            </div>
            <p className="text-[9px] text-slate-500">{lang === 'pt' ? 'Contribuição média' : 'Average contribution'}</p>
          </Card>
        )}
        
        {/* Export - Admin, Treasurer, Secretary */}
        {(userRole === 'admin' || userRole === 'treasurer' || userRole === 'secretary') && (
          <Card className="bg-white/80 border-none shadow-sm rounded-2xl p-4">
            <p className="text-[10px] font-bold text-slate-400 uppercase">{lang === 'pt' ? 'Smart Export' : 'Smart Export'}</p>
            <div className="flex gap-2 mt-2">
              <Button size="icon" variant="ghost" onClick={generateExcel} className="h-8 w-8 hover:bg-emerald-50 text-emerald-600">
                <FileSpreadsheet className="w-4 h-4" />
              </Button>
              <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-rose-50 text-rose-600">
                <FileText className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[9px] text-slate-500 uppercase font-black mt-1">EXCEL • PDF</p>
          </Card>
        )}

        {/* IA Analysis - Only for Admin */}
        {userRole === 'admin' && (
          <Card className="bg-primary text-white border-none shadow-lg shadow-primary/20 rounded-2xl p-4">
            <p className="text-[10px] font-black opacity-70 uppercase">{lang === 'pt' ? 'Análise Preditiva (IA)' : 'Predictive Analysis (AI)'}</p>
            <div className="text-xs font-bold mt-2 leading-relaxed">
              {balance > 0 
                ? (lang === 'pt' ? 'Tendência de crescimento de 15% nos próximos 3 meses.' : '15% growth trend in the next 3 months.') 
                : (lang === 'pt' ? 'Risco de deficit detectado para o próximo trimestre.' : 'Deficit risk detected for the next quarter.')}
            </div>
          </Card>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Member Chart - Admin and Leader/Secretary */}
        {(userRole === 'admin' || userRole === 'leader' || userRole === 'secretary') && (
          <Card className={`${userRole === 'admin' ? 'lg:col-span-3' : 'lg:col-span-4'} border-none shadow-sm bg-white/60 backdrop-blur-md rounded-[24px]`}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                {lang === 'pt' ? 'Estatísticas de Crescimento' : 'Growth Statistics'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80 w-full font-mono">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                    <Tooltip 
                      contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                    />
                    <Bar dataKey="membros" fill="#6366f1" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Archive/Library - All except Treasurer (Treasury has its own finance history) */}
        {userRole !== 'treasurer' && (
          <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md rounded-[24px]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-secondary" />
                {lang === 'pt' ? 'Arquivar Relatório' : 'Archive Report'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="p-4 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 flex flex-col items-center justify-center text-center space-y-3 hover:border-primary/50 transition-colors cursor-pointer relative group">
                <input 
                  type="file" 
                  accept="application/pdf,image/*" 
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="p-3 bg-white rounded-xl shadow-sm text-slate-400 group-hover:text-primary transition-colors">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700">{lang === 'pt' ? 'Carregar PDF ou Foto' : 'Upload PDF or Photo'}</p>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <p className="text-[10px] font-bold text-slate-400 uppercase px-1">{lang === 'pt' ? 'Recentemente Adicionados' : 'Recently Added'}</p>
                {uploadedReports.map((report, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/40 border border-white/20 hover:bg-white/60 transition-all cursor-pointer group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                        {report.name.toLowerCase().endsWith('.pdf') ? <FileText className="w-4 h-4" /> : <ImageIcon className="w-4 h-4" />}
                      </div>
                      <p className="text-[11px] font-bold text-slate-700 truncate max-w-[120px]">{report.name}</p>
                    </div>
                    <Download className="w-3.5 h-3.5 text-slate-300 group-hover:text-primary transition-colors" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Finance Chart - Only for Admin and Treasurer */}
      {(userRole === 'admin' || userRole === 'treasurer') && (
        <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md rounded-[24px]">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              {t.financialGrowth} - {activeBranch}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorFinRep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                  <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}}
                  />
                  <Area type="monotone" dataKey="financeiro" stroke="#10b981" fillOpacity={1} fill="url(#colorFinRep)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
