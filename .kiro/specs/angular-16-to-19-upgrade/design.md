# Design Document: Angular 16 to 19 LTS Upgrade

## Overview

This design outlines the technical approach for upgrading the Sunbird Collection Editor from Angular 16.2.x to Angular 19.x LTS. The upgrade must be performed incrementally (16 → 17 → 18 → 19) to ensure compatibility and allow Angular's automated migration schematics to handle breaking changes. The project consists of three build targets: a main application, an Angular library (NPM package), and a web component built using Angular Elements.

### Key Constraints

- **Incremental Upgrade Required**: Angular only supports upgrading one major version at a time
- **Web Component Focus**: Primary concern is the web component build and publish workflow
- **Custom Build Process**: The build-wc.js script concatenates multiple output files into a single bundle
- **Third-Party Dependencies**: Multiple @project-sunbird packages may not have Angular 19 versions available
- **Backward Compatibility**: The library must maintain API compatibility for existing consumers

## Architecture

### Current Architecture (Angular 16)

```
sunbird-collection-editor/
├── src/                                    # Main application
├── projects/
│   ├── collection-editor-library/          # Angular library (NPM package)
│   │   ├── src/lib/                        # Library source code
│   │   ├── package.json                    # Library package metadata
│   │   └── ng-package.json                 # ng-packagr configuration
│   └── collection-editor-library-wc/       # Web component application
│       └── src/app/app.module.ts           # Angular Elements bootstrap
├── build-wc.js                             # Concatenates build outputs
├── angular.json                            # Angular CLI configuration
└── package.json                            # Root dependencies
```

### Target Architecture (Angular 19)

The architecture remains the same, but with updated configurations:

- **Standalone Components**: Angular 19 defaults to standalone components, but the project uses NgModules
- **Build Output**: Angular 19 may change output file structure (runtime, polyfills, main, scripts)
- **TypeScript 5.7**: Required for Angular 19 compatibility
- **Node.js >= 18.19.1**: Minimum version requirement

## Components and Interfaces

### 1. Package Manager and Dependencies

**Component**: npm with package.json and package-lock.json

**Responsibilities**:
- Manage all Angular and third-party dependencies
- Resolve peer dependency conflicts
- Lock dependency versions for reproducible builds

**Key Dependencies to Update**:

```typescript
interface AngularCoreDependencies {
  "@angular/core": "^19.0.0",
  "@angular/common": "^19.0.0",
  "@angular/compiler": "^19.0.0",
  "@angular/platform-browser": "^19.0.0",
  "@angular/platform-browser-dynamic": "^19.0.0",
  "@angular/router": "^19.0.0",
  "@angular/forms": "^19.0.0",
  "@angular/animations": "^19.0.0",
  "@angular/cdk": "^19.0.0",
  "@angular/material": "^19.0.0",
  "@angular/elements": "^19.0.0"
}

interface BuildToolchain {
  "@angular/cli": "^19.0.0",
  "@angular-devkit/build-angular": "^19.0.0",
  "ng-packagr": "^19.0.0",  // Official ng-packagr for Angular 19
  "typescript": "~5.7.0",
  "zone.js": "~0.15.0"
}

interface ThirdPartyDependencies {
  "ngx-bootstrap": "^12.0.0",  // Angular 19 compatible
  "ngx-infinite-scroll": "^19.0.0",  // Angular 19 compatible
  "ngx-chips": "^3.0.0"  // May need alternative or fork
}
```

**Sunbird Dependencies Strategy**:
- Check each @project-sunbird package for Angular 19 compatibility
- Use npm overrides/resolutions if packages declare incompatible peer dependencies
- Document which packages need updates from Sunbird team

### 2. Angular CLI and Migration Schematics

**Component**: @angular/cli with ng update command

**Responsibilities**:
- Execute automated migrations for each version
- Update configuration files (angular.json, tsconfig.json)
- Apply code transformations for breaking changes

**Migration Sequence**:

