import React, { useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import toast from 'react-hot-toast';
import { Info } from 'lucide-react';
import type { EditorMode } from '../../types/editor';
import { useTreeStore } from '../../store/tree.store';
import { useEditorStore } from '../../store/editor.store';
import { useFramework } from '../../hooks/useFramework';
import { useFrameworkOptions } from '../../hooks/useFrameworkOptions';
import { useChannelData } from '../../hooks/useChannelData';
import { useUserFullName } from '../../hooks/useUserFullName';
import { useLabels } from '../../hooks/useLabels';
import { useFieldPrepare, SECTION_DISPLAY } from './hooks/useFieldPrepare';
import type { IPrepareContext } from './hooks/useFieldPrepare';
import { transformEmit, transformFieldPatch } from './hooks/emitTransform';
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
  const lbl = useLabels();
  const config = useEditorStore(s => s.editorConfig);
  const rootFormConfig = useEditorStore(s => s.rootFormConfig);
  const unitFormConfig = useEditorStore(s => s.unitFormConfig);
  const categoryMeta = useEditorStore(s => s.categoryMeta);
  // Framework resolved from the loaded content (rootNode.framework) wins over
  // the editor context — mirrors Angular's `collection.framework || context.framework`.
  const contentFramework = useEditorStore(s => s.contentFramework);
  const contentTargetFWIds = useEditorStore(s => s.contentTargetFWIds);
  const { organisationFramework, targetFrameworks, isLoading: fwLoading } = useFramework(
    (contentFramework ?? config?.context?.framework) as string | undefined,
    (contentTargetFWIds ?? config?.context?.targetFWIds) as string[] | undefined,
  );
  const {
    frameworks: channelFrameworks,
    collectionAdditionalCategories,
    contentAdditionalCategories,
    defaultLicense: channelDefaultLicense,
    name: channelName,
  } = useChannelData(config?.context?.channel as string | undefined);
  // Current user's display name — auto-fills the author field when the host
  // app doesn't pass context.user.fullName.
  const fetchedUserFullName = useUserFullName(
    (config?.context?.userId ?? config?.context?.uid) as string | undefined,
  );
  // Course Type options: channel frameworks filtered/extended by orgFWType.
  const orgFrameworks = useFrameworkOptions(
    channelFrameworks,
    categoryMeta?.frameworkMetadata?.orgFWType,
    config?.context?.channel as string | undefined,
  );
  const frameworkDetails = { organisationFramework, targetFrameworks, orgFrameworks, channelAdditionalCategories: collectionAdditionalCategories };

  // selectedNodeId must be declared before it is used in effectiveMeta
  const selectedNodeId = useTreeStore(s => s.selectedNodeId);
  const treeData = useTreeStore(s => s.treeData);

  // Merge treeCache edits on top of nodeMetadata so the form restores user edits
  // when switching back to a previously-edited node (avoids reset-on-reselect).
  const treeCache = useTreeStore(s => s.treeCache);
  const cachedEdits = selectedNodeId ? (treeCache[selectedNodeId] ?? {}) : {};
  const effectiveMeta = { ...nodeMetadata, ...cachedEdits };

  // Count the active node's direct children — feeds the maxQuestions range.
  const childCount = React.useMemo(() => {
    if (!selectedNodeId) return 0;
    const queue = [...treeData];
    while (queue.length) {
      const n = queue.shift()!;
      if (n.id === selectedNodeId) return n.children?.length ?? 0;
      if (n.children) queue.push(...n.children);
    }
    return 0;
  }, [treeData, selectedNodeId]);

  // Extra inputs Angular reads from EditorService / channelInfo / ConfigService.
  const cfg = (config?.config ?? {}) as Record<string, unknown>;
  const ctxCtx = (config?.context ?? {}) as Record<string, unknown>;
  const prepareCtx: IPrepareContext = {
    editorMode,
    editableFields: cfg.editableFields as Record<string, string[]> | undefined,
    objectType: cfg.objectType as string | undefined,
    setDefaultCopyRight: cfg.setDefaultCopyRight === true,
    defaultLicense: (ctxCtx.defaultLicense as string | undefined) ?? channelDefaultLicense,
    contextAdditionalCategories: ctxCtx.additionalCategories as string[] | undefined,
    // Host-provided name wins; otherwise resolved from the user-read API.
    userFullName: (ctxCtx.user as { fullName?: string } | undefined)?.fullName ?? fetchedUserFullName,
    channelName,
    collectionAdditionalCategories,
    contentAdditionalCategories,
    childCount,
  };

  // Use category-definition API fields if available, fall back to static config
  const apiFields = isRoot ? rootFormConfig : unitFormConfig;
  const formConfig = apiFields
    ? (apiFields as Array<Record<string, unknown>>)
    : ((config?.config.hierarchy as Record<string, unknown>)?.formConfig as Array<Record<string, unknown>> ?? []);
  const allFields = useFieldPrepare(formConfig, effectiveMeta, frameworkDetails, isRoot, prepareCtx);
  // appIcon is always rendered in the title row (TitleAppIcon), never in the form grid.
  // Fields with visible === false (e.g. dialcodes when QR code is "No") are excluded.
  const tabFields = allFields.filter(f => f.tab === activeTab && f.inputType !== 'appIcon' && f.visible !== false);

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
  // Track previous shuffle so we can fire the "shuffling enabled" toast only on
  // the false→true transition (mirrors Angular showShuffleMessage).
  const prevShuffleRef = useRef<boolean | undefined>(
    typeof effectiveMeta.shuffle === 'boolean' ? (effectiveMeta.shuffle as boolean) : undefined,
  );
  const nodeTitleRef = useRef<string>((effectiveMeta.name as string) ?? '');
  nodeTitleRef.current = (effectiveMeta.name as string) ?? '';
  const editorModeRef = useRef(editorMode);
  editorModeRef.current = editorMode;
  const REVIEW_MODES = ['review', 'read', 'sourcingreview', 'orgreview'];

  // Report initial validity on mount — mirrors Angular's setTimeout(() => emitStatus(), 0).
  // This ensures the parent (SplitBuilderShell) knows the form is invalid from the start
  // when required fields are empty, so Save is disabled before the user touches anything.
  // Also syncs normalized currentValues to treeCache so multiselect fields like medium
  // are stored as arrays from the first load, even if the user never changes them.
  useEffect(() => {
    const nodeId = selectedNodeIdRef.current;
    if (nodeId) {
      const patch = Object.fromEntries(
        allFieldsRef.current
          .filter(f => f.currentValue !== undefined && f.currentValue !== null)
          .map(f => [f.code, f.currentValue])
      );
      if (Object.keys(patch).length > 0) updateNode(nodeId, patch);
    }

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
        // Single field changed — write just that field to treeCache.
        // dialcodes must always be stored as an array (API expects string[]).
        let value = form.getValues(changedField as string);
        if (changedField === 'dialcodes') {
          value = Array.isArray(value) ? value : (value ? [value] : []);
        }
        // Shuffle false→true shows an info toast (Angular showShuffleMessage).
        if (changedField === 'shuffle') {
          if (value === true && prevShuffleRef.current === false) {
            toast(lbl.sparkMetaForm.shuffleEnabledMessage, { icon: <Info size={16} /> });
          }
          prevShuffleRef.current = value as boolean;
        }
        // Course Type IS the framework selector: apply it to the store
        // immediately so useFramework refetches and the field set re-shapes
        // live (e.g. USF → industry/domain/skill). Without this the switch
        // only takes effect after reload — the user gets no feedback and the
        // saved framework silently disagrees with the fields they filled.
        if (changedField === 'framework' && isRoot && typeof value === 'string' && value) {
          const editorState = useEditorStore.getState();
          editorState.setContentFramework(value, editorState.contentTargetFWIds);
        }
        // transformFieldPatch omits UI-only keys (allowECM/setPeriod → null) and
        // maps levels→outcomeDeclaration, instances→{label}.
        const patch = transformFieldPatch(changedField, value);
        if (patch) {
          updateNode(nodeId, patch);
          onFormValueChangeRef.current(patch);
        }
      } else if (!changedField) {
        // Batch / cascade update — write all valid codes, transformed.
        const allValues = form.getValues();
        const valid = Object.fromEntries(
          Object.entries(allValues).filter(([k]) => validCodes.has(k))
        );
        const patch = transformEmit(valid, {
          isReview: REVIEW_MODES.includes(editorModeRef.current),
          nodeTitle: nodeTitleRef.current,
        });
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

  // Late-arriving defaults: RHF captures defaultValues at mount, but the user
  // name (user-read API) and channel name resolve async. When they land, seed
  // any still-empty licensing fields so the values are visible and persisted
  // (setValue fires the watch subscription → treeCache patch).
  useEffect(() => {
    for (const code of ['author', 'creator', 'copyright', 'copyrightYear', 'license'] as const) {
      const field = allFieldsRef.current.find(f => f.code === code);
      if (!field || field.currentValue === undefined || field.currentValue === null || field.currentValue === '') continue;
      const formValue = form.getValues(code);
      if (formValue === undefined || formValue === null || formValue === '') {
        form.setValue(code, field.currentValue, { shouldDirty: false });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchedUserFullName, channelName, form]);

  // Per-field editability is computed in useFieldPrepare (computeEditable):
  // outside review modes a field is editable unless the API says otherwise;
  // inside review/read/sourcingreview/orgreview only editableFields[mode] codes
  // stay editable. So a field is disabled iff its computed `editable` is false.

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
      disabled: field.editable === false,
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
          <p className={styles.noFields}>{lbl.sparkMetaForm.noFieldsMessage}</p>
        )}
      </div>
    </FormProvider>
  );
};
