"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Loader, Trash2 } from "lucide-react";

interface EliminarButtonProps {
  submissionId: number;
  onDelete: () => Promise<void>;
  isDeleting: boolean;
}

export default function EliminarButton({
  submissionId,
  onDelete,
  isDeleting,
}: EliminarButtonProps) {
  if (!submissionId) {
    console.error("submissionId no está definido");
    return null; // O muestra un mensaje de error
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive" size={"icon"}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Eliminar</DialogTitle>
        </DialogHeader>
        <p>¿Estás seguro de que deseas eliminar esta respuesta?</p>

        <DialogFooter>
          <Button
            variant="destructive"
            size={"icon"}
            onClick={onDelete}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader className="animate-spin" />
              </>
            ) : (
              <>
                <Trash2 />
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}