```typescript
interface MigrationStep {
  version: string;
  command: string;
  expectedChanges: string[];
  manualSteps: string[];
}

const migrationPlan: MigrationStep[] = [
  {
    version: "17",
    command: "ng update @angular/core@17 @angular/cli@17",
    expectedChanges: [
      "Add standalone: false to all NgModule-based components",
      "Update angular.json builder configurations",
      "Update TypeScript to 5.2+",
      "Update Node.js requirement to >= 18.13.0"
    ],
    manualSteps: [
      "Review new control flow syntax (@if, @for) - optional migration",
      "Test build-wc.js with new output structure"
    ]
  },
  {
    version: "18",
    command: "ng update @angular/core@18 @angular/cli@18",
    expectedChanges: [
      "Update TypeScript to 5.4+",
      "Apply zoneless change detection migrations if applicable",
      "Update router configurations"
    ],
    manualSteps: [
      "Review @defer syntax for lazy loading - optional",
      "Test signal-based APIs if used"
    ]
  },
  {
    version: "19",
    command: "ng update @angular/core@19 @angular/cli@19",
    expectedChanges: [
      "Update TypeScript to 5.7",
      "Standalone components become default (standalone: false required for NgModules)",
      "Update zone.js to 0.15.x",
      "Apply explicit-standalone-flag migration"
    ],
    manualSteps: [
      "Verify build-wc.js works with Angular 19 output",
      "Test web component in target browsers",
      "Update library peer dependencies"
    ]
  }
];
```

### 3. Build System Configuration

**Component**: angular.json and tsconfig.json

**Responsibilities**:
- Define build targets and configurations
- Configure TypeScript compiler options
- Specify asset and style processing

**Key Configuration Updates**:

```typescript
interface TypeScriptConfig {
  target: "ES2022",  // Angular 19 requirement
  module: "ES2022",
  lib: ["ES2022", "dom"],
  useDefineForClassFields: false,  // Maintain Angular 16 behavior
  moduleResolution: "node",
  resolveJsonModule: true
}

interface AngularBuildConfig {
  // Angular 19 may introduce new builder options
  builder: "@angular-devkit/build-angular:browser" | "@angular-devkit/build-angular:ng-packagr",
  options: {
    outputPath: string,
    preserveSymlinks: boolean,  // Important for library builds
    outputHashing: "none",  // Required for build-wc.js concatenation
    optimization: boolean,
    sourceMap: boolean
  }
}
```

**Potential Breaking Change**: Angular 19 may change the default builder or output structure. The build-wc.js script expects specific file names (runtime.js, polyfills.js, scripts.js, main.js).

### 4. Web Component Build Process

**Component**: build-wc.js concatenation script

**Responsibilities**:
- Concatenate Angular build outputs into single file
- Copy assets to web-component/ and web-component-demo/ directories
- Produce distributable web component bundle

**Current Implementation**:

```javascript
const files = [
  "./dist/collection-editor-library-wc/runtime.js",
  "./dist/collection-editor-library-wc/polyfills.js",
  "./dist/collection-editor-library-wc/scripts.js",
  "./dist/collection-editor-library-wc/main.js"
];
```

**Potential Issues**:
- Angular 19 may rename or restructure output files
- New chunk splitting strategies may introduce additional files
- ES2022 output may affect browser compatibility

**Solution Strategy**:
1. After Angular 19 upgrade, inspect dist/collection-editor-library-wc/ directory
2. Update file list in build-wc.js if structure changed
3. Verify concatenated bundle works in target browsers
4. Consider using glob patterns for more resilient file discovery

### 5. Angular Elements Custom Element

**Component**: AppModule with DoBootstrap and createCustomElement

**Responsibilities**:
- Bootstrap Angular application as custom element
- Register 'lib-editor' custom element
- Provide dependency injection for web component

**Current Implementation**:

```typescript
@NgModule({
  declarations: [/* all components */],
  imports: [
    CommonModule,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot([]),
    // ... other modules
  ],
  providers: [
    { provide: DialcodeCursor, useExisting: DialcodeService }
  ]
})
export class AppModule implements DoBootstrap {
  constructor(private injector: Injector) {}
  
  ngDoBootstrap() {
    const customElement = createCustomElement(EditorComponent, { 
      injector: this.injector 
    });
    customElements.define('lib-editor', customElement);
  }
}
```

