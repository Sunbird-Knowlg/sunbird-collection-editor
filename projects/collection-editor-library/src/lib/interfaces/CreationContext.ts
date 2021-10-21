export interface ICreationContext {
    objectType?: string;
    collectionObjectType?: string;
    isReadOnlyMode?: boolean | undefined;
    mode?: string;
    correctionComments?: string,
    editableFields?: string[] | undefined;
    index?: number;
  }