import React, { useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { EditorMode } from '../../types/editor';
import { useTreeStore } from '../../store/tree.store';
import { useEditorStore } from '../../store/editor.store';
import { useFramework } from '../../hooks/useFramework';
import { useChannelData } from '../../hooks/useChannelData';
import { useFieldPrepare, SECTION_DISPLAY } from './hooks/useFieldPrepare';
import { useCascade } from './hooks/useCascade';
import { FormSection } from './FormSection';
import { TextField } from './fields/TextField';
import { SelectField } from './fields/SelectField';
import { MultiSelectField } from './fields/MultiSelectField';
import { ChipGroupField } from './fields/ChipGroupField';
import { RadioField } from './fields/RadioField';
import { AppIconField } from './fields/AppIconField';
import { DateTimeField } from './fields/DateTimeField';
import { KeywordSuggestField } from './fields/KeywordSuggestField';
import { NestedSelectField } from './fields/NestedSelectField';
import { LicenseSelectField } from './fields/LicenseSelectField';
import { DialcodeInputField } from './fields/DialcodeInputField';
import styles from './SparkMetaForm.module.scss';

interface SparkMetaFormProps {
  nodeMetadata: Record<string, unknown>;
  activeTab: 'details' | 'audience' | 'licensing';
  isRoot: boolean;
  isFolder: boolean;
  editorMode: EditorMode;
  onFormValueChange: (data: unknown) => void;
  onFormStatusChange: (isValid: boolean, errorTabs: Array<'details' | 'audience' | 'licensing'>) => void;
}

export const SparkMetaForm: React.FC<SparkMetaFormProps> = ({
  nodeMetadata, activeTab, isRoot, isFolder, editorMode,
  onFormValueChange, onFormStatusChange,
}) => {
  const config = useEditorStore(s => s.editorConfig);
  const rootFormConfig = useEditorStore(s => s.rootFormConfig);
  const unitFormConfig = useEditorStore(s => s.unitFormConfig);
  const { organisationFramework, targetFrameworks, isLoading: fwLoading } = useFramework(
    config?.context?.framework as string | undefined,
    config?.context?.targetFWIds as string[] | undefined,
  );
  const { frameworks: channelFrameworks, collectionAdditionalCategories } = useChannelData(
    config?.context?.channel as string | undefined,
  );
  const orgFrameworks = channelFrameworks?.map(f => ({ label: f.name, value: f.identifier }));
  const frameworkDetails = { organisationFramework, targetFrameworks, orgFrameworks, channelAdditionalCategories: collectionAdditionalCategories };

  // selectedNodeId must be declared before it is used in effectiveMeta
  const selectedNodeId = useTreeStore(s => s.selectedNodeId);

  // Merge treeCache edits on top of nodeMetadata so the form restores user edits
  // when switching back to a previously-edited node (avoids reset-on-reselect).
  const treeCache = useTreeStore(s => s.treeCache);
  const cachedEdits = selectedNodeId ? (treeCache[selectedNodeId] ?? {}) : {};
  const effectiveMeta = { ...nodeMetadata, ...cachedEdits };

  // Use category-definition API fields if available, fall back to static config
  const apiFields = isRoot ? rootFormConfig : unitFormConfig;
  const formConfig = apiFields
    ? (apiFields as Array<Record<string, unknown>>)
    : ((config?.config.hierarchy as Record<string, unknown>)?.formConfig as Array<Record<string, unknown>> ?? []);
  const allFields = useFieldPrepare(formConfig, effectiveMeta, frameworkDetails, isRoot);
  // appIcon is always rendered in the title row (TitleAppIcon), never in the form grid
  const tabFields = allFields.filter(f => f.tab === activeTab && f.inputType !== 'appIcon');

  const form = useForm<Record<string, unknown>>({
    mode: 'onChange',
    defaultValues: Object.fromEntries(
      allFields.map(f => {
        const arrayTypes = ['multiselect', 'chips', 'keywords', 'tagsinput'];
        const objectTypes = ['nestedselect'];
        if (arrayTypes.includes(f.inputType)) return [f.code, f.currentValue ?? f.defaultValue ?? []];
        if (objectTypes.includes(f.inputType)) return [f.code, f.currentValue ?? f.defaultValue ?? {}];
        return [f.code, f.currentValue ?? f.defaultValue ?? ''];
      })
    ),
  });

  useCascade(form, allFields);

  // Keep refs pointing at the latest values so the watch callback (subscribed once
  // per form instance) never closes over stale data.
  const { updateNode } = useTreeStore();
  const allFieldsRef = useRef(allFields);
  allFieldsRef.current = allFields;
  const selectedNodeIdRef = useRef(selectedNodeId);
  selectedNodeIdRef.current = selectedNodeId;
  const onFormValueChangeRef = useRef(onFormValueChange);
  onFormValueChangeRef.current = onFormValueChange;
  const onFormStatusChangeRef = useRef(onFormStatusChange);
  onFormStatusChangeRef.current = onFormStatusChange;

  // Report initial validity on mount — mirrors Angular's setTimeout(() => emitStatus(), 0).
  // This ensures the parent (SplitBuilderShell) knows the form is invalid from the start
  // when required fields are empty, so Save is disabled before the user touches anything.
  useEffect(() => {
    // RHF doesn't trigger validation on mount with defaultValues; run it manually so
    // formState.errors is populated before we read it.
    form.trigger().then(() => {
      const errors = form.formState.errors;
      const fields = allFieldsRef.current;
      const errorTabs = Array.from(new Set(
        Object.keys(errors).map(code => fields.find(f => f.code === code)?.tab).filter(Boolean)
      )) as Array<'details' | 'audience' | 'licensing'>;
      onFormStatusChangeRef.current(Object.keys(errors).length === 0, errorTabs);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // once per form instance (form re-mounts per node via key={selectedNodeId})

  // Subscribe once per form instance (key={selectedNodeId} gives a fresh form per node).
  // Write only the specific field that changed — avoids the RHF timing issue where
  // formState.dirtyFields is not yet updated when the watch callback fires for
  // setValue-based fields (SelectField / MultiSelectField).
  useEffect(() => {
    const sub = form.watch((_, { name: changedField }) => {
      const nodeId = selectedNodeIdRef.current;
      if (!nodeId) return;
      const fields = allFieldsRef.current;
      const validCodes = new Set(fields.map(f => f.code));

      if (changedField && validCodes.has(changedField)) {
        // Single field changed — write just that field to treeCache
        const value = form.getValues(changedField as string);
        updateNode(nodeId, { [changedField]: value });
        onFormValueChangeRef.current({ [changedField]: value });
      } else if (!changedField) {
        // Batch / cascade update — write all valid codes
        const allValues = form.getValues();
        const patch = Object.fromEntries(
          Object.entries(allValues).filter(([k]) => validCodes.has(k))
        );
        if (Object.keys(patch).length > 0) {
          updateNode(nodeId, patch);
          onFormValueChangeRef.current(patch);
        }
      }

      const errors = form.formState.errors;
      const errorTabs = Array.from(new Set(
        Object.keys(errors).map(code => fields.find(f => f.code === code)?.tab).filter(Boolean)
      )) as Array<'details' | 'audience' | 'licensing'>;
      onFormStatusChangeRef.current(Object.keys(errors).length === 0, errorTabs);
    });
    return () => sub.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const isReadOnly = editorMode !== 'edit';

  // Group consecutive fields with the same section key into boxes.
  const sectionGroups = tabFields.reduce<Array<{ section: string | undefined; fields: typeof tabFields }>>(
    (acc, field) => {
      const last = acc[acc.length - 1];
      if (last && last.section === field.section) {
        last.fields.push(field);
      } else {
        acc.push({ section: field.section, fields: [field] });
      }
      return acc;
    },
    [],
  );

  const renderField = (field: typeof tabFields[number]) => {
    const commonProps = {
      key: field.code,
      name: field.code,
      label: field.label,
      required: field.required,
      disabled: isReadOnly || field.editable === false,
    };
    switch (field.inputType) {
      case 'textarea':
        return <TextField {...commonProps} multiline maxLength={field.maxLength} />;
      case 'select':
        return <SelectField {...commonProps} options={field.options ?? []} />;
      case 'multiselect':
        return <MultiSelectField {...commonProps} options={field.options ?? []} />;
      case 'chips':
        return <ChipGroupField {...commonProps} />;
      case 'radio':
        return <RadioField {...commonProps} options={field.options ?? []} />;
      case 'appIcon':
        return <AppIconField {...commonProps} nodeId={selectedNodeId ?? ''} />;
      case 'datepicker':
      case 'datetime':
        return <DateTimeField {...commonProps} />;
      case 'keywords':
      case 'tagsinput':
        return <KeywordSuggestField {...commonProps} />;
      case 'nestedselect':
        return <NestedSelectField {...commonProps} levels={field.levels ?? []} />;
      case 'license':
        return <LicenseSelectField {...commonProps} />;
      case 'dialcode':
        return <DialcodeInputField {...commonProps} />;
      default:
        return <TextField {...commonProps} maxLength={field.maxLength} />;
    }
  };

  return (
    <FormProvider {...form}>
      <div className={styles.form}>
        {sectionGroups.map((group, idx) => {
          const display = group.section ? SECTION_DISPLAY[group.section] : undefined;
          if (display) {
            return (
              <FormSection key={group.section ?? idx} title={display.title} description={display.description}>
                {group.fields.map(renderField)}
              </FormSection>
            );
          }
          // Fields with no known section: render flat inside an unstyled wrapper
          return (
            <div key={idx} className={styles.ungrouped}>
              {group.fields.map(renderField)}
            </div>
          );
        })}
        {tabFields.length === 0 && !fwLoading && (
          <p className={styles.noFields}>No fields configured for this tab.</p>
        )}
      </div>
    </FormProvider>
  );
};
