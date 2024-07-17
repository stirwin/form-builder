'use client'

import { CaseSensitive } from "lucide-react"
import { ElementsType, FormElement, FormElementInstance } from "../FormElemets"
import Designer from "../Designer"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const type: ElementsType = "TextField"

const extraAttributes = {
    label: "Campo de texto",
    helperText: "Helper text",
    required: false,
    placeHolder: "Escriba aqui...",
}


export const TextFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes,
    }),
    designerBtnElement: {
        icon: CaseSensitive,
        label: " Campo de texto",
    },

    desingerComponent: DesignerComponent,
    formComponent: () => <div>Form component</div>,
    propertiesComponent: () => <div>Properties component</div>
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes
}

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {

    const element = elementInstance as CustomInstance;
    const { label, helperText, required, placeHolder } = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className="font-medium text-sm">
                {element.extraAttributes.label}
                {element.extraAttributes.required && "*"}
            </Label>
            <Input readOnly disabled placeholder={element.extraAttributes.placeHolder} />
            {helperText && 
            <p className="text-xs text-muted-foreground">{helperText}</p>
            }

        </div>)
}
