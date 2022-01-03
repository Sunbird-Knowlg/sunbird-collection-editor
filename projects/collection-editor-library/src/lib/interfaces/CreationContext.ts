export interface ICreationContext {
    objectType?: string;
    collectionObjectType?: string;
    unitIdentifier?: string;
    isReadOnlyMode?: boolean | undefined;
    mode?: string;
    correctionComments?: string,
    editableFields?: any;
    index?: number;
  }
