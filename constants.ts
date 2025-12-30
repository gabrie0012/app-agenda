
import { Service, WorkingHours, BusinessConfig } from './types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: '1',
    name: 'Consultoria de Negócios',
    duration: 60,
    price: 250,
    description: 'Análise estratégica completa para pequenos e médios negócios.',
    category: 'Consultoria'
  },
  {
    id: '2',
    name: 'Mentoria Express',
    duration: 30,
    price: 150,
    description: 'Sessão rápida para resolução de dúvidas específicas.',
    category: 'Mentoria'
  }
];

export const INITIAL_WORKING_HOURS: WorkingHours[] = [
  { day: 1, start: '09:00', end: '18:00', isActive: true },
  { day: 2, start: '09:00', end: '18:00', isActive: true },
  { day: 3, start: '09:00', end: '18:00', isActive: true },
  { day: 4, start: '09:00', end: '18:00', isActive: true },
  { day: 5, start: '09:00', end: '18:00', isActive: true },
  { day: 6, start: '09:00', end: '13:00', isActive: false },
  { day: 0, start: '09:00', end: '13:00', isActive: false },
];

export const BUSINESS_INFO: BusinessConfig = {
  name: 'Studio Design & Estratégia',
  slug: 'studio-design',
  about: 'Ajudamos você a transformar ideias em realidade com design focado em resultados.',
  workingHours: INITIAL_WORKING_HOURS,
};
