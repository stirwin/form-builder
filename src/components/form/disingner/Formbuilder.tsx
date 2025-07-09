'use client';

import React, { useEffect, useState } from 'react';
import { Form } from '@prisma/client';
import PreviewDialogBtn from './PreviewDialogBtn';
import SaveFormBtn from './SaveFormBtn';
import PublishFormBtn from './PublishFormBtn';
import Designer from './Designer';
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import DragOverlayWrapper from './DragOverlayWrapper';
import useDesigner from '../hooks/useDesigner';
import { ArrowLeft, ArrowRight, Loader } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import Link from 'next/link';
import Confetti from 'react-confetti';

interface FormbuilderProps {
  form: Form;
}

export default function Formbuilder({ form }: FormbuilderProps) {
  const { setElements, setSelectedElement } = useDesigner();
  const [isReady, setIsReady] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 },
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 300, tolerance: 5 },
  });
  const sensors = useSensors(mouseSensor, touchSensor);

  // Initialize form elements and client-only values
  useEffect(() => {
    // Set design elements once
    const elements = JSON.parse(form.content);
    setElements(elements);
    setSelectedElement(null);

    // Mark ready
    const readyTimeout = setTimeout(() => setIsReady(true), 500);

    // Compute share URL and dimensions on client
    setShareUrl(`${window.location.origin}/submit/${form.shareURL}`);
    setDimensions({ width: window.innerWidth, height: window.innerHeight });

    // Cleanup
    return () => clearTimeout(readyTimeout);
  }, [form, setElements, setSelectedElement]);

  if (!isReady) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-full">
        <Loader className="animate-spin" />
      </div>
    );
  }

  // Published view
  if (form.published) {
    return (
      <>
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          recycle={false}
          numberOfPieces={1000}
        />
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="max-w-md">
            <h1 className="text-3xl text-center font-bold text-primary border-b-2 pb-2 mb-10">
              Formulario publicado
            </h1>
            <h2 className="text-2xl text-muted-foreground font-bold">
              Compartir este formulario
            </h2>
            <h3 className="text-xl text-muted-foreground border-b pb-10">
              cualquiera que tenga el link puede ver y enviar el formulario
            </h3>
            <div className="my-4 flex flex-col gap-2 items-center w-full border-b pb-4">
              <Input className="w-full" readOnly value={shareUrl} />
              <Button
                className="w-full mt-2"
                onClick={() => {
                  navigator.clipboard.writeText(shareUrl);
                  toast({ title: 'Copiado', description: 'El link fue copiado' });
                }}
              >
                Copiar
              </Button>
            </div>
            <div className="flex justify-between">
              <Button variant="link" asChild>
                <Link href="/" className="flex items-center gap-2">
                  <ArrowLeft /> Ir al inicio
                </Link>
              </Button>
              <Button variant="link" asChild>
                <Link href={`/forms/${form.id}`} className="flex items-center gap-2">
                  Detalles del formulario <ArrowRight />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Builder view
  return (
    <DndContext sensors={sensors}>
      <main className="flex flex-col w-full">
        <nav className="flex justify-between border-b-2 p-4 gap-3 items-center">
          <h2 className="truncate font-medium">
            <span className="text-muted-foreground mr-2">Form</span>
            {form.name}
          </h2>
          <div className="flex items-center gap-2">
            <PreviewDialogBtn />
            <SaveFormBtn id={form.id} />
            <PublishFormBtn id={form.id} />
          </div>
        </nav>
        <div className="flex w-full flex-grow items-center justify-center relative overflow-y-auto h-[200px] bg-accent bg-[url(/paper.svg)] dark:bg-[url(/paper-dark.svg)]">
          <Designer />
        </div>
      </main>
      <DragOverlayWrapper />
    </DndContext>
  );
}
