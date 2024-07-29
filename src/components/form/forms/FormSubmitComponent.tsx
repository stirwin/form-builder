"use client";

import React from "react";
import { FormElementInstance, FormElements } from "../disingner/FormElemets";
import { Button } from "@/components/ui/button";

function FormSubmitComponent({
  formUrl,
  content,
}: {
  content: FormElementInstance[];
  formUrl: string;
}) {
  return <div className="flex justify-center w-full h-full items-center p-8">
        <div className="max-w-[620px] flex flex-col gap-4 flex-grow bg-background
         w-full p-8 overflow-y-auto border  rounded">

                {
                    content.map((element) => {
                        const FormElement= FormElements[element.type].formComponent;
                        return <FormElement key={element.id} elementInstance={element} />
                    })
                }
                <Button className="mt-8">Enviar</Button>
         </div>
  </div>;
}

export default FormSubmitComponent;
