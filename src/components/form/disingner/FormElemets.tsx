/**
 * Este módulo define los diferentes elementos de formulario disponibles para el diseñador.
 */

import { CheckboxFieldFormElement } from "./fields/CheckboxField";
import { DateFíeldFormElement } from "./fields/DateFíeld";
import { NumberFieldFormElement } from "./fields/NumberField";
import { ParagraphFieldFormElement } from "./fields/ParagraphField";
import { SelectFieldFormElement } from "./fields/SelectField";
import { SeparatorFieldFormElement } from "./fields/SeparatorField";
import { SpacerFieldFormElement } from "./fields/SpacerField";
import { SubTitleFieldFormElement } from "./fields/SubTitleField";
import { TextAreaFormElement } from "./fields/TextAreaField";
import { TextFieldFormElement } from "./fields/TextField";
import { TitleFieldFormElement } from "./fields/TitleField";
//Tipo de elementos de formulario disponibles.
export type ElementsType = 
  | "TextField" 
  | "TitleField" 
  | "SubTitleField"
  | "ParagraphField"
  | "SeparatorField"
  | "SpacerField"
  | "NumberField"
  | "TextAreaField"
  | "DateFíeld"
  | "SelectField"
  | "CheckboxField";
  
  export type SubmitFunction = (key: string, value: string) => void;


/**
 * Tipo para un elemento de formulario.
 *
 * Un elemento de formulario es de tipo, un constructor para crear una instancia
 * del elemento, un elemento de botón para el diseñador UI, y tres componentes react
 * para el UI de diseñador, formulario y propiedades.
 */
export type FormElement = {
  //El tipo de elemento de formulario.
  type: ElementsType;

  /**
   * Una función constructora para crear una instancia del elemento de formulario.
   *
   * @param id El id del elemento de formulario.
   * @returns Una instancia de elemento de formulario.
   */
  construct: (id: string) => FormElementInstance;

  /**
   * Un elemento de botón para el UI de diseñador.
   *
   * El botón consta de un icono y una etiqueta.
   */
  designerBtnElement: {
    icon: React.ElementType;
    label: string;
  };

  /**
   * Un componente react para el UI de diseñador.
   *
   * El componente toma una instancia de elemento de formulario como prop.
   */
  desingerComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;
  //Un componente react para el UI de formulario.
  formComponent: React.FC<{
    elementInstance: FormElementInstance;
    submitValue?: SubmitFunction;
    isInvalid?: boolean;
    defaultValue?: string;
  }>;
  //Un componente react para el UI de propiedades.
  propertiesComponent: React.FC<{
    elementInstance: FormElementInstance;
  }>;

  validate: (FormElement: FormElementInstance, currentValue: string) => boolean;
};

/**
 * Tipo para una instancia de elemento de formulario.
 *
 * Una instancia de elemento de formulario consta de un id, un tipo, y
 * opcionalmente atributos extras.
 */
export type FormElementInstance = {
  id: string;
  type: ElementsType;
  extraAttributes?: Record<string, any>;
};

/**
 * Tipo para un mapping de tipos de elementos de formulario a elementos de formulario.
 */
type FormElementsType = {
  [key in ElementsType]: FormElement;
};

/**
 * Un mapping de tipos de elementos de formulario a elementos de formulario.
 */
export const FormElements: FormElementsType = {
  TextField: TextFieldFormElement,
  TitleField: TitleFieldFormElement,
  SubTitleField: SubTitleFieldFormElement,
  ParagraphField: ParagraphFieldFormElement,
  SeparatorField: SeparatorFieldFormElement,
  SpacerField: SpacerFieldFormElement,
  NumberField: NumberFieldFormElement,
  TextAreaField: TextAreaFormElement,
  DateFíeld: DateFíeldFormElement,
  SelectField: SelectFieldFormElement,
  CheckboxField: CheckboxFieldFormElement,
};
