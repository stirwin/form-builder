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
import { Loader } from "lucide-react";
import { Input } from "@/components/ui/input";

function Formbuilder({ form }: { form: Form }) {
  const { setElements } = useDesigner();
  const [isReady, setIsReady] = useState(false);

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
    const readyTimeout = setTimeout(() => setIsReady(true), 500);

    return () => clearTimeout(readyTimeout);
  }, [form, setElements]);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Loader className="animate-spin" />
      </div>
    );
  }

    const shareUrl = `${window.location.origin}/submit/${form.shareURL}`;
  if (form.published) {
    return (
      <>
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="mx-w-md">
          <h1
            className="text-3xl text-center font-bold text-primary 
        border-b-2 pb-2 mb-10"
          >
            Formulario publicado
          </h1>
          <h2 className=" text-xl text-muted-foreground border-b pb-10">
            cualquiera puede ver este formulario
          </h2>
          <div
            className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4"
          >
            <Input className="w-full" readOnly value={shareUrl}/>
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
          className="flex w-full flex-grow items-center justify-center
            relative overflow-y-auto h-[200px] bg-accent bg-[url(/paper.svg)]  dark:bg-[url(/paper-dark.svg)]"
        >
          {/*Componente que permite crear elementos*/}
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
}

export default Formbuilder;
