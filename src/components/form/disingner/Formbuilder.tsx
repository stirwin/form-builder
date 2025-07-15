"use client";
import { Form } from "@prisma/client";
import React, { useEffect, useState } from "react";
import PreviewDialogBtn from "./PreviewDialogBtn";
import SaveFormBtn from "./SaveFormBtn";
import PublishFormBtn from "./PublishFormBtn";
import Designer from "./Designer";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import DragOverlayWrapper from "./DragOverlayWrapper";
import useDesigner from "../hooks/useDesigner";
import { ArrowLeft, ArrowRight, Loader } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import Link from "next/link";
import Confetti from 'react-confetti';

function Formbuilder({ form }: { form: Form }) {
  const { setElements, setSelectedElement } = useDesigner();
  const [isReady, setIsReady] = useState(false);

  // --- INICIO DE CAMBIOS ---

  // 1. Añade estados para los valores que dependen de `window`
  const [shareUrl, setShareUrl] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Este efecto solo se ejecuta en el cliente
    setMounted(true);
    setShareUrl(`${window.location.origin}/submit/${form.shareURL}`);
  }, [form]);

  // --- FIN DE CAMBIOS ---


  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 10,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 300,
      tolerance: 5,
    },
  });

  const sensors = useSensors(mouseSensor, touchSensor);

  useEffect(() => {
    if (isReady) return;
    const elements = JSON.parse(form.content);
    setElements(elements);
    setSelectedElement(null);
    const readyTimeout = setTimeout(() => setIsReady(true), 500);

    return () => clearTimeout(readyTimeout);
  }, [form, setElements, isReady, setSelectedElement]);

  if (!isReady || !mounted) { // Espera a que el componente esté montado en el cliente
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (form.published) {
    return (
      <>
        {/* Usamos un componente que renderiza Confetti solo en el cliente */}
        <ClientOnlyConfetti />
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="mx-w-md">
            <h1 className="text-3xl text-center font-bold text-primary border-b-2 pb-2 mb-10">
              Formulario publicado
            </h1>
            <h2 className=" text-2xl text-muted-foreground font-bold">
              Compartir este formulario
            </h2>
            <h3 className="text-xl text-muted-foreground border-b pb-10">
              Cualquiera que tenga el link puede ver y enviar el formulario
            </h3>
            <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
              {/* Usa el estado `shareUrl` en lugar de la variable calculada directamente */}
              <Input className="w-full" readOnly value={shareUrl}/>
              <Button className="w-full mt-2 " onClick={() => {
                navigator.clipboard.writeText(shareUrl)
                toast({
                  title: "Copiado",
                  description: "El link fue copiado"
                })
              }}>
                Copiar
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant={"link"} asChild>
                <Link href={"/"} className="gap-2">
                  <ArrowLeft />
                  Ir al inicio
                </Link>
              </Button>
              <Button variant={"link"} asChild>
                <Link href={`/forms/${form.id}`} className="gap-2">
                  Detalles del formulario
                  <ArrowRight/>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full">
        <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
          <h2 className="truncate font-medium">
            <span className="text-muted-foreground mr-2"> Form</span>
            {form.name}
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            {!form.published && (
              <>
                <SaveFormBtn id={form.id} />
                <PublishFormBtn id={form.id} />
              </>
            )}
          </div>
        </nav>
        <div
          className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]"
        >
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
}

// Componente auxiliar para asegurar que Confetti solo se renderice en el cliente
function ClientOnlyConfetti() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  if (dimensions.width === 0) {
    return null; // No renderizar nada hasta que las dimensiones estén listas
  }
  
  return (
    <Confetti 
      width={dimensions.width} 
      height={dimensions.height}
      recycle={false}
      numberOfPieces={1000}
    />
  );
}


export default Formbuilder;