**Angular 19 Considerations**:
- Standalone components are default, but this uses NgModule (requires `standalone: false`)
- Angular Elements API remains stable across versions
- BrowserModule + CommonModule import order must be correct
- RouterModule.forRoot([]) with empty routes should still work

**Migration Impact**: The explicit-standalone-flag migration will add `standalone: false` to all components, directives, and pipes in this module.

### 6. Library Package Build

**Component**: ng-packagr with ng-package.json

**Responsibilities**:
- Build Angular library in Angular Package Format (APF)
- Generate type definitions (.d.ts files)
- Create FESM2022 bundles
- Prepare package for npm publishing

**Configuration**:

```json
{
  "$schema": "../../node_modules/ng-packagr/ng-package.schema.json",
  "dest": "../../dist/collection-editor-library",
  "lib": {
    "entryFile": "src/public-api.ts"
  }
}
```

**ng-packagr Compatibility**:
- Official ng-packagr supports Angular 19 as of version 19.x
- Alternative: @kv-systems/ng-packagr (community fork for Angular 19)
- Must update to ng-packagr@^19.0.0 or compatible version

**Library package.json Updates**:

```json
{
  "peerDependencies": {
    "@angular/common": "^19.0.0",
    "@angular/core": "^19.0.0",
    "@angular/cdk": "^19.0.0",
    // ... other Angular packages
  }
}
```

### 7. Testing Infrastructure

**Component**: Karma + Jasmine test runner

**Responsibilities**:
- Execute unit tests
- Generate code coverage reports
- Run tests in headless Chrome

**Angular 19 Compatibility**:
- Karma configuration remains largely unchanged
- Jasmine version should be updated to latest (5.x)
- karma-jasmine and karma-chrome-launcher need compatible versions

**Configuration Updates**:

```typescript
interface TestingDependencies {
  "karma": "~6.4.0",
  "karma-jasmine": "~5.1.0",
  "karma-chrome-launcher": "~3.2.0",
  "karma-coverage": "~2.2.0",
  "jasmine-core": "~5.1.0"
}
```

## Data Models

### Migration State Tracking

```typescript
interface MigrationState {
  currentVersion: string;
  targetVersion: string;
  completedSteps: MigrationStep[];
  pendingSteps: MigrationStep[];
  issues: MigrationIssue[];
}

interface MigrationIssue {
  severity: "error" | "warning" | "info";
  component: string;
  description: string;
  resolution: string;
  status: "open" | "resolved" | "deferred";
}
```

### Dependency Compatibility Matrix

```typescript
interface DependencyCompatibility {
  package: string;
  currentVersion: string;
  targetVersion: string;
  angular19Compatible: boolean;
  notes: string;
  action: "update" | "override" | "replace" | "wait";
}

const sunbirdPackages: DependencyCompatibility[] = [
  {
    package: "@project-sunbird/common-form-elements-full",
    currentVersion: "8.0.1",
    targetVersion: "TBD",
    angular19Compatible: false,
    notes: "Check with Sunbird team for Angular 19 version",
    action: "wait"
  },
  {
    package: "@project-sunbird/sunbird-quml-player",
    currentVersion: "8.0.0",
    targetVersion: "TBD",
    angular19Compatible: false,
    notes: "May need npm override for peer dependencies",
    action: "override"
  }
  // ... other Sunbird packages
];
```

## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Build Output Completeness
*For any* successful Angular 19 build of the web component project, the output directory SHALL contain all files required by build-wc.js (runtime.js, polyfills.js, scripts.js, main.js or their Angular 19 equivalents)

**Validates: Requirements 2.3, 8.1**

### Property 2: Web Component Registration
*For any* Angular 19 build, when the concatenated bundle is loaded in a browser, the custom element 'lib-editor' SHALL be successfully registered and usable in HTML

**Validates: Requirements 7.1, 7.2, 7.3**

### Property 3: Library Build Success
*For any* Angular 19 library build using ng-packagr, the output SHALL include valid package.json, type definitions (.d.ts), and FESM2022 bundles

**Validates: Requirements 2.1, 6.1**

### Property 4: Peer Dependency Compatibility
*For any* package that depends on the upgraded library, npm install SHALL complete without peer dependency conflicts when Angular 19.x is installed

**Validates: Requirements 3.3, 12.4**

