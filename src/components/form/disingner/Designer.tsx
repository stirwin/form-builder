"use client";

import { cn } from "@/lib/utils";
import DisignerSidebar from "./DisignerSidebar";
import { useDndMonitor, useDroppable, DragEndEvent, useDraggable } from "@dnd-kit/core";
import { ElementType, useState } from "react";
import { ElementsType, FormElement, FormElementInstance, FormElements } from "./FormElemets";
import useDesinger from "../hooks/useDesigner";
import { idGenerator } from "@/lib/idGenerator";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";


//funcion principal que ayuda a la creacion de elementos
function Designer() {

  //agrega elementos en el desingner
  const { elements, addElement } = useDesinger();

  const droppable = useDroppable({
    id: "designer-drop-area",
    data: {
      isDesignerDropArea: true,
    },
  });

  console.log(elements);

  useDndMonitor({
    /**
     * Funcion que se ejecuta cuando se termina de arrastrar un elemento.
     * Si el elemento arrastrado es un boton de elemento de formulario y
     * se esta arrastrando sobre el area de-drop del diseñador, se crea un
     * nuevo elemento de formulario del tipo correspondiente y se agrega
     * al principio de la lista de elementos.
     *
     * @param {DragEndEvent} event - Evento de dragEnd
     */
    onDragEnd: (event: DragEndEvent) => {
      const { active, over } = event;
      if (!active || !over) return;

      const isDesignerBtnElement = active.data.current?.isDesignerBtnElement;

      if (isDesignerBtnElement) {
        const type = active.data.current?.type;
        const newElement = FormElements[type as ElementsType].construct(
          idGenerator()
        );

        addElement(0, newElement);
      }
    },
  });

  return (
    <div className="flex w-full h-full">
      <div className="p-4 w-full">
        <div
          ref={droppable.setNodeRef}
          // El contenedor principal del diseño
          className={cn(
            "bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col flex-grow items-center justify-start flex-1 overflow-y-auto",
            droppable.isOver && "ring-4 ring-primary ring-inset"
          )}
        >
          {!droppable.isOver && elements.length === 0 && (
            // Si no hay elemento sobre el area de-drop, se muestra un mensaje
            <p className="text-3xl text-muted-foreground flex flex-grow items-center font-bold">
              Drop here
            </p>
          )}
          {droppable.isOver && elements.length === 0 && (
            // Si hay un elemento sobre el area de-drop, se muestra una vista previa
            <div className="p-4 w-full">
              <div className="h-[120px] rounded-md bg-primary/20"></div>
            </div>
          )}
          {elements.length > 0 && (
            // Muestra los elementos del diseño
            <div className="flex flex-col w-full gap-2 p-4">
              {elements.map((element) => (
                // Para cada elemento del diseño, renderiza su componente correspondiente
                <DesignerElementWrapper key={element.id} element={element} />
              ))}
            </div>
          )}
        </div>
      </div>
      {/* El Sidebar del diseño */}
      <DisignerSidebar />
    </div>
  );
}

/**
 * Componente que envuelve cada elemento del diseño.
 * @param {Object} props - Props del componente.
 * @param {FormElementInstance} props.element - Elemento del diseño.
 * @returns {JSX.Element} El componente del diseñador del elemento.
 */
function DesignerElementWrapper({ element }: { element: FormElementInstance }) {
  
  const { removeElement, selectedElement, setSelectedElement } = useDesinger();
  // Maneja el mouse sobre el elemento del diseño.
  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);
  
  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true,
    },
  });

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true,
    },
  });

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true,
    },
  });
  // Si el elemento está arrastrando, no renderiza el componente del elemento.
  if (draggable.isDragging) return null;

  console.log(selectedElement);
  
  // Obtiene el componente del diseñador del elemento del diseño a partir del tipo de elemento.
  const DesignerElement = FormElements[element.type].desingerComponent;

  // Renderiza el componente del diseñador del elemento.
  return (
    <div 
    ref={draggable.setNodeRef}
    {...draggable.listeners}
    {...draggable.attributes}
    className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer
     rounded-md ring-1 ring-accent ring-inset"
     
      onMouseEnter={() => {setMouseIsOver(true);}}
      onMouseLeave={() => {setMouseIsOver(false);}}

      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setSelectedElement(element);
      }}
     >

      <div
        ref={topHalf.setNodeRef}
        className="absolute -500 w-full h-1/2 rounded-t-md"
      />
      <div
        ref={bottomHalf.setNodeRef}
        className="absolute w-full bottom-0 h-1/2 rounded-b-md"
      />
      {mouseIsOver && (
        <>
          <div className="absolute right-0 h-full">
            <Button 
            className="flex justify-center h-full broder rounded-md 
            rounded-l-none bg-red-500"
            onClick={(e) =>{ 
              e.stopPropagation();
              e.preventDefault();
              removeElement(element.id)}}>
            <Trash2 />
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
          animate-pulse">
            <p className="text-muted-foreground text-sm">Click para propiedades o arrastre para mover</p>
          </div>
        </>
      )}

      <div className={cn("flex w-full h-[120px] items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none opacity-80",
        mouseIsOver && "opacity-30",
        topHalf.isOver && "border-t-4 border-t-foreground",
        bottomHalf.isOver && "border-b-4 border-b-foreground",
      )}>
        <DesignerElement elementInstance={element} />
      </div>
    </div>
  )
}


export default Designer;
