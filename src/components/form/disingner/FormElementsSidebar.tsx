import React from "react";
import SidebarBtnElement from "./SidebarBtnElement";
import { FormElements } from "./FormElemets";

function FormElementsSidebar() {
  return (
    <div>
      elements
      <SidebarBtnElement formElement={FormElements.TextField} />
    </div>
  );
}

export default FormElementsSidebar;