### Property 5: Test Execution Success
*For any* test suite in the project, ng test SHALL execute without configuration errors after Angular 19 upgrade

**Validates: Requirements 11.3**

### Property 6: Development Server Functionality
*For any* project configuration, ng serve SHALL start the development server and serve the application without errors after Angular 19 upgrade

**Validates: Requirements 13.1, 13.4**

### Property 7: Security Vulnerability Resolution
*For any* production dependency, npm audit SHALL report zero high or critical vulnerabilities after Angular 19 upgrade

**Validates: Requirements 10.1, 10.2**

### Property 8: Build Script Compatibility
*For any* npm script defined in package.json, the script SHALL execute successfully with Angular 19 dependencies

**Validates: Requirements 8.4**

### Property 9: TypeScript Compilation
*For any* TypeScript file in the project, tsc SHALL compile without errors using TypeScript 5.7 and Angular 19 type definitions

**Validates: Requirements 5.1, 5.2**

### Property 10: Module Import Consistency
*For any* NgModule in the project, the combination of BrowserModule and CommonModule imports SHALL follow Angular 19 requirements

**Validates: Requirements 4.7**

## Error Handling

### Migration Errors

**Peer Dependency Conflicts**:
- **Error**: `ERESOLVE unable to resolve dependency tree`
- **Cause**: Third-party packages declare incompatible Angular peer dependencies
- **Solution**: Use npm overrides in package.json or --legacy-peer-deps flag
- **Prevention**: Check compatibility matrix before upgrading

**Build Failures**:
- **Error**: `Cannot find module '@angular/core'` or similar
- **Cause**: Incomplete dependency installation or version mismatch
- **Solution**: Delete node_modules and package-lock.json, run npm install
- **Prevention**: Use npm ci for clean installs

**ng-packagr Incompatibility**:
- **Error**: `ng-packagr does not support Angular 19`
- **Cause**: ng-packagr version too old
- **Solution**: Update to ng-packagr@^19.0.0 or use @kv-systems/ng-packagr fork
- **Prevention**: Check ng-packagr compatibility before upgrading Angular

**build-wc.js File Not Found**:
- **Error**: `ENOENT: no such file or directory, open './dist/collection-editor-library-wc/runtime.js'`
- **Cause**: Angular 19 changed output file structure
- **Solution**: Inspect dist directory and update file paths in build-wc.js
- **Prevention**: Test build-wc.js after each Angular version upgrade

### Runtime Errors

**Custom Element Not Defined**:
- **Error**: `Failed to execute 'define' on 'CustomElementRegistry'`
- **Cause**: Custom element name already registered or invalid
- **Solution**: Ensure unique element name and valid custom element naming
- **Prevention**: Test web component in isolation

**Zone.js Errors**:
- **Error**: `Zone already loaded` or `Zone.js has detected that ZoneAwarePromise has been overwritten`
- **Cause**: Multiple zone.js instances or version conflicts
- **Solution**: Ensure single zone.js version, check for duplicate imports
- **Prevention**: Use npm list zone.js to verify single version

**Style Encapsulation Issues**:
- **Error**: Styles not applied to web component
- **Cause**: Angular 19 ExternalStylesFeature extracts styles to separate files
- **Solution**: Configure inlineStyleLanguage and styles bundling in angular.json
- **Prevention**: Test web component styling after upgrade

### Testing Errors

**Karma Configuration Errors**:
- **Error**: `No provider for Karma!`
- **Cause**: Incompatible karma plugin versions
- **Solution**: Update all karma-* packages to compatible versions
- **Prevention**: Check karma ecosystem compatibility

**Test Compilation Errors**:
- **Error**: TypeScript errors in test files
- **Cause**: Stricter type checking or API changes
- **Solution**: Update test code to match new APIs, enable skipLibCheck if needed
- **Prevention**: Run tests after each migration step

## Testing Strategy

### Unit Testing

**Scope**: Individual components, services, and utilities

**Approach**:
- Run existing test suite after each migration step (16→17, 17→18, 18→19)
- Fix any test failures caused by API changes
- Maintain test coverage above current baseline
- Use `ng test` with ChromeHeadless for CI/CD

