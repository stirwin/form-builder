"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { DuplicateForm, UpdateForm, DeleteForm } from "../../../actions/form"
import { toast } from "@/components/ui/use-toast"
import { Loader } from "lucide-react"

interface MasProps {
  formId: number;
  initialName?: string;
  initialDescription?: string;
  showOnlyDelete?: boolean;
}

export function Mas({ formId, initialName = '', initialDescription = '', showOnlyDelete }: MasProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = React.useState(false)
  const [name, setName] = React.useState(initialName)
  const [description, setDescription] = React.useState(initialDescription)
  const [pending, startTransition] = React.useTransition()
  const router = useRouter()

  const handleDuplicate = async () => {
    startTransition(async () => {
      try {
        const newForm = await DuplicateForm(formId);
        setIsDuplicateDialogOpen(false);
        toast({
          title: "Formulario duplicado",
          description: "El formulario ha sido duplicado con éxito.",
        });
        router.push(`/formularios/builder/${newForm.id}`);
      } catch (error) {
        toast({
          title: "Error",
          description: "Error duplicando el formulario.",
          variant: "destructive",
        });
        console.error("Error duplicando el formulario:", error);
      }
    });
  };

  const handleEdit = async () => {
    startTransition(async () => {
      try {
        await UpdateForm(formId, { name: name || '', description: description || '' });
        setIsEditDialogOpen(false);
        toast({
          title: "Formulario actualizado",
          description: "El formulario ha sido actualizado con éxito.",
        });
        router.refresh();
      } catch (error) {
        toast({
          title: "Error",
          description: "Error actualizando el formulario.",
          variant: "destructive",
        });
        console.error("Error actualizando el formulario:", error);
      }
    });
  };

  const handleDelete = async () => {
    startTransition(async () => {
      try {
        await DeleteForm(formId);
        setIsDeleteDialogOpen(false);
        toast({
          title: "Formulario eliminado",
          description: "El formulario ha sido eliminado con éxito.",
        });
        router.refresh();
      } catch (error) {
        toast({
          title: "Error",
          description: "Error eliminando el formulario.",
          variant: "destructive",
        });
        console.error("Error eliminando el formulario:", error);
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="mt-2">
            Más
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56">
          <DropdownMenuRadioGroup>
            {showOnlyDelete ? (
              <>
                 <DropdownMenuRadioItem value="edit" onClick={() => setIsEditDialogOpen(true)}>
              Editar
            </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="delete" onClick={() => setIsDeleteDialogOpen(true)}>
                Eliminar
              </DropdownMenuRadioItem>
          


            </>
              
            ) : (
              <>
                <DropdownMenuRadioItem value="edit" onClick={() => setIsEditDialogOpen(true)}>
                  Editar
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="duplicate" onClick={() => setIsDuplicateDialogOpen(true)}>
                  Duplicar
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="delete" onClick={() => setIsDeleteDialogOpen(true)}>
                  Eliminar
                </DropdownMenuRadioItem>
              </>
            )}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Diálogo para editar el formulario */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Formulario</DialogTitle>
            <DialogDescription>
              Cambia el nombre y la descripción del formulario.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del formulario</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleEdit} disabled={pending}>
              {!pending && <>Guardar cambios</>}
              {pending && <Loader className="w-4 h-4 animate-spin" />}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar la duplicación del formulario */}
      <Dialog open={isDuplicateDialogOpen} onOpenChange={setIsDuplicateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Duplicar Formulario</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas duplicar este formulario? Se creará una copia idéntica.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={handleDuplicate} disabled={pending}>
              {!pending && <>Duplicar</>}
              {pending && <Loader className="w-4 h-4 animate-spin" />}
            </Button>
            <Button variant="outline" onClick={() => setIsDuplicateDialogOpen(false)} disabled={pending}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para confirmar la eliminación del formulario */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar Formulario</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar este formulario? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete} disabled={pending}>
              {!pending && <>Eliminar</>}
              {pending && <Loader className="w-4 h-4 animate-spin" />}
            </Button>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={pending}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}