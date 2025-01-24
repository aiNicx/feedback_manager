import { Process } from '../types/processes'

let mockProcesses: Process[] = [
  { 
    id: '1', 
    processo: 'Safety specialist',
    domanda: 'Come valuti la capacità del collega di identificare e gestire i rischi per la sicurezza?'
  },
  { 
    id: '2', 
    processo: 'Facility manager',
    domanda: 'Quanto è efficace il collega nella gestione e manutenzione delle strutture aziendali?'
  },
  { 
    id: '3', 
    processo: 'Legal specialist',
    domanda: 'Come giudichi la competenza del collega nella gestione delle questioni legali?'
  },
  { 
    id: '4', 
    processo: 'Compliance specialist',
    domanda: 'Quanto è efficace il collega nel garantire la conformità alle normative e ai regolamenti?'
  },
]

export const mockProcessesApi = {
  getAll: () => [...mockProcesses],
  
  create: (data: Omit<Process, 'id'>) => {
    const newProcess = {
      ...data,
      id: Math.random().toString(36).substr(2, 9),
    }
    mockProcesses.push(newProcess)
    return newProcess
  },

  update: (id: string, data: Partial<Omit<Process, 'id'>>) => {
    const index = mockProcesses.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Processo non trovato')
    
    mockProcesses[index] = { ...mockProcesses[index], ...data }
    return mockProcesses[index]
  },

  delete: (id: string) => {
    const index = mockProcesses.findIndex(p => p.id === id)
    if (index === -1) throw new Error('Processo non trovato')
    
    mockProcesses = mockProcesses.filter(p => p.id !== id)
  }
} 