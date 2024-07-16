"use client"


import React, { useContext } from 'react'
import { DesignerContext } from '../disingner/context/DisignerContext'

function useDesinger() {
  const context = useContext(DesignerContext);

  if (!context) {
    throw new Error(" usedigner debe usarse dentro de DesignerContext");
  }


  return context;
}

export default useDesinger