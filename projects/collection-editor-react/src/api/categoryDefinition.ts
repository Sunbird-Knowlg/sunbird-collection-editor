import { apiClient } from './client';

export interface ICategoryDefinitionField {
  code: string;
  label?: string;
  inputType?: string;
  dataType?: string;
  required?: boolean;
  editable?: boolean;
  placeholder?: string;
  maxLength?: number;
  range?: Array<{ name: string; identifier: string }>;
  enum?: string[];
  depends?: string[];
  default?: unknown;
  validations?: unknown;
  [key: string]: unknown;
}

export interface ICategoryDefinitionForm {
  properties?: ICategoryDefinitionField[];
}

export interface ICategoryDefinitionForms {
  create?: ICategoryDefinitionForm;
  unitMetadata?: ICategoryDefinitionForm;
  [key: string]: ICategoryDefinitionForm | undefined;
}

export interface ICategoryDefinitionResult {
  rootFormFields: ICategoryDefinitionField[];
  unitFormFields: ICategoryDefinitionField[];
}

export async function getCategoryDefinition(
  categoryName: string,
  channel: string,
  objectType = 'Collection',
): Promise<ICategoryDefinitionResult> {
  const response = await apiClient.post(
    '/action/object/category/definition/v1/read?fields=objectMetadata,forms,name,label',
    {
      request: {
        objectCategoryDefinition: {
          objectType,
          name: categoryName,
          channel,
        },
      },
    },
  );

  const forms = response.data?.result?.objectCategoryDefinition?.forms as ICategoryDefinitionForms | undefined;
  if (!forms) return { rootFormFields: [], unitFormFields: [] };

  return {
    rootFormFields: extractFields(forms.create),
    unitFormFields: extractFields(forms.unitMetadata),
  };
}

function extractFields(form?: ICategoryDefinitionForm): ICategoryDefinitionField[] {
  if (!form?.properties?.length) return [];
  const fields: ICategoryDefinitionField[] = [];
  for (const item of form.properties) {
    // items can be grouped as { fields: [...] } or flat field objects with `code`
    if (Array.isArray((item as Record<string, unknown>).fields)) {
      for (const f of (item as Record<string, unknown>).fields as ICategoryDefinitionField[]) {
        if (f.code) fields.push(f);
      }
    } else if (item.code) {
      fields.push(item);
    }
  }
  return fields;
}
