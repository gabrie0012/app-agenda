
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { INITIAL_SERVICES, BUSINESS_INFO } from './constants';
import { Service, Appointment } from './types';
import Layout from './components/Layout';
import DashboardView from './components/DashboardView';
import ServicesView from './components/ServicesView';
import CalendarView from './components/CalendarView';
import BookingPage from './components/BookingPage';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'mock-1',
      serviceId: '1',
      clientName: 'Roberto Almeida',
      clientEmail: 'roberto@email.com',
      date: new Date().toISOString().split('T')[0],
      time: '14:00',
      status: 'scheduled'
    },
    {
      id: 'mock-2',
      serviceId: '2',
      clientName: 'Ana Clara Silva',
      clientEmail: 'ana@email.com',
      date: new Date().toISOString().split('T')[0],
      time: '10:30',
      status: 'scheduled'
    }
  ]);

  const handleAddService = (newService: Service) => {
    setServices(prev => [...prev, newService]);
  };

  const handleDeleteService = (id: string) => {
    setServices(prev => prev.filter(s => s.id !== id));
  };

  const handleNewBooking = (booking: Omit<Appointment, 'id' | 'status'>) => {
    const newApp: Appointment = {
      ...booking,
      id: `app-${Date.now()}`,
      status: 'scheduled'
    };
    setAppointments(prev => [...prev, newApp]);
    
    // In a real app, this would trigger a reminder system.
    console.log("Notificação enviada para", booking.clientEmail);
  };

  const AdminPanel = () => (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} businessSlug={BUSINESS_INFO.slug}>
      {activeTab === 'dashboard' && <DashboardView appointments={appointments} services={services} />}
      {activeTab === 'services' && <ServicesView services={services} onAdd={handleAddService} onDelete={handleDeleteService} />}
      {activeTab === 'calendar' && <CalendarView appointments={appointments} services={services} />}
      {activeTab === 'clients' && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center py-20 text-slate-400">
          Módulo de gestão de CRM em desenvolvimento. Visualize seus clientes agendados no Dashboard e Agenda.
        </div>
      )}
      {activeTab === 'settings' && (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center py-20 text-slate-400">
          Configurações de perfil e notificações em desenvolvimento.
        </div>
      )}
    </Layout>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route 
          path={`/booking/${BUSINESS_INFO.slug}`} 
          element={<BookingPage business={BUSINESS_INFO} services={services} onBook={handleNewBooking} />} 
        />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
