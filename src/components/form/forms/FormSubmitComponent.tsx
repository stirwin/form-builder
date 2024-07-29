import React from "react";
import { FormElementInstance, FormElements } from "../disingner/FormElemets";

function FormSubmitComponent({
  formUrl,
  content,
}: {
  content: FormElementInstance[];
  formUrl: string;
}) {
  return <div className="flex justify-center w-full h-full items-center p-8">
        <div className="mex-w-[620px] flex flex-col gap-4 flex-grow bg-background
         w-full p-8 overflow-y-auto border shadow-xl rounded">

                {
                    content.map((element) => {
                        const FormElement= FormElements[element.type].formComponent;
                        return <FormElement key={element.id} elementInstance={element} />
                    })
                }
         </div>
  </div>;
}

export default FormSubmitComponent;
