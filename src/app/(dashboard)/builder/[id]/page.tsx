// app/(dashboard)/builder/[id]/page.tsx
import React from 'react';
import { GetFormById } from '../../../../../actions/form';
import Formbuilder from '@/components/form/disingner/Formbuilder';

export const runtime = 'edge';

export const dynamic = 'force-dynamic';

export default async function BuilderPage(
  props: { params: Promise<{ id: string }> }
): Promise<React.JSX.Element> {
  const { id } = await props.params; // ✅ await aquí
  const form = await GetFormById(Number(id));

  if (!form) throw new Error('Form no encontrado');
  return <Formbuilder form={form} />;
}
