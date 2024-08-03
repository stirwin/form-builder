"use client";

import {  Heading, SeparatorHorizontal, } from "lucide-react";
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
import { Slider } from "@/components/ui/slider";


const type: ElementsType = "SpacerField";

const extraAttributes = {
  height: 20, //px 
};

const propiertiesSchema = z.object({
  height: z.number().min(5).max(200),
});

export const SpacerFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon:  SeparatorHorizontal,
    label: " Titulo",
  },

  desingerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: () => true,
};

type CustomInstance = FormElementInstance & {
  extraAttributes: typeof extraAttributes;
};

type PropertiesFormSchemaType = z.infer<typeof propiertiesSchema>;

function PropertiesComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { updateElemet } = useDesigner();
  const form = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propiertiesSchema),
    mode: "onBlur",
    defaultValues: {
      height: element.extraAttributes.height,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: PropertiesFormSchemaType) {
    const { height } = values;

    updateElemet(element.id, {
      ...element,
      extraAttributes: {
        height,
      },
    });
  }

  return (
    <Form {...form}>
      <form
        onBlur={form.handleSubmit(applyChanges)}
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="height"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Altura(px):{form.watch("height")} </FormLabel>
              <FormControl>
                <Slider
                defaultValue={[field.value]}
                min={5}
                max={200}
                step={1}
                onValueChange={(value)=>{
                  field.onChange(value[0])
                }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

function DesignerComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance;
}) {
  const element = elementInstance as CustomInstance;
  const { height } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full items-center">
      <Label className="text-muted-foreground">
       Campo de espacio {height}px
      </Label>
      <SeparatorHorizontal/>
    </div>
  );
}

function FormComponent({
    elementInstance,

  }: {
    elementInstance: FormElementInstance;
  }) {
    const element = elementInstance as CustomInstance;

    const { height } = element.extraAttributes;
    return (
      <div style={{height, width:"100%"}}></div>
    );
  }
