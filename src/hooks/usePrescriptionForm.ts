
import { useState, useEffect } from 'react';
import { Patient, PrescriptionMedicine, PrescriptionDateConfig } from '@/types';
import { getPatientByIdSync } from '@/utils/storage';
import { usePrescriptions } from './usePrescriptions';
import { useToast } from './use-toast';

export const usePrescriptionForm = (patientId?: number) => {
  const { toast } = useToast();
  const { generateMultiplePrescriptions } = usePrescriptions();
  
  const [patient, setPatient] = useState<Patient | null>(null);
  const [selectedMedicines, setSelectedMedicines] = useState<PrescriptionMedicine[]>([]);
  const [prescriptionDates, setPrescriptionDates] = useState<PrescriptionDateConfig[]>([
    { enabled: true, date: new Date().toISOString().split('T')[0] }
  ]);
  const [observations, setObservations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (patientId) {
      const patientData = getPatientByIdSync(patientId);
      setPatient(patientData || null);
    }
  }, [patientId]);

  const addMedicine = (medicine: PrescriptionMedicine) => {
    setSelectedMedicines(prev => [...prev, medicine]);
  };

  const removeMedicine = (index: number) => {
    setSelectedMedicines(prev => prev.filter((_, i) => i !== index));
  };

  const generatePrescriptions = async (onSuccess?: () => void) => {
    if (!patientId) {
      toast({
        title: "Erro",
        description: "Paciente não selecionado",
        variant: "destructive"
      });
      return;
    }
    
    if (selectedMedicines.length === 0) {
      toast({
        title: "Lista vazia",
        description: "Adicione pelo menos um medicamento à receita",
        variant: "destructive"
      });
      return;
    }

    const enabledDates = prescriptionDates.filter(d => d.enabled);
    
    if (enabledDates.length === 0) {
      toast({
        title: "Nenhuma data selecionada",
        description: "Selecione pelo menos uma data para gerar a receita",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      await generateMultiplePrescriptions({
        pacienteId: patientId,
        medicamentos: selectedMedicines,
        observacoes: observations,
        datas: prescriptionDates
      });
      
      // Limpar o formulário
      setSelectedMedicines([]);
      setObservations('');
      setPrescriptionDates([{ 
        enabled: true, 
        date: new Date().toISOString().split('T')[0] 
      }]);
      
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Erro ao gerar receitas:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setSelectedMedicines([]);
    setObservations('');
    setPrescriptionDates([{ 
      enabled: true, 
      date: new Date().toISOString().split('T')[0] 
    }]);
  };

  return {
    patient,
    selectedMedicines,
    setSelectedMedicines,
    prescriptionDates,
    setPrescriptionDates,
    observations,
    setObservations,
    isSubmitting,
    addMedicine,
    removeMedicine,
    generatePrescriptions,
    resetForm
  };
};
