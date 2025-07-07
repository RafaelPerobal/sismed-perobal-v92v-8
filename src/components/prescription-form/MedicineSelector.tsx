
import { useState } from 'react';
import { Medicine, PrescriptionMedicine } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Search, Plus } from "lucide-react";
import { useToast } from '@/hooks/use-toast';

interface MedicineSelectorProps {
  medicines: Medicine[];
  selectedMedicines: PrescriptionMedicine[];
  onAddMedicine: (medicine: PrescriptionMedicine) => void;
  isLoading?: boolean;
}

const MedicineSelector = ({ 
  medicines, 
  selectedMedicines, 
  onAddMedicine, 
  isLoading = false 
}: MedicineSelectorProps) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMedicine, setSelectedMedicine] = useState<number | null>(null);
  const [posologia, setPosologia] = useState("");

  // Filtrar medicamentos com a pesquisa
  const filteredMedicines = medicines.filter(med => 
    med.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMedicine = () => {
    if (!selectedMedicine || !posologia) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione um medicamento e informe a posologia",
        variant: "destructive"
      });
      return;
    }

    const newMedication: PrescriptionMedicine = {
      medicamentoId: selectedMedicine,
      posologia: posologia
    };

    onAddMedicine(newMedication);

    // Limpar os campos
    setSelectedMedicine(null);
    setPosologia("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Search className="h-5 w-5 text-gray-400" />
        <Input
          placeholder="Buscar medicamento"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="border rounded-md max-h-60 overflow-y-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Dosagem</TableHead>
              <TableHead>Apresentação</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  Carregando medicamentos...
                </TableCell>
              </TableRow>
            ) : filteredMedicines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                  Nenhum medicamento encontrado
                </TableCell>
              </TableRow>
            ) : (
              filteredMedicines.map((med) => (
                <TableRow key={med.id} className={med.id === selectedMedicine ? "bg-health-100" : ""}>
                  <TableCell>{med.nome}</TableCell>
                  <TableCell>{med.dosagem}</TableCell>
                  <TableCell>{med.apresentacao}</TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant={med.id === selectedMedicine ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedMedicine(med.id === selectedMedicine ? null : med.id)}
                    >
                      {med.id === selectedMedicine ? "Selecionado" : "Selecionar"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="posologia">Posologia</Label>
        <Textarea
          id="posologia"
          value={posologia}
          onChange={(e) => setPosologia(e.target.value)}
          placeholder="Ex: Tomar 1 comprimido a cada 8 horas por 7 dias"
          rows={2}
        />
      </div>
      
      <Button
        type="button"
        onClick={handleAddMedicine}
        className="w-full bg-health-600 hover:bg-health-700"
        disabled={!selectedMedicine || !posologia}
      >
        <Plus className="mr-2 h-4 w-4" />
        Adicionar Medicamento à Receita
      </Button>
    </div>
  );
};

export default MedicineSelector;
