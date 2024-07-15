'use client'

import { CaseSensitive } from "lucide-react"
import { ElementsType, FormElement } from "../FormElemets"

const type:ElementsType= "TextField"

export const TextFieldFormElement:FormElement={
    type,
    construct: (id: string)=>({
        id,
        type,
        extraAtributes:{
            label: "Text field",
            helperText:"Helper text",
            required: false,
            placeHolder: "Value here..."
        }
    }),
    designerBtnElement: {
        icon: CaseSensitive,
        label:" Text Field",
    },

    desingerComponent: ()=> <div>Designer component</div>,
    formComponent: ()=> <div>Form component</div>,
    propertiesComponent: ()=> <div>Properties component</div>
}