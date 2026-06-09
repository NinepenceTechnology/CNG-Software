import { useState } from 'react';
import { CreditCard, Smartphone, ShieldCheck, TrendingUp, DollarSign, Wallet, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { translations, Language } from '@/src/translations';

interface PaymentsProps {
  lang: Language;
}

export default function Payments({ lang }: PaymentsProps) {
  const t = translations[lang];
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handlePayment = () => {
    if (!amount || !method) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] space-y-6 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-24 h-24 bg-emerald-500 rounded-full flex items-center justify-center shadow-xl shadow-emerald-500/20">
          <CheckCircle2 className="w-12 h-12 text-white" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-slate-800">
            {lang === 'pt' ? 'Doação Confirmada!' : 'Donation Confirmed!'}
          </h2>
          <p className="text-slate-500 mt-2">
            {lang === 'pt' 
              ? `A sua doação de ${t.currency} ${amount} foi recebida com gratidão. Que Deus abençoe!` 
              : `Your donation of ${t.currency} ${amount} was received with gratitude. God bless!`}
          </p>
        </div>
        <Button 
          onClick={() => { setIsSuccess(false); setAmount(''); setMethod(''); }}
          className="bg-primary px-8 rounded-2xl font-bold"
        >
          {lang === 'pt' ? 'Fazer Outra Doação' : 'Make Another Donation'}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">{t.donations}</h2>
          <p className="text-slate-500">
            {lang === 'pt' 
              ? 'Contribua para a obra de Deus através de dízimos, ofertas e doações online.' 
              : 'Contribute to God\'s work through online tithes, offerings, and donations.'}
          </p>
        </div>
        <Badge variant="outline" className="bg-emerald-50 text-emerald-600 border-none font-bold py-1 px-4">
          <ShieldCheck className="w-3 h-3 mr-1" /> 
          {lang === 'pt' ? 'Pagamento Seguro' : 'Secure Payment'}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800">
                {lang === 'pt' ? '1. Valor da Doação' : '1. Donation Amount'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-slate-400 text-xl">{t.currency}</span>
                <Input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0,00" 
                  className="pl-14 h-16 text-3xl font-black rounded-3xl bg-slate-50 border-none text-slate-800 focus:ring-4 focus:ring-primary/20"
                />
              </div>
              <div className="grid grid-cols-4 gap-3">
                {['50', '200', '500', '1000'].map(val => (
                  <Button 
                    key={val}
                    variant="outline" 
                    onClick={() => setAmount(val)}
                    className="rounded-2xl font-bold border-slate-200 hover:border-primary hover:text-primary transition-all"
                  >
                    +{val}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md">
            <CardHeader>
              <CardTitle className="text-lg font-bold text-slate-800">
                {lang === 'pt' ? '2. Método de Pagamento' : '2. Payment Method'}
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <button 
                onClick={() => {
                  setMethod('mpesa');
                  alert('M-PESA 585131 - IGREJA CENTRO DA NOVA GERAÇÃO');
                }}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 group ${
                  method === 'mpesa' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="flex gap-1">
                  <Smartphone className={`w-8 h-8 ${method === 'mpesa' ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <div className="w-8 h-8 rounded-lg overflow-hidden flex flex-col border border-slate-100">
                    <div className="flex-1 bg-[#E21A21]"></div>
                    <div className="flex-1 bg-[#FBB040]"></div>
                  </div>
                </div>
                <span className={`font-bold text-xs ${method === 'mpesa' ? 'text-primary' : 'text-slate-600'}`}>M-PESA / EMOLA</span>
              </button>
              <button 
                onClick={() => setMethod('bim')}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 group ${
                  method === 'bim' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">BIM</div>
                <span className={`font-bold text-xs ${method === 'bim' ? 'text-primary' : 'text-slate-600'}`}>MILLENNIUM BIM</span>
              </button>
              <button 
                onClick={() => setMethod('bci')}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 group ${
                  method === 'bci' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-[10px]">BCI</div>
                <span className={`font-bold text-xs ${method === 'bci' ? 'text-primary' : 'text-slate-600'}`}>BCI NET</span>
              </button>
              <button 
                onClick={() => setMethod('card')}
                className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-2 group ${
                  method === 'card' ? 'border-primary bg-primary/5' : 'border-slate-100 hover:border-slate-300'
                }`}
              >
                <CreditCard className={`w-8 h-8 ${method === 'card' ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'}`} />
                <span className={`font-bold text-xs ${method === 'card' ? 'text-primary' : 'text-slate-600'}`}>VISA/MC</span>
              </button>
            </CardContent>
          </Card>

          <Button 
            onClick={handlePayment}
            disabled={!amount || !method || isProcessing}
            className="w-full h-16 rounded-3xl bg-primary hover:bg-primary/90 text-lg font-black shadow-xl shadow-primary/20 transition-all group overflow-hidden relative"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2 animate-pulse">
                {lang === 'pt' ? 'Processando...' : 'Processing...'}
              </span>
            ) : (
              <span className="flex items-center gap-2">
                {lang === 'pt' ? 'Confirmar Doação' : 'Confirm Donation'}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            )}
            {isProcessing && <div className="absolute inset-x-0 bottom-0 h-1 bg-white/30 animate-[loading_2s_infinite]"></div>}
          </Button>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative">
            <CardHeader>
              <CardTitle className="text-lg font-bold flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-400" />
                {lang === 'pt' ? 'Resumo de Contribuição' : 'Contribution Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 relative z-10">
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">{lang === 'pt' ? 'Total Este Mês' : 'Total This Month'}</p>
                  <p className="text-4xl font-black mt-1 leading-none">{t.currency} 125,500</p>
                </div>
                <div className="flex items-center gap-1 text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-lg text-xs font-bold">
                  <TrendingUp className="w-3 h-3" /> +12%
                </div>
              </div>
              
              <div className="pt-6 border-t border-white/10 space-y-4">
                {[
                  { label: lang === 'pt' ? 'Dízimos' : 'Tithes', value: '85.200' },
                  { label: lang === 'pt' ? 'Ofertas' : 'Offerings', value: '32.150' },
                  { label: lang === 'pt' ? 'Outras' : 'Others', value: '8.150' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-400 font-medium">{item.label}</span>
                    <span className="font-bold">{t.currency} {item.value}</span>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="absolute top-[-10px] right-[-10px] opacity-10">
              <DollarSign className="w-40 h-40" />
            </div>
          </Card>

          <Card className="border-none shadow-sm bg-white/60 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-center gap-4 text-slate-500">
                <div className="p-3 bg-slate-100 rounded-2xl">
                  <Smartphone className="w-6 h-6" />
                </div>
                <p className="text-xs leading-relaxed">
                  {method === 'mpesa' ? (
                    <span className="font-black text-slate-800">M-PESA: 585131 - IGREJA CENTRO DA NOVA GERAÇÃO</span>
                  ) : (
                    lang === 'pt' 
                      ? 'Para pagamentos via M-Pesa, você receberá um pedido de confirmação do PIN no seu telemóvel após clicar em confirmar.' 
                      : 'For M-Pesa payments, you will receive a PIN confirmation request on your mobile phone after clicking confirm.'
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
