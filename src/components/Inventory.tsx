import { useState, useEffect } from 'react';
import { Box, Plus, Search, Filter, Hammer, Trash2, Edit, AlertTriangle, Receipt, User, Calendar, CreditCard, Download, QrCode as QrIcon, ScanLine, X } from 'lucide-react';
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
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { jsPDF } from 'jspdf';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface Asset {
  id: string;
  name: string;
  category: string;
  status: 'bom estado' | 'avariado' | 'obsoleto' | 'vendido';
  date: string;
  value: string;
}

interface RentalData {
  renterName: string;
  renterId: string;
  renterPhone: string;
  rentalDate: string;
  returnDate: string;
  amount: string;
}

const mockAssets: Asset[] = [
  { id: '1', name: 'Mesa de Som Berhinger 32 Canais', category: 'Som', status: 'bom estado', date: '2023-10-15', value: '45.000' },
  { id: '2', name: 'Guitarra Fender Stratocaster', category: 'Instrumentos', status: 'avariado', date: '2024-01-20', value: '120.000' },
  { id: '3', name: 'Projetor Epson 5000 Lumens', category: 'Vídeo', status: 'bom estado', date: '2023-05-10', value: '35.000' },
  { id: '4', name: 'Cadeiras Estofadas (100 un.)', category: 'Mobiliário', status: 'bom estado', date: '2022-12-01', value: '150.000' },
];

interface InventoryProps {
  lang: Language;
}

