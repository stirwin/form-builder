import { Active, DragOverlay, useDndMonitor } from "@dnd-kit/core";
import React, { useState } from "react";
import { SidebarBtnElementDragOverlay } from "./SidebarBtnElement";
import { ElementsType, FormElements } from "./FormElemets";
import useDesigner from "../hooks/useDesigner";

//sirve para ver un previw del elemento mistras se arrastra
function DragOverlayWrapper() {
  const {elements}= useDesigner();
  const [draggedItem, setDraggedItem] = useState<Active | null>(null);
  useDndMonitor({
    onDragStart: (event) => {
      setDraggedItem(event.active);
    },
    onDragCancel: () => {
      setDraggedItem(null);
    },
    onDragEnd: () => {
      setDraggedItem(null);
    },
  });

  if(!draggedItem) return null; 

  let node = <div>sin superposición de arrastre</div>;
  const isSidebarBtnElement=  draggedItem.data?.current?.isDesignerBtnElement;
  
  if (isSidebarBtnElement) {
    const type= draggedItem.data?.current?.type as ElementsType;
    node = <SidebarBtnElementDragOverlay formElement={FormElements[type]} />;
  }

  const isDesignerElement=  draggedItem.data?.current?.isDesignerElement;
  if (isDesignerElement) {
    const elementId=draggedItem.data?.current?.elementId;
    const element = elements.find((el) => el.id === elementId);
    if(!element) node = <div>elemento no encontrado</div>;
    else {
      const DesignerElementComponent =
        FormElements[element.type].desingerComponent;

        node= <div className="flex bg-accent border rounded-md h-[120px] w-full py-2 px-4 opacity-80 pointer pointer-events-none">
          <DesignerElementComponent elementInstance={element}/>
        </div>
    }
  }

  return <DragOverlay>{node}</DragOverlay>;
}

export default DragOverlayWrapper;
