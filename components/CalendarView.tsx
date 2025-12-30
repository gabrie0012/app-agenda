
import React, { useState } from 'react';
import { Appointment, Service } from '../types';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, User } from 'lucide-react';

interface CalendarProps {
  appointments: Appointment[];
  services: Service[];
}

const CalendarView: React.FC<CalendarProps> = ({ appointments, services }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);

  const daysArray = [];
  for (let i = 0; i < startDay; i++) daysArray.push(null);
  for (let i = 1; i <= totalDays; i++) daysArray.push(i);

  const getAppointmentsForDay = (day: number | null) => {
    if (!day) return [];
    const dateStr = new Date(year, month, day).toISOString().split('T')[0];
    return appointments.filter(a => a.date.startsWith(dateStr));
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row h-[700px]">
      {/* Calendar Grid */}
      <div className="flex-1 p-6 border-r border-slate-100">
        <div className="flex justify-between items-center mb-8">
          <h3 className="text-xl font-bold text-slate-800">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-2">
            <button onClick={prevMonth} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600"><ChevronLeft size={20}/></button>
            <button onClick={nextMonth} className="p-2 hover:bg-slate-50 rounded-lg text-slate-600"><ChevronRight size={20}/></button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-px bg-slate-100 rounded-lg overflow-hidden border border-slate-100">
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(d => (
            <div key={d} className="bg-slate-50 py-3 text-center text-xs font-bold text-slate-400 uppercase tracking-wider">
              {d}
            </div>
          ))}
          {daysArray.map((day, i) => {
            const dayAppointments = getAppointmentsForDay(day);
            const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
            
            return (
              <div 
                key={i} 
                className={`min-h-[90px] bg-white p-2 flex flex-col gap-1 transition-colors hover:bg-slate-50 cursor-pointer ${!day ? 'bg-slate-50/50' : ''}`}
              >
                {day && (
                  <>
                    <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white' : 'text-slate-700'}`}>
                      {day}
                    </span>
                    <div className="flex flex-col gap-1 mt-1 overflow-hidden">
                      {dayAppointments.slice(0, 3).map(app => (
                        <div key={app.id} className="text-[10px] bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded truncate font-medium">
                          {app.time} - {app.clientName.split(' ')[0]}
                        </div>
                      ))}
                      {dayAppointments.length > 3 && (
                        <div className="text-[9px] text-slate-400 font-medium pl-1">
                          +{dayAppointments.length - 3} outros
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Day Details Side Panel */}
      <div className="w-full md:w-80 bg-slate-50/50 p-6 overflow-y-auto">
        <h4 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <CalendarIcon size={18} className="text-indigo-600" />
          Hoje
        </h4>
        
        <div className="space-y-4">
          {getAppointmentsForDay(new Date().getDate()).length > 0 ? (
            getAppointmentsForDay(new Date().getDate()).sort((a,b) => a.time.localeCompare(b.time)).map(app => (
              <div key={app.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">
                    {app.time}
                  </span>
                  <div className={`w-2 h-2 rounded-full ${app.status === 'scheduled' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                </div>
                <div>
                  <h5 className="font-bold text-slate-800 flex items-center gap-2">
                    <User size={14} className="text-slate-400"/>
                    {app.clientName}
                  </h5>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                    <Clock size={12}/>
                    {services.find(s => s.id === app.serviceId)?.name}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-slate-400 text-sm">Nenhum agendamento para hoje.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
