"use client";

import {  Heading, Users, } from "lucide-react";
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
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";


const type: ElementsType = "TitleField";

const extraAttributes = {
  title: "Titulo",
};

const propiertiesSchema = z.object({
  title: z.string().min(2).max(50),
});

export const TitleFieldFormElement: FormElement = {
  type,
  construct: (id: string) => ({
    id,
    type,
    extraAttributes,
  }),
  designerBtnElement: {
    icon:  Heading,
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
      title: element.extraAttributes.title,
    },
  });

  useEffect(() => {
    form.reset(element.extraAttributes);
  }, [element, form]);

  function applyChanges(values: PropertiesFormSchemaType) {
    const { title } = values;

    updateElemet(element.id, {
      ...element,
      extraAttributes: {
        title,
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel> Title</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") e.currentTarget.blur();
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
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { title, badgeText, description } = element.extraAttributes

  return (
    <Card className=" border-t-4 border-t-blue-500 w-full">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CardTitle className="text-3xl font-bold text-gray-800">{title}</CardTitle>
        </div>
        {badgeText && (
          <Badge variant="secondary" className="mx-auto text-lg px-4 py-1">
            {badgeText}
          </Badge>
        )}
        {description && <CardDescription className="text-base mt-4 text-gray-600">{description}</CardDescription>}
      </CardHeader>
    </Card>
  )
}

function FormComponent({
  elementInstance,
}: {
  elementInstance: FormElementInstance
}) {
  const element = elementInstance as CustomInstance
  const { title, badgeText, description } = element.extraAttributes

  return (
    <Card className="mb-8 border-t-4 border-t-blue-500 shadow-lg w-full">
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <CardTitle className="text-3xl font-bold text-gray-800">{title}</CardTitle>
        </div>
        {badgeText && (
          <Badge variant="secondary" className="mx-auto text-lg px-4 py-1">
            {badgeText}
          </Badge>
        )}
        {description && <CardDescription className="text-base mt-4 text-gray-600">{description}</CardDescription>}
      </CardHeader>
    </Card>
  )
}
