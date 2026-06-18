export interface ITerm {
  identifier: string;
  name: string;
  code: string;
  index?: number;
  associations?: ITerm[];
}

export interface ICategory {
  identifier: string;
  name: string;
  code: string;
  terms?: ITerm[];
}

export interface IFramework {
  identifier: string;
  name: string;
  code: string;
  categories?: ICategory[];
}

export interface IFrameworkDetails {
  organisationFramework?: IFramework;
  targetFrameworks?: IFramework[];
}