**Key Test Areas**:
1. Component rendering and lifecycle
2. Service dependency injection
3. Form validation and reactive forms
4. Router navigation
5. Custom directives and pipes

**Test Execution**:
```bash
# Run all tests
npm run test

# Run with coverage
npm run test-coverage

# Run specific project tests
ng test collection-editor-library
```

### Integration Testing

**Scope**: Web component integration and build process

**Approach**:
- Test web component in standalone HTML page
- Verify custom element registration
- Test component inputs and outputs
- Verify styling and asset loading

**Test Cases**:
1. **Web Component Loading**: Load sunbird-collection-editor.js in HTML page
2. **Custom Element Usage**: Use `<lib-editor>` tag with attributes
3. **Event Handling**: Verify component events fire correctly
4. **Style Isolation**: Ensure styles don't leak to/from host page
5. **Asset Loading**: Verify images, fonts, and other assets load

**Test Environment**:
- Create test HTML page in web-component-demo/
- Test in Chrome, Firefox, Safari, Edge
- Test with different Angular versions in host application

### Build Verification Testing

**Scope**: Build process and output validation

**Approach**:
- Verify all build commands succeed
- Inspect build output structure
- Validate bundle sizes
- Check for console errors/warnings

**Test Commands**:
```bash
# Library build
npm run build-lib

# Library production build
npm run build-lib:prod

# Web component build
npm run build-web-component

# Main application build
npm run build
```

**Validation Checks**:
1. All expected output files present
2. No TypeScript compilation errors
3. No Angular template errors
4. Bundle sizes within acceptable limits
5. Source maps generated correctly

### Regression Testing

**Scope**: Ensure existing functionality works after upgrade

**Approach**:
- Manual testing of key user workflows
- Automated E2E tests if available
- Visual regression testing for UI components

**Key Workflows**:
1. Create new collection
2. Add content to collection
3. Edit metadata
4. Preview content
5. Publish collection

### Property-Based Testing

**Scope**: Verify correctness properties defined in design

**Approach**:
- Write property tests for each correctness property
- Use automated scripts to verify properties
- Run property tests as part of CI/CD pipeline

**Property Test Implementation**:

```typescript
// Example property test for Build Output Completeness
describe('Property 1: Build Output Completeness', () => {
  it('should contain all required files after build', () => {
    const requiredFiles = [
      'dist/collection-editor-library-wc/runtime.js',
      'dist/collection-editor-library-wc/polyfills.js',
      'dist/collection-editor-library-wc/scripts.js',
      'dist/collection-editor-library-wc/main.js'
    ];
    
    requiredFiles.forEach(file => {
      expect(fs.existsSync(file)).toBe(true);
    });
  });
});

// Example property test for Web Component Registration
describe('Property 2: Web Component Registration', () => {
  it('should register lib-editor custom element', () => {
    // Load bundle in test environment
    require('../web-component/sunbird-collection-editor.js');
    
    // Verify custom element is defined
    expect(customElements.get('lib-editor')).toBeDefined();
  });
});
```

**Testing Tools**:
- Jasmine for unit tests
- Karma for test runner
- Puppeteer for E2E testing (if needed)
- npm audit for security testing
- Custom scripts for property verification

### Test Execution Strategy

**Phase 1: After Angular 17 Upgrade**
1. Run unit tests: `npm test`
2. Run build verification
3. Test web component manually
4. Fix any failures before proceeding

**Phase 2: After Angular 18 Upgrade**
1. Run unit tests: `npm test`
2. Run build verification
3. Test web component manually
4. Fix any failures before proceeding

**Phase 3: After Angular 19 Upgrade**
1. Run unit tests: `npm test`
2. Run build verification
3. Run integration tests
4. Run property tests
5. Run security audit: `npm audit`
6. Test web component in all target browsers
7. Perform regression testing

**Continuous Integration**:
- Run tests on every commit
- Block merges if tests fail
- Generate coverage reports
- Track test execution time

### Success Criteria

The upgrade is considered successful when:
1. All unit tests pass
2. All build commands succeed
3. Web component works in target browsers
4. No high/critical security vulnerabilities
5. All correctness properties verified
6. Library can be published to npm
7. Documentation updated
