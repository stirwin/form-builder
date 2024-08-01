"use client";

import { Heading, SeparatorHorizontal, } from "lucide-react";
import { ElementsType, FormElement, FormElementInstance } from "../FormElemets";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import useDesigner from "../../hooks/useDesigner";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";


const type: ElementsType = "SeparatorField";


export const SeparatorFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
  }),
  designerBtnElement: {
    icon: SeparatorHorizontal,
    label: " Separador",
  },

  desingerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true,
};



function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  
  return (
   <p>No hay propiedades para este campo</p>
  );
}

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-muted-foreground">
        Separador
      </Label>
      <Separator />
    </div>
  );
}

function FormComponent({
  elementInstance,

}: {
  elementInstance: FormElementInstance;
}) {
  return (
    <Separator />
  );
}
