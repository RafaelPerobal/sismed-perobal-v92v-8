
import { Medicine, PrescriptionMedicine } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { getMedicineByIdSync } from '@/utils/storage';

interface MedicineListProps {
  selectedMedicines: PrescriptionMedicine[];
  onRemoveMedicine: (index: number) => void;
}

const MedicineList = ({ selectedMedicines, onRemoveMedicine }: MedicineListProps) => {
  const getMedicineInfo = (id: number): Medicine | undefined => {
    return getMedicineByIdSync(id);
  };

  if (selectedMedicines.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Nenhum medicamento adicionado à receita
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicamento</TableHead>
              <TableHead>Posologia</TableHead>
              <TableHead className="w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {selectedMedicines.map((med, index) => {
              const medicine = getMedicineInfo(med.medicamentoId);
              return (
                <TableRow key={index}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{medicine?.nome}</p>
                      <p className="text-sm text-muted-foreground">
                        {medicine?.dosagem} - {medicine?.apresentacao}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{med.posologia}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveMedicine(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      <div>
        <Badge variant="secondary" className="mr-2">
          Total: {selectedMedicines.length} medicamentos
        </Badge>
      </div>
    </div>
  );
};

export default MedicineList;
