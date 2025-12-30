
import React, { useState } from 'react';
import { Service } from '../types';
import { geminiService } from '../services/geminiService';
import { Plus, Trash2, Edit2, Wand2, Clock, Banknote } from 'lucide-react';

interface ServicesProps {
  services: Service[];
  onAdd: (service: Service) => void;
  onDelete: (id: string) => void;
}

const ServicesView: React.FC<ServicesProps> = ({ services, onAdd, onDelete }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    duration: 60,
    price: 0,
    description: '',
    category: 'Geral'
  });
  const [loadingAi, setLoadingAi] = useState(false);

  const handleGenerateDescription = async () => {
    if (!newService.name) return;
    setLoadingAi(true);
    const desc = await geminiService.generateServiceDescription(newService.name);
    setNewService(prev => ({ ...prev, description: desc }));
    setLoadingAi(false);
  };

  const handleSave = () => {
    if (newService.name && newService.duration && newService.price) {
      onAdd({
        id: Date.now().toString(),
        name: newService.name,
        duration: Number(newService.duration),
        price: Number(newService.price),
        description: newService.description || '',
        category: newService.category || 'Geral'
      } as Service);
      setIsAdding(false);
      setNewService({ name: '', duration: 60, price: 0, description: '', category: 'Geral' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="text-slate-500">Gerencie o catálogo de serviços que seus clientes podem agendar.</p>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700 transition-colors shadow-sm"
        >
          <Plus size={20} />
          Novo Serviço
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-6 rounded-xl border-2 border-indigo-100 shadow-md space-y-4">
          <h3 className="font-semibold text-slate-800 text-lg">Cadastrar Serviço</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Nome do Serviço</label>
              <input 
                type="text"
                value={newService.name}
                onChange={e => setNewService(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Ex: Consultoria de MKT"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Categoria</label>
              <input 
                type="text"
                value={newService.category}
                onChange={e => setNewService(prev => ({ ...prev, category: e.target.value }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                placeholder="Ex: Marketing"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Duração (Minutos)</label>
              <input 
                type="number"
                value={newService.duration}
                onChange={e => setNewService(prev => ({ ...prev, duration: Number(e.target.value) }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Preço (R$)</label>
              <input 
                type="number"
                value={newService.price}
                onChange={e => setNewService(prev => ({ ...prev, price: Number(e.target.value) }))}
                className="w-full border border-slate-200 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-500 uppercase">Descrição</label>
              <button 
                onClick={handleGenerateDescription}
                disabled={loadingAi || !newService.name}
                className="text-xs flex items-center gap-1 text-indigo-600 hover:text-indigo-800 disabled:opacity-50"
              >
                <Wand2 size={14} />
                {loadingAi ? 'Gerando...' : 'Gerar com IA'}
              </button>
            </div>
            <textarea 
              value={newService.description}
              onChange={e => setNewService(prev => ({ ...prev, description: e.target.value }))}
              className="w-full border border-slate-200 rounded-lg px-4 py-2 h-24 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              placeholder="Descreva o que o cliente recebe neste serviço..."
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSave}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-700"
            >
              Salvar Serviço
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {services.map(service => (
          <div key={service.id} className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between hover:shadow-md transition-shadow group">
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded uppercase tracking-wider">
                  {service.category}
                </span>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-1 text-slate-400 hover:text-indigo-600"><Edit2 size={16}/></button>
                  <button onClick={() => onDelete(service.id)} className="p-1 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                </div>
              </div>
              <h4 className="text-lg font-bold text-slate-800">{service.name}</h4>
              <p className="text-sm text-slate-500 mt-2 line-clamp-2">{service.description}</p>
            </div>
            
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-slate-500 text-sm">
                  <Clock size={16} />
                  {service.duration} min
                </div>
                <div className="flex items-center gap-1 text-emerald-600 font-bold">
                  <Banknote size={16} />
                  R$ {service.price}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesView;
