import { GetFormContentByUrl } from '../../../../actions/form';
import FormSubmitComponent from '@/components/form/forms/FormSubmitComponent';
import { FormElementInstance } from '@/components/form/disingner/FormElemets';


export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export default async function SubmitPage(
  props: { params: Promise<{ formUrl: string }> }
): Promise<React.JSX.Element> {
  const { formUrl } = await props.params;
  const form = await GetFormContentByUrl(formUrl);

  if (!form) {
    throw new Error('Formulario no encontrado');
  }

  const formContent = JSON.parse(form.content) as FormElementInstance[];

  return <FormSubmitComponent formUrl={formUrl} content={formContent} />;
}
