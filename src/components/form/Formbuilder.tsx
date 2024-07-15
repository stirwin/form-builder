'use client'
import { Form } from '@prisma/client'
import React from 'react'

function Formbuilder({form}:{form:Form}) {
  return (
    <div>
      Formulario a contruir: {form.name}
    </div>
  )
}

export default Formbuilder
