# Requirements Document: Angular 16 to 19 LTS Upgrade

## Introduction

This document outlines the requirements for upgrading the Sunbird Collection Editor from Angular 16.2.x to Angular 19 LTS. The project is an Angular library that builds both as an NPM package and as a web component using Angular Elements. The primary focus is on the web component build and publish workflow while addressing all security vulnerabilities.

## Glossary

- **Collection_Editor**: The Sunbird Collection Editor Angular library
- **Web_Component**: The Angular Elements-based custom element build (`lib-editor`)
- **NPM_Package**: The Angular library package published as `@project-sunbird/sunbird-collection-editor`
- **Build_System**: The Angular CLI and ng-packagr build toolchain
- **Dependency_Tree**: All npm packages including Angular core, third-party Sunbird packages, and utilities
- **Migration_Script**: Angular CLI automated update commands (`ng update`)
- **Breaking_Change**: API or behavior changes requiring code modifications
- **Peer_Dependency**: Package dependencies declared in library's package.json that consumers must provide
- **Polyfills**: Browser compatibility shims for modern JavaScript features
- **Bundle_Concatenation**: The build-wc.js script that combines Angular build outputs

## Requirements

### Requirement 1: Angular Core Framework Upgrade

**User Story:** As a developer, I want to upgrade Angular from version 16.2.x to 19.x LTS, so that I can benefit from the latest features, performance improvements, and security patches.

#### Acceptance Criteria

1. WHEN upgrading Angular core packages, THE Build_System SHALL update @angular/core, @angular/common, @angular/compiler, @angular/platform-browser, @angular/platform-browser-dynamic, @angular/router, @angular/forms, @angular/animations to version 19.x
2. WHEN upgrading Angular CDK and Material, THE Build_System SHALL update @angular/cdk and @angular/material to version 19.x compatible versions
3. WHEN upgrading Angular Elements, THE Build_System SHALL update @angular/elements to version 19.x
4. WHEN upgrading Angular CLI, THE Build_System SHALL update @angular/cli and @angular-devkit/build-angular to version 19.x
5. WHEN upgrading TypeScript, THE Build_System SHALL update to TypeScript 5.7.x or the version required by Angular 19

### Requirement 2: Build Toolchain Compatibility

**User Story:** As a developer, I want the build toolchain to work with Angular 19, so that I can successfully build both the library and web component.

#### Acceptance Criteria

1. WHEN building the library, THE Build_System SHALL successfully compile using ng-packagr compatible with Angular 19
2. WHEN building the web component, THE Build_System SHALL successfully compile the collection-editor-library-wc project
3. WHEN running the build-wc.js script, THE Bundle_Concatenation SHALL successfully concatenate runtime.js, polyfills.js, scripts.js, and main.js files
4. WHEN the build completes, THE Build_System SHALL output valid JavaScript bundles to web-component/ and web-component-demo/ directories
5. WHEN using the --output-hashing none flag, THE Build_System SHALL produce predictable file names for concatenation

### Requirement 3: Third-Party Sunbird Dependencies Update

**User Story:** As a developer, I want to ensure all Sunbird-specific dependencies are compatible with Angular 19, so that the editor functions correctly.

#### Acceptance Criteria

1. WHEN checking @project-sunbird packages, THE Dependency_Tree SHALL identify which packages need Angular 19 compatible versions
2. WHEN @project-sunbird packages are incompatible, THE Migration_Script SHALL document required version updates or workarounds
3. WHEN peer dependencies are declared, THE NPM_Package SHALL specify Angular 19.x in peerDependencies
4. IF Sunbird packages are not yet Angular 19 compatible, THEN THE Migration_Script SHALL provide a strategy for temporary compatibility (e.g., package resolutions, version overrides)
5. WHEN the library builds, THE Build_System SHALL not produce peer dependency warnings for Angular versions

### Requirement 4: Breaking Changes Resolution

**User Story:** As a developer, I want to identify and resolve all breaking changes from Angular 16 to 19, so that the application compiles and runs correctly.

#### Acceptance Criteria

