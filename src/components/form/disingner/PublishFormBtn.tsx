import React, { startTransition, useTransition } from "react";
import { Button } from "../../ui/button";
import { ArrowUpToLine, Loader } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/use-toast";
import { PublishForm } from "../../../../actions/form";
import { useRouter } from "next/navigation";


function PublishFormBtn({id}: {id: number}) {
  const [loading, setTransiton] = useTransition();
  const router = useRouter();
  
  async function publishForm  () {
    try {
      await PublishForm(id);
      toast({
        title: 'Succes',
        description: 'Formulario publicado',
      });
      router.refresh();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo publicar el formulario',
        variant: 'destructive',
      })
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant={"default"} className="gap-2">
          <ArrowUpToLine />
          Publicar
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Estas seguro que quieres publicar este formulario?
          </AlertDialogTitle>
          <AlertDialogDescription>
            Una vez publicado el formulario no podra ser editado <br />
            <span className="font-medium">
              Al publicar este formulario lo hará accesible a todo el mundo y
              podrás recopilar envíos
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction disabled={loading} onClick={(e) => {
            e.preventDefault();
            startTransition(publishForm)
          }}>
            Publicar {loading &&  <Loader className="animate-spin" />}
            </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PublishFormBtn;
