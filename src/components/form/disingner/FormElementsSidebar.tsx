import React from "react";
import SidebarBtnElement from "./SidebarBtnElement";
import { FormElements } from "./FormElemets";
import { Separator } from "@/components/ui/separator";

function FormElementsSidebar() {
  return (
    <div>
      <p className="text-sm text-foreground/70"> Arrastra y suelta los elementos</p>
      <Separator className="my-2" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center">
        <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2
        place-self-start">
          Elementos de diseño
        </p>
      
      <SidebarBtnElement formElement={FormElements.TitleField} />
      <SidebarBtnElement formElement={FormElements.SubTitleField} />
      <SidebarBtnElement formElement={FormElements.ParagraphField} />
      <p className="text-sm text-muted-foreground col-span-1 md:col-span-2 my-2
        place-self-start">
          Elementos de formulario
        </p>
        <SidebarBtnElement formElement={FormElements.TextField} />
      </div>
    </div>
  );
}

export default FormElementsSidebar;