export default function Inventory({ lang }: InventoryProps) {
  const t = translations[lang];
  const [assets, setAssets] = useState<Asset[]>(mockAssets);
  const [isRentalOpen, setIsRentalOpen] = useState(false);
  const [isQrOpen, setIsQrOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [rentalData, setRentalData] = useState<RentalData>({
    renterName: '',
    renterId: '',
    renterPhone: '',
    rentalDate: new Date().toISOString().split('T')[0],
    returnDate: '',
    amount: '0'
  });

  useEffect(() => {
    if (isScannerOpen) {
      const scanner = new Html5QrcodeScanner(
        "qr-reader",
        { fps: 10, qrbox: { width: 250, height: 250 } },
        false
      );
      
      scanner.render((decodedText) => {
        alert(`${lang === 'pt' ? 'Ativo Identificado:' : 'Asset Identified:'} ${decodedText}`);
        scanner.clear();
        setIsScannerOpen(false);
      }, (error) => {
        console.warn(error);
      });

      return () => {
        scanner.clear().catch(err => console.error("Failed to clear scanner", err));
      };
    }
  }, [isScannerOpen, lang]);

  const handleStateChange = (assetId: string, newState: Asset['status']) => {
    setAssets(prev => prev.map(asset => asset.id === assetId ? { ...asset, status: newState } : asset));
  };

  const generateRentalPDF = (asset: Asset, data: RentalData) => {
    const doc = new jsPDF();
    
    // Header
    doc.setFontSize(22);
    doc.setTextColor(30, 41, 59);
    doc.text('COMPROVATIVO DE ALUGUER', 105, 20, { align: 'center' });
    
    doc.setFontSize(10);
    doc.text('CNG SOFTWARE - GESTÃO DE PATRIMÓNIO', 105, 28, { align: 'center' });
    doc.line(14, 35, 196, 35);

    // Asset Info
    doc.setFontSize(14);
    doc.text('INFORMAÇÃO DO BEM', 14, 45);
    doc.setFontSize(12);
    doc.text(`Bem: ${asset.name}`, 14, 53);
    doc.text(`Categoria: ${asset.category}`, 14, 60);
    doc.text(`Identificador: #${asset.id}`, 14, 67);

    // Rental Info
    doc.setFontSize(14);
    doc.text('INFORMAÇÃO DO ALUGUER', 14, 80);
    doc.setFontSize(12);
    doc.text(`Locatário: ${data.renterName}`, 14, 88);
    doc.text(`Documento/ID: ${data.renterId}`, 14, 95);
    doc.text(`Contacto: ${data.renterPhone}`, 14, 102);
    doc.text(`Data de Início: ${data.rentalDate}`, 14, 109);
    doc.text(`Data de Devolução: ${data.returnDate}`, 14, 116);
    doc.text(`Valor do Aluguer: ${t.currency} ${data.amount}`, 14, 123);

    // Footer/Signatures
    doc.line(14, 140, 196, 140);
    doc.setFontSize(10);
    doc.text('Assinatura do Responsável', 40, 155);
    doc.text('Assinatura do Locatário', 140, 155);
    doc.line(14, 150, 80, 150);
    doc.line(114, 150, 180, 150);

    doc.setFontSize(8);
    doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 280);

    doc.save(`Aluguer_${asset.name.replace(/\s+/g, '_')}_${new Date().getTime()}.pdf`);
    setIsRentalOpen(false);
    alert(lang === 'pt' ? 'Comprovativo gerado com sucesso!' : 'Proof of rental generated successfully!');
  };

  const openQrDialog = (asset: Asset) => {
    setSelectedAsset(asset);
    setIsQrOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">{t.inventoryManagement}</h2>
          <p className="text-slate-500 font-medium">
            {lang === 'pt' 
              ? 'Controle o património, equipamentos e bens da igreja.' 
              : 'Control church patrimony, equipment, and assets.'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={() => setIsScannerOpen(true)}
            className="rounded-xl border-primary/20 text-primary hover:bg-primary/10 flex items-center gap-2 px-5 py-6 font-bold uppercase transition-all"
          >
            <ScanLine className="w-5 h-5" />
            {lang === 'pt' ? 'Escanear QR' : 'Scan QR'}
          </Button>
          <Button className="bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 rounded-xl px-6 py-6 font-bold uppercase">
            <Plus className="w-4 h-4 mr-2" />
            {lang === 'pt' ? 'Novo Ativo' : 'New Asset'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: lang === 'pt' ? 'Ativos Totais' : 'Total Assets', value: '452', icon: Box, color: 'text-blue-500' },
          { label: lang === 'pt' ? 'Valor Estimado' : 'Estimated Value', value: `${t.currency} 1.2M`, icon: Box, color: 'text-emerald-500' },
          { label: lang === 'pt' ? 'Em Manutenção' : 'Under Maintenance', value: '8', icon: AlertTriangle, color: 'text-amber-500' },
          { label: lang === 'pt' ? 'Novas Aquisições' : 'New Acquisitions', value: '+12', icon: Box, color: 'text-primary' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white/60 backdrop-blur-md">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{stat.label}</p>
                <p className="text-xl font-black text-slate-800 mt-0.5">{stat.value}</p>
              </div>
              <div className={`p-2 rounded-xl bg-slate-50 ${stat.color}`}>
                <stat.icon className="w-5 h-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-96">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder={lang === 'pt' ? 'Buscar no inventário...' : 'Search inventory...'} 
                className="pl-10 bg-white/40 border-none shadow-inner rounded-xl"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl border-slate-200">
                <Filter className="w-4 h-4 mr-2" />
                {lang === 'pt' ? 'Filtrar Categoria' : 'Filter Category'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {assets.map((asset) => (
              <div 
                key={asset.id} 
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-3xl bg-white/40 border border-white/20 hover:bg-white/60 hover:shadow-lg hover:shadow-primary/5 transition-all group gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-slate-100 text-slate-500 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all shadow-sm">
                    <Box className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-black text-slate-800 truncate">{asset.name}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-[9px] font-black uppercase tracking-widest bg-white/50">{asset.category}</Badge>
                      <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">VAL: {t.currency} {asset.value}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center justify-between sm:justify-end gap-3 pt-3 sm:pt-0 border-t sm:border-none border-slate-100">
                  <div className="flex items-center gap-2">
                    <Select 
                      value={asset.status} 
                      onValueChange={(val: Asset['status']) => handleStateChange(asset.id, val)}
                    >
                      <SelectTrigger className="h-9 w-28 rounded-xl bg-white/80 border-none text-[10px] font-black uppercase shadow-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-2xl border-none shadow-2xl">
                        <SelectItem value="bom estado">Bom Estado</SelectItem>
                        <SelectItem value="avariado">Avariado</SelectItem>
                        <SelectItem value="obsoleto">Obsoleto</SelectItem>
                        <SelectItem value="vendido">Vendido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 text-primary hover:bg-primary/10 rounded-xl bg-white/50"
                      onClick={() => openQrDialog(asset)}
                    >
                      <QrIcon className="w-5 h-5" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-10 px-4 text-emerald-600 border-emerald-100 hover:bg-emerald-50 rounded-xl bg-white/50 flex items-center gap-2 font-black text-[10px] uppercase tracking-widest"
                      onClick={() => {
                        setSelectedAsset(asset);
                        setIsRentalOpen(true);
                      }}
                    >
                      <Receipt className="w-4 h-4" />
                      {lang === 'pt' ? 'Alugar' : 'Rent'}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary rounded-xl bg-white/50">
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Rental Dialog */}
      <Dialog open={isRentalOpen} onOpenChange={setIsRentalOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[32px] border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <Receipt className="w-5 h-5 text-primary" />
              {lang === 'pt' ? 'Registrar Aluguer de Bem' : 'Register Asset Rental'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="p-4 bg-slate-50 rounded-2xl flex items-center gap-3">
              <Box className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase">Bem para alugar</p>
                <p className="text-sm font-black text-slate-800">{selectedAsset?.name}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <User className="w-3 h-3" /> {lang === 'pt' ? 'Nome do Locatário' : 'Renter Name'}
                </Label>
                <Input 
                  value={rentalData.renterName}
                  onChange={(e) => setRentalData(p => ({ ...p, renterName: e.target.value }))}
                  placeholder="Ex: João Silva" 
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label>{lang === 'pt' ? 'BI / Identificação' : 'ID / Identification'}</Label>
                <Input 
                  value={rentalData.renterId}
                  onChange={(e) => setRentalData(p => ({ ...p, renterId: e.target.value }))}
                  placeholder="000000000X" 
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{lang === 'pt' ? 'Contacto' : 'Phone'}</Label>
                <Input 
                  value={rentalData.renterPhone}
                  onChange={(e) => setRentalData(p => ({ ...p, renterPhone: e.target.value }))}
                  placeholder="+258 ..." 
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <CreditCard className="w-3 h-3" /> {lang === 'pt' ? 'Valor do Aluguer' : 'Rental Value'}
                </Label>
                <Input 
                  type="number"
                  value={rentalData.amount}
                  onChange={(e) => setRentalData(p => ({ ...p, amount: e.target.value }))}
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {lang === 'pt' ? 'Data de Início' : 'Start Date'}
                </Label>
                <Input 
                  type="date"
                  value={rentalData.rentalDate}
                  onChange={(e) => setRentalData(p => ({ ...p, rentalDate: e.target.value }))}
                  className="rounded-xl border-slate-200"
                />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {lang === 'pt' ? 'Data de Entrega' : 'Return Date'}
                </Label>
                <Input 
                  type="date"
                  value={rentalData.returnDate}
                  onChange={(e) => setRentalData(p => ({ ...p, returnDate: e.target.value }))}
                  className="rounded-xl border-slate-200"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRentalOpen(false)} className="rounded-xl font-bold">
              {lang === 'pt' ? 'Cancelar' : 'Cancel'}
            </Button>
            <Button 
              onClick={() => selectedAsset && generateRentalPDF(selectedAsset, rentalData)}
              className="bg-primary hover:bg-primary/90 font-bold rounded-xl shadow-lg shadow-primary/10 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {lang === 'pt' ? 'Gerar Comprovativo' : 'Generate Proof'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* QR Code Display Dialog */}
      <Dialog open={isQrOpen} onOpenChange={setIsQrOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
          <div className="p-8 flex flex-col items-center">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6">
              <QrIcon className="w-8 h-8" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-800 text-center mb-1">
              Registro Patrimonial
            </DialogTitle>
            <p className="text-sm text-slate-500 font-medium mb-8 uppercase tracking-widest text-center">
              {selectedAsset?.name}
            </p>
            
            <div className="p-6 bg-white rounded-3xl shadow-inner border border-slate-50 mb-8">
              {selectedAsset && (
                <QRCodeSVG 
                  value={`asset:${selectedAsset.id}:${selectedAsset.name}`}
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              )}
            </div>
            
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center max-w-[200px]">
              Escaneie este código para identificar o bem instantaneamente.
            </p>
          </div>
          
          <div className="bg-slate-50 p-4 border-t border-slate-100 flex justify-center">
            <Button variant="ghost" onClick={() => setIsQrOpen(false)} className="rounded-xl font-bold text-slate-500 uppercase text-xs">
              Fechar Código
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Scanner Dialog */}
      <Dialog open={isScannerOpen} onOpenChange={setIsScannerOpen}>
        <DialogContent className="sm:max-w-[500px] rounded-[32px] border-none shadow-2xl p-0 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <ScanLine className="w-5 h-5" />
              </div>
              <DialogTitle className="text-lg font-bold">Leitor de Património</DialogTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setIsScannerOpen(false)} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>
          
          <div className="p-4 bg-slate-100">
            <div id="qr-reader" className="w-full rounded-2xl overflow-hidden shadow-inner bg-black border-4 border-white"></div>
          </div>
          
          <div className="p-6 bg-white space-y-4">
            <div className="flex items-center gap-4 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                <QrIcon className="w-5 h-5" />
              </div>
              <p className="text-xs text-blue-800 leading-relaxed font-medium">
                Posicione o código QR do objeto no centro do visor para identificação automática.
              </p>
            </div>
            <Button variant="outline" onClick={() => setIsScannerOpen(false)} className="w-full rounded-xl py-6 font-bold uppercase tracking-widest text-slate-500 border-slate-200">
              Cancelar Leitura
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
