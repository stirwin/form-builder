"use client";

import React, { useCallback, useRef, useState, useTransition } from "react";
import { FormElementInstance, FormElements } from "../disingner/FormElemets";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Loader, Send } from "lucide-react";
import { SubmitForm } from "../../../../actions/form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

function FormSubmitComponent({
  formUrl,
  content,
  formName,
  formDescription,
}: {
  content: FormElementInstance[];
  formUrl: string;
  formName: string;
  formDescription: string;
}) {
  const formValues = useRef<{ [key: string]: string }>({});
  const formErrors = useRef<{ [key: string]: boolean }>({});
  const [renderKey, setRenderKey] = useState(new Date().getTime());

  const [submitted, setSubmitted] = useState(false);
  const [pending, startTransition] = useTransition();

  const validateForm: () => boolean = useCallback(() => {
    for (const field of content) {
      const actualValue = formValues.current[field.id] || "";
      const valid = FormElements[field.type].validate(field, actualValue);

      if (!valid) {
        formErrors.current[field.id] = true;
      }
    }

    if (Object.keys(formErrors.current).length > 0) {
      return false;
    }

    return true;
  }, [content]);

  const submitValue = useCallback((key: string, value: string) => {
    formValues.current[key] = value;
  }, []);

  const submitForm = async () => {
    formErrors.current = {};
    const validForm = validateForm();
    if (!validForm) {
      setRenderKey(new Date().getTime());
      toast({
        title: "Error",
        description: "Por favor revisa los campos",
        variant: "destructive",
      });
      return;
    }

    try {
      const jsonContent = JSON.stringify(formValues.current);
      await SubmitForm(formUrl, jsonContent);
      setSubmitted(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Algo salio mal",
        variant: "destructive",
      });
    }

    console.log(formValues.current);
  };

  if (submitted) {
    return (
      <div className="flex justify-center w-full h-full items-center p-8">
        <div
          key={renderKey}
          className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background
           w-full p-8 overflow-y-auto border  rounded"
        >
          <h1 className="text-2xl font-bold">Formulario enviado</h1>
          <p className="text-muted-foreground">
            Gracias por tu tiempo, tu puedes cerrar esta ventana ahora.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full  py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <form
          key={renderKey}
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            startTransition(submitForm);
          }}
        >
          <Card className="mb-8 border-t-4 border-t-blue-500 shadow-lg w-full">
            <CardHeader className="text-center">
              <h1 className="text-3xl font-bold mb-2 text-center">
                {formName}
              </h1>
              {formDescription && (
                <p className="text-muted-foreground">{formDescription}</p>
              )}
            </CardHeader>
          </Card>
          {content.map((element) => {
            const FormElement = FormElements[element.type].formComponent;
            return (
              <FormElement
                key={element.id}
                elementInstance={element}
                submitValue={submitValue}
                isInvalid={formErrors.current[element.id]}
                defaultValue={formValues.current[element.id]}
              />
            );
          })}

          {/* Submit Button */}
          <Card className="border-t-4 border-t-green-500 shadow-lg">
            <CardContent className="pt-6">
              <div className="text-center">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 text-lg shadow-md hover:shadow-lg transition-all duration-200"
                  disabled={pending}
                >
                  {!pending && (
                    <>
                      <Send className="h-5 w-5 mr-2" />
                      Enviar Evaluación
                    </>
                  )}
                  {pending && (
                    <>
                      <Loader className="w-5 h-5 mr-2 animate-spin" />
                      Enviando...
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
}

export default FormSubmitComponent;