1. WHEN Angular 17 breaking changes are encountered, THE Migration_Script SHALL apply automated migrations where available
2. WHEN Angular 18 breaking changes are encountered, THE Migration_Script SHALL apply automated migrations where available
3. WHEN Angular 19 breaking changes are encountered, THE Migration_Script SHALL apply automated migrations where available
4. WHEN manual code changes are required, THE Migration_Script SHALL document each required change with file locations
5. WHEN deprecated APIs are used, THE Migration_Script SHALL identify and update them to current APIs
6. WHEN RouterModule.forRoot([]) is used, THE Build_System SHALL ensure compatibility with Angular 19 router configuration
7. WHEN CommonModule and BrowserModule are both imported, THE Build_System SHALL verify correct module import order for Angular 19

### Requirement 5: TypeScript Configuration Updates

**User Story:** As a developer, I want TypeScript configurations updated for Angular 19 compatibility, so that compilation succeeds without errors.

#### Acceptance Criteria

1. WHEN tsconfig.json is processed, THE Build_System SHALL use target ES2022 or higher as required by Angular 19
2. WHEN useDefineForClassFields is set, THE Build_System SHALL use the value required by Angular 19
3. WHEN module resolution is configured, THE Build_System SHALL use settings compatible with Angular 19
4. WHEN lib arrays are specified, THE Build_System SHALL include libraries required by Angular 19
5. WHEN strict mode options are evaluated, THE Build_System SHALL recommend enabling strict mode for better type safety

### Requirement 6: Polyfills and Browser Support

**User Story:** As a developer, I want to ensure browser compatibility is maintained after the upgrade, so that the web component works in all supported browsers.

#### Acceptance Criteria

1. WHEN polyfills.ts is evaluated, THE Build_System SHALL remove polyfills no longer needed in Angular 19
2. WHEN zone.js is configured, THE Build_System SHALL use version compatible with Angular 19
3. WHEN the web component loads, THE Web_Component SHALL function correctly in all target browsers
4. WHEN reflect-metadata is used, THE Build_System SHALL verify it's still required for Angular 19
5. WHEN browserslist configuration exists, THE Build_System SHALL ensure it aligns with Angular 19 browser support

### Requirement 7: Web Component Custom Element Registration

**User Story:** As a developer, I want the Angular Elements custom element registration to work with Angular 19, so that the web component can be embedded in any web page.

#### Acceptance Criteria

1. WHEN createCustomElement is called, THE Web_Component SHALL successfully create a custom element with Angular 19
2. WHEN customElements.define is called, THE Web_Component SHALL register 'lib-editor' as a valid custom element
3. WHEN the custom element is used in HTML, THE Web_Component SHALL bootstrap and render correctly
4. WHEN DoBootstrap lifecycle is used, THE Web_Component SHALL initialize properly with Angular 19
5. WHEN the Injector is provided to createCustomElement, THE Web_Component SHALL have access to all required services

### Requirement 8: Build Scripts and Automation

**User Story:** As a developer, I want all build scripts to work with Angular 19 output, so that the automated build process succeeds.

#### Acceptance Criteria

1. WHEN build-wc.js executes, THE Bundle_Concatenation SHALL locate all required output files from Angular 19 build
2. WHEN file concatenation occurs, THE Bundle_Concatenation SHALL produce a valid single JavaScript file
3. WHEN assets-copy.js executes, THE Build_System SHALL copy all required assets to the correct locations
4. WHEN npm run build-web-component executes, THE Build_System SHALL complete all steps without errors
5. IF Angular 19 changes output file structure, THEN THE Bundle_Concatenation SHALL be updated to match new structure

### Requirement 9: Dependency Version Compatibility

**User Story:** As a developer, I want all third-party dependencies to be compatible with Angular 19, so that there are no runtime conflicts.

#### Acceptance Criteria

1. WHEN ngx-bootstrap is evaluated, THE Dependency_Tree SHALL use version 12.x or higher compatible with Angular 19
2. WHEN ngx-chips is evaluated, THE Dependency_Tree SHALL verify compatibility or find alternatives
3. WHEN ngx-infinite-scroll is evaluated, THE Dependency_Tree SHALL use version compatible with Angular 19
4. WHEN jQuery and jQuery.fancytree are evaluated, THE Build_System SHALL ensure they work with Angular 19 build output
5. WHEN video.js and related plugins are evaluated, THE Build_System SHALL verify no conflicts with Angular 19

