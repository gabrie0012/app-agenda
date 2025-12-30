
import React, { useState } from 'react';
import { Service, BusinessConfig, Appointment } from '../types';
import { Calendar as CalendarIcon, Clock, ChevronRight, User, Mail, CheckCircle, ArrowLeft } from 'lucide-react';

interface BookingProps {
  business: BusinessConfig;
  services: Service[];
  onBook: (appointment: Omit<Appointment, 'id' | 'status'>) => void;
}

const BookingPage: React.FC<BookingProps> = ({ business, services, onBook }) => {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [clientInfo, setClientInfo] = useState({ name: '', email: '' });
  const [finished, setFinished] = useState(false);

  const availableTimes = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

  const handleBooking = () => {
    if (selectedService && selectedDate && selectedTime && clientInfo.name && clientInfo.email) {
      onBook({
        serviceId: selectedService.id,
        clientName: clientInfo.name,
        clientEmail: clientInfo.email,
        date: selectedDate,
        time: selectedTime,
      });
      setFinished(true);
    }
  };

  if (finished) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-8 text-center space-y-6">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Agendamento Confirmado!</h2>
          <p className="text-slate-600">
            Enviamos um e-mail de confirmação para <strong>{clientInfo.email}</strong> com todos os detalhes.
          </p>
          <div className="bg-slate-50 rounded-xl p-4 text-left space-y-2">
            <p className="text-sm"><strong>Serviço:</strong> {selectedService?.name}</p>
            <p className="text-sm"><strong>Data:</strong> {new Date(selectedDate).toLocaleDateString()}</p>
            <p className="text-sm"><strong>Horário:</strong> {selectedTime}</p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors"
          >
            Fazer outro agendamento
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Business Info Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="h-20 w-20 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg text-2xl font-bold">
            {business.name.charAt(0)}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900">{business.name}</h1>
          <p className="text-slate-500 max-w-md mx-auto">{business.about}</p>
        </div>

        {/* Steps Progress */}
        <div className="flex items-center justify-between mb-8 max-w-xs mx-auto">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center">
              <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${step >= s ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                {s}
              </div>
              {s < 3 && <div className={`h-1 w-12 mx-2 ${step > s ? 'bg-indigo-600' : 'bg-slate-200'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <div className="p-8 space-y-6">
              <h2 className="text-xl font-bold text-slate-800">Selecione o serviço</h2>
              <div className="grid grid-cols-1 gap-4">
                {services.map(service => (
                  <button
                    key={service.id}
                    onClick={() => { setSelectedService(service); setStep(2); }}
                    className="flex items-center justify-between p-6 border border-slate-200 rounded-2xl hover:border-indigo-600 hover:bg-indigo-50/50 transition-all text-left group"
                  >
                    <div>
                      <h3 className="font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">{service.name}</h3>
                      <p className="text-sm text-slate-500 mt-1">{service.duration} min • R$ {service.price}</p>
                    </div>
                    <ChevronRight className="text-slate-300 group-hover:text-indigo-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && (
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <button onClick={() => setStep(1)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-slate-800">Escolha o horário</h2>
              </div>
              
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
                    <CalendarIcon size={16} /> Data
                  </label>
                  <input 
                    type="date" 
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
                    <Clock size={16} /> Horário
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {availableTimes.map(time => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-xl border text-sm font-bold transition-all ${selectedTime === time ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200 hover:border-indigo-600'}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => setStep(3)}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors mt-8"
                >
                  Continuar
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Confirmation Form */}
          {step === 3 && (
            <div className="p-8 space-y-8">
              <div className="flex items-center gap-4 mb-4">
                <button onClick={() => setStep(2)} className="p-2 hover:bg-slate-100 rounded-full text-slate-600">
                  <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-bold text-slate-800">Quase lá! Seus dados</h2>
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
                    <User size={16} /> Nome Completo
                  </label>
                  <input 
                    type="text" 
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
                    placeholder="Seu nome"
                    value={clientInfo.name}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 flex items-center gap-2">
                    <Mail size={16} /> E-mail
                  </label>
                  <input 
                    type="email" 
                    className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
                    placeholder="seu@email.com"
                    value={clientInfo.email}
                    onChange={(e) => setClientInfo(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                  <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Resumo do pedido</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">{selectedService?.name}</span>
                    <span className="font-bold text-slate-800">R$ {selectedService?.price}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Data e Hora</span>
                    <span className="font-bold text-slate-800">{new Date(selectedDate).toLocaleDateString()} às {selectedTime}</span>
                  </div>
                </div>

                <button
                  onClick={handleBooking}
                  disabled={!clientInfo.name || !clientInfo.email}
                  className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
                >
                  Finalizar Agendamento
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
