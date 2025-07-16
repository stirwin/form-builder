"use client";

import { CaseSensitive, List, Plus, X } from "lucide-react";
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../FormElemets";
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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import {  Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


const type: ElementsType = "SelectField";

const extraAttributes = {
  label: "Campo de lista",
  helperText: "Helper text",
  required: false,
  placeHolder: "Escriba aqui...",
  options: [],

};

const propiertiesSchema = z.object({
  label: z.string().min(2).max(50),
  helperText: z.string().max(200),
  required: z.boolean().default(false),
  placeHolder: z.string().max(50),
  options: z.array(z.string()).default([]),
});

export const SelectFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon: List,
    label: "Lista",
  },

  desingerComponent: DesignerComponent,
  formComponent: FormComponent,
  propertiesComponent: PropertiesComponent,

  validate: (
    formElemet: FormElementInstance,
    currentValue: string
  ): boolean => {
    const element = formElemet as CustomInstance;
    if (
      element.extraAttributes.required) {
      return currentValue.length > 0;
    }
    return true;
  }
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
  const { updateElemet, setSelectedElement } = useDesigner();
  const form = useForm<PropertiesFormSchemaType>({
    resolver: zodResolver(propiertiesSchema),
    mode: "onSubmit",
    defaultValues: {
      label: element.extraAttributes.label,
      helperText: element.extraAttributes.helperText,
      required: element.extraAttributes.required,
      placeHolder: element.extraAttributes.placeHolder,
      options: element.extraAttributes.options,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: PropertiesFormSchemaType) {
    const { label, helperText, required, placeHolder, options } = values;

    updateElemet(element.id, {
      ...element,
      extraAttributes: {
        label,
        helperText,
        required,
        placeHolder,
        options,
      },
    });

    toast({
      title: "Elemento actualizado",
      description: "Elemento actualizado con exito",
    });
    setSelectedElement(null);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(applyChanges)}
        className="space-y-3"
      >
        <FormField
          control={form.control}
          name="label"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Etiqueta</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>La etiqueta de este campo.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="placeHolder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto de fondo</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                El texto de fondo de este campo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="helperText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Texto de ayuda</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
                  }}
                />
              </FormControl>
              <FormDescription>
                El texto de ayuda para este campo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator/>
        <FormField
          control={form.control}
          name="options"
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
              <FormLabel>Opciones</FormLabel>
              <Button variant={"outline"} className="gap-2" onClick={e=>{
                e.preventDefault();
                form.setValue("options",field.value.concat(["Nueva Opción"]));
              }}>
                <Plus />
                Agregar
              </Button>
              </div>
              <div className="flex flex-col gap-2">
                {form.watch("options").map((option, index) => (
                  <div
                    key={index} 
                  className="flex items-center justify-between gap-1">
                    <Input
                      placeholder="Opción"
                      value={option}
                      onChange={(e) => {
                        field.value[index] = e.target.value;
                        field.onChange(field.value);
                      }}
                    />
                    <Button
                      variant={"ghost"}
                      size={"icon"}
                      onClick={(e) => {
                        e.preventDefault();
                        const newOptions =[...field.value];
                        newOptions.splice(index, 1);
                        field.onChange(newOptions);
                      }}
                    >
                      <X/>
                    </Button>
                  </div>
                ))}
              </div>
              
              <FormDescription>
                El texto de ayuda para este campo.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="required"
          render={({ field }) => (
            <FormItem
              className="flex items-center justify-between rounded-lg
            border p-3 shadow-sm"
            >
              <div className="espace-y-0.5">
                <FormLabel>Requerido</FormLabel>
                <FormDescription>
                  Determina si este campo es requerido.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <Button className="w-full" type="submit">
          Guardar
        </Button>
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
  const { label, helperText, required, placeHolder } = element.extraAttributes;
  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="font-medium text-sm">
        {element.extraAttributes.label}
        {element.extraAttributes.required && "*"}
      </Label>
      <Select>
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeHolder} />
        </SelectTrigger>
      </Select>
      {helperText && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

function FormComponent({
  elementInstance,
  submitValue,
  isInvalid,
  defaultValue,
}: {
  elementInstance: FormElementInstance
  submitValue?: SubmitFunction
  isInvalid?: boolean
  defaultValue?: string
}) {
  const element = elementInstance as CustomInstance
  const [value, setValue] = useState(defaultValue || "")
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(isInvalid === true)
  }, [isInvalid])

  const { label, helperText, required, placeHolder, options } = element.extraAttributes

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader>
        <CardTitle className={cn("text-lg text-gray-800 leading-relaxed", error && "text-red-500")}>
          {element.extraAttributes.label}
          {element.extraAttributes.required && "*"}
        </CardTitle>
        {helperText && (
          <CardDescription className={cn("text-gray-600 italic", error && "text-red-500")}>
            💡 {helperText}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        <Select
          defaultValue={value}
          onValueChange={(value) => {
            setValue(value)
            if (!submitValue) return
            const valid = SelectFieldFormElement.validate(element, value)
            setError(!valid)
            submitValue(element.id, value)
          }}
        >
          <SelectTrigger className={cn("w-full", error && "border-red-500")}>
            <SelectValue placeholder={placeHolder} />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardContent>
    </Card>
  )
}
