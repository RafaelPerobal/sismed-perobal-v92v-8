
// Modelo de Paciente (simplificado - campos essenciais)
export interface Patient {
  id: number;
  nome: string; // Campo obrigatório
  cpf: string; // Campo opcional
  dataNascimento: string; // Campo opcional
}

// Modelo de Medicamento (simplificado)
export interface Medicine {
  id: number;
  nome: string; // Denominação Genérica
  dosagem: string; // Concentração 
  apresentacao: string; // Ex: comprimido, xarope, injeção
}

// Modelo de Receita
export interface Prescription {
  id: number;
  pacienteId: number;
  data: string;
  dataVencimento?: string; // Data de vencimento opcional
  medicamentos: PrescriptionMedicine[];
  observacoes: string;
}

// Medicamentos da Receita
export interface PrescriptionMedicine {
  medicamentoId: number;
  posologia: string; // Como tomar o medicamento
}

// Configuração de datas para múltiplas receitas
export interface PrescriptionDateConfig {
  enabled: boolean;
  date: string;
}

// Objeto para geração de múltiplas receitas
export interface MultiplePrescriptionsData {
  pacienteId: number;
  medicamentos: PrescriptionMedicine[];
  observacoes: string;
  datas: PrescriptionDateConfig[];
}

// Configuração para impressão
export interface PrintConfig {
  showButtons: boolean;
}
