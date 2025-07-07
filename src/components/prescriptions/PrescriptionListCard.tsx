
import { Prescription, Patient, Medicine } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Plus, Trash2, Eye } from 'lucide-react';
import { format } from 'date-fns';

interface PrescriptionListCardProps {
  patient: Patient;
  prescriptions: Prescription[];
  onNewPrescription: () => void;
  onViewPrescription: (prescription: Prescription) => void;
  onDeletePrescription: (id: number) => void;
  isLoading?: boolean;
}

const PrescriptionListCard = ({ 
  patient, 
  prescriptions, 
  onNewPrescription, 
  onViewPrescription, 
  onDeletePrescription,
  isLoading 
}: PrescriptionListCardProps) => {
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return format(date, 'dd/MM/yyyy');
  };

  const patientPrescriptions = prescriptions.filter(p => p.pacienteId === patient.id);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <CardTitle className="text-xl font-semibold text-health-700 flex items-center">
            <FileText className="mr-2 h-5 w-5" />
            Receitas do Paciente: {patient.nome}
          </CardTitle>
          <Button
            onClick={onNewPrescription}
            className="mt-2 sm:mt-0 bg-health-600 hover:bg-health-700"
            size="sm"
          >
            <Plus className="mr-1 h-4 w-4" /> Nova Receita
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="text-center py-8 text-muted-foreground">
            Carregando receitas...
          </div>
        ) : patientPrescriptions.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma receita encontrada para este paciente.
          </div>
        ) : (
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Medicamentos</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientPrescriptions.map((prescription) => (
                  <TableRow key={prescription.id} className="hover:bg-gray-50">
                    <TableCell className="font-medium">
                      {formatDate(prescription.data)}
                    </TableCell>
                    <TableCell>
                      {prescription.medicamentos.length} itens
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        onClick={() => onViewPrescription(prescription)}
                        size="sm"
                        variant="ghost"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-4 w-4" />
                        <span className="sr-only">Visualizar</span>
                      </Button>
                      <Button
                        onClick={() => onDeletePrescription(prescription.id)}
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Excluir</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrescriptionListCard;
