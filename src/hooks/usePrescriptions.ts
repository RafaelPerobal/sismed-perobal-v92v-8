
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Prescription, MultiplePrescriptionsData } from '@/types';
import { getPrescriptions, addPrescription, deletePrescription } from '@/utils/storage';
import { useToast } from '@/hooks/use-toast';

export const usePrescriptions = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: prescriptions = [], isLoading, error } = useQuery({
    queryKey: ['prescriptions'],
    queryFn: getPrescriptions,
  });

  const addPrescriptionMutation = useMutation({
    mutationFn: addPrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      toast({
        title: "Receita gerada",
        description: "Receita criada com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao gerar receita",
        variant: "destructive"
      });
    }
  });

  const deletePrescriptionMutation = useMutation({
    mutationFn: deletePrescription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      toast({
        title: "Receita excluída",
        description: "Receita removida com sucesso",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Erro ao excluir receita",
        variant: "destructive"
      });
    }
  });

  // Função para gerar múltiplas receitas (preparada para integração com backend)
  const generateMultiplePrescriptions = async (data: MultiplePrescriptionsData) => {
    try {
      // Gerar receitas individuais para cada data habilitada
      const enabledDates = data.datas.filter(d => d.enabled);
      
      for (const dateConfig of enabledDates) {
        const prescriptionData = {
          pacienteId: data.pacienteId,
          data: dateConfig.date,
          medicamentos: data.medicamentos,
          observacoes: data.observacoes,
        };
        
        await addPrescription(prescriptionData);
      }
      
      toast({
        title: `${enabledDates.length} receitas geradas`,
        description: `Foram geradas ${enabledDates.length} receitas com sucesso`,
      });
      
      queryClient.invalidateQueries({ queryKey: ['prescriptions'] });
      
      return { success: true, count: enabledDates.length };
    } catch (error) {
      toast({
        title: "Erro",
        description: "Erro ao gerar múltiplas receitas",
        variant: "destructive"
      });
      throw error;
    }
  };

  return {
    prescriptions,
    isLoading,
    error,
    addPrescription: addPrescriptionMutation.mutate,
    deletePrescription: deletePrescriptionMutation.mutate,
    generateMultiplePrescriptions,
    isAddingPrescription: addPrescriptionMutation.isPending,
    isDeletingPrescription: deletePrescriptionMutation.isPending,
  };
};
