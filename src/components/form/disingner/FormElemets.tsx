import { TextFieldFormElement } from "./fields/TextField";

export type ElementsType = "TextField";

export type FormElement = {
  type: ElementsType;

  construct: (id:string)=>FormElementInstance;

  designerBtnElement: {
    icon: React.ElementType;
    label: string;
  };

  desingerComponent: React.FC;
  formComponent: React.FC;
  propertiesComponent: React.FC;
};

export type FormElementInstance={
    id:string;
    type: ElementsType;
    extraAtributes?:Record<string, any>;
}

type FormElementsType = {
  [key in ElementsType]: FormElement;
};

export const FormElements: FormElementsType = {
  TextField: TextFieldFormElement,
};
