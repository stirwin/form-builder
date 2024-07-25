import React from "react";
import useDesigner from "../hooks/useDesigner";
import { FormElements } from "./FormElemets";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

function PropertiesFormSidebar() {
  const { selectedElement, setSelectedElement } = useDesigner();

    if (!selectedElement) return null;

    const PropertiesForm =FormElements[selectedElement?.type].propertiesComponent;





  return (
    <div className="flex flex-col">
        <div className="flex justify-between items-center">
            <p className="text-sm text-foreground/70">Propiedades de elemento</p>
            <Button 
            size={"icon"}
            variant={"ghost"}
            onClick={()=>{
                setSelectedElement(null); 
            }}>
                <X />
            </Button>
        </div>
        <Separator className="mb-4"/>
        <PropertiesForm elementInstance={selectedElement}/>
    </div>
  );
}

export default PropertiesFormSidebar;
