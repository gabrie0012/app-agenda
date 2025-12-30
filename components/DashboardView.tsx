
import React, { useState, useEffect } from 'react';
import { geminiService } from '../services/geminiService';
import { Appointment, Service } from '../types';
import { TrendingUp, Users, Calendar, DollarSign, Sparkles } from 'lucide-react';

interface DashboardProps {
  appointments: Appointment[];
  services: Service[];
}

const DashboardView: React.FC<DashboardProps> = ({ appointments, services }) => {
  const [aiSummary, setAiSummary] = useState<string>('Gerando resumo inteligente...');

  useEffect(() => {
    const fetchSummary = async () => {
      const summary = await geminiService.getAgendaSummary(appointments);
      setAiSummary(summary);
    };
    fetchSummary();
  }, [appointments]);

  const stats = [
    { label: 'Total de Clientes', value: '42', icon: <Users className="text-blue-500" />, change: '+12%' },
    { label: 'Agendamentos', value: appointments.length.toString(), icon: <Calendar className="text-indigo-500" />, change: '+5%' },
    { label: 'Serviços Ativos', value: services.length.toString(), icon: <TrendingUp className="text-emerald-500" />, change: 'Estável' },
    { label: 'Receita Prevista', value: 'R$ 2.450', icon: <DollarSign className="text-orange-500" />, change: '+18%' },
  ];

  return (
    <div className="space-y-8">
      {/* AI Box */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <Sparkles className="absolute top-4 right-4 text-indigo-300 opacity-50" size={32} />
        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
          Insight da IA
        </h3>
        <p className="text-indigo-50 leading-relaxed max-w-2xl">
          {aiSummary}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-slate-50">{stat.icon}</div>
              <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <h4 className="text-slate-500 text-sm font-medium">{stat.label}</h4>
            <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity / Next Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Próximos Compromissos</h3>
            <button className="text-sm text-indigo-600 font-medium">Ver todos</button>
          </div>
          <div className="divide-y divide-slate-50">
            {appointments.length > 0 ? appointments.slice(0, 5).map((app) => (
              <div key={app.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-400">
                  {app.clientName.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-800">{app.clientName}</p>
                  <p className="text-xs text-slate-500">
                    {services.find(s => s.id === app.serviceId)?.name}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-slate-800">{app.time}</p>
                  <p className="text-xs text-slate-500">{new Date(app.date).toLocaleDateString()}</p>
                </div>
              </div>
            )) : (
              <div className="p-8 text-center text-slate-500 italic">Nenhum agendamento futuro.</div>
            )}
          </div>
        </div>
        
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
          <h3 className="font-semibold text-slate-800 mb-6">Sugestão de Horário</h3>
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-100">
            <p className="text-sm text-amber-800 leading-relaxed">
              Baseado no seu histórico, as terças-feiras às 14h são as mais procuradas. Considere abrir slots extras neste horário.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