### Requirement 10: Security Vulnerability Resolution

**User Story:** As a developer, I want to resolve all security vulnerabilities, so that the application is secure for production use.

#### Acceptance Criteria

1. WHEN npm audit is run, THE Dependency_Tree SHALL show zero high or critical vulnerabilities
2. WHEN the XSRF token leakage vulnerability (GHSA-58c5-g7wp-6w37) is addressed, THE Build_System SHALL use Angular 19.2.16 or higher
3. WHEN vulnerable transitive dependencies are identified, THE Migration_Script SHALL update or override them to secure versions
4. WHEN package-lock.json is regenerated, THE Dependency_Tree SHALL contain only secure package versions
5. WHEN npm audit fix is run, THE Build_System SHALL not introduce breaking changes to the application

### Requirement 11: Testing Infrastructure Update

**User Story:** As a developer, I want the testing infrastructure to work with Angular 19, so that I can run unit tests successfully.

#### Acceptance Criteria

1. WHEN Karma is configured, THE Build_System SHALL use version compatible with Angular 19
2. WHEN Jasmine is configured, THE Build_System SHALL use version compatible with Angular 19
3. WHEN ng test is executed, THE Build_System SHALL run tests without configuration errors
4. WHEN test coverage is generated, THE Build_System SHALL produce accurate coverage reports
5. WHEN ChromeHeadless is used, THE Build_System SHALL successfully run tests in headless mode

### Requirement 12: Library Package Configuration

**User Story:** As a developer, I want the library package.json to correctly declare Angular 19 peer dependencies, so that consumers can install the package without conflicts.

#### Acceptance Criteria

1. WHEN the library package.json is updated, THE NPM_Package SHALL declare Angular 19.x in peerDependencies
2. WHEN peer dependencies are specified, THE NPM_Package SHALL use appropriate version ranges (e.g., ^19.0.0)
3. WHEN the library is published, THE NPM_Package SHALL include all required metadata
4. WHEN consumers install the package, THE NPM_Package SHALL not cause peer dependency conflicts
5. WHEN the library version is incremented, THE NPM_Package SHALL follow semantic versioning for the major version bump

### Requirement 13: Development Server Compatibility

**User Story:** As a developer, I want the development server to work with Angular 19, so that I can test changes locally.

#### Acceptance Criteria

1. WHEN ng serve is executed, THE Build_System SHALL start the development server without errors
2. WHEN the proxy configuration is loaded, THE Build_System SHALL correctly proxy API requests
3. WHEN hot module replacement occurs, THE Build_System SHALL reload changes without full page refresh
4. WHEN the application is served, THE Web_Component SHALL function correctly in the browser
5. WHEN source maps are generated, THE Build_System SHALL enable debugging in browser developer tools

### Requirement 14: Production Build Optimization

**User Story:** As a developer, I want production builds to be optimized with Angular 19, so that the web component has minimal bundle size.

#### Acceptance Criteria

1. WHEN production build is executed, THE Build_System SHALL apply tree-shaking to remove unused code
2. WHEN optimization is enabled, THE Build_System SHALL minify JavaScript and CSS
3. WHEN bundle budgets are evaluated, THE Build_System SHALL warn if bundles exceed size limits
4. WHEN the web component bundle is created, THE Bundle_Concatenation SHALL produce an optimized single file
5. WHEN differential loading is considered, THE Build_System SHALL use Angular 19 best practices for browser targeting

### Requirement 15: Migration Documentation

**User Story:** As a developer, I want comprehensive documentation of the migration process, so that I can understand what changed and troubleshoot issues.

#### Acceptance Criteria

1. WHEN the migration is complete, THE Migration_Script SHALL document all package version changes
2. WHEN breaking changes are resolved, THE Migration_Script SHALL document each code modification made
3. WHEN configuration files are updated, THE Migration_Script SHALL document the changes and reasons
4. WHEN issues are encountered, THE Migration_Script SHALL document solutions and workarounds
5. WHEN the migration is successful, THE Migration_Script SHALL provide a summary of all changes and next steps
