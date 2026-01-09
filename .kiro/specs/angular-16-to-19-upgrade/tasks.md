# Implementation Plan: Angular 16 to 19 LTS Upgrade

## Overview

This implementation plan breaks down the Angular upgrade into discrete, testable steps. The upgrade must be performed incrementally (16→17→18→19) with verification at each stage. Each task builds on previous steps and includes specific requirements references for traceability.

## Tasks

- [ ] 1. Pre-Upgrade Preparation and Baseline
  - Create backup branch of current working state
  - Document current versions of all dependencies
  - Run and document baseline test results
  - Run npm audit and document current vulnerabilities
  - Verify current build process works (npm run build-web-component)
  - _Requirements: 15.1, 15.2_

- [-] 2. Upgrade to Angular 17
  - [-] 2.1 Execute Angular 17 migration
    - Run `ng update @angular/core@17 @angular/cli@17`
    - Review and accept migration prompts
    - Document any warnings or errors
    - _Requirements: 1.1, 4.1_

  - [ ] 2.2 Update TypeScript and Node.js requirements
    - Update TypeScript to 5.2.x or higher
    - Verify Node.js version >= 18.13.0
    - Update tsconfig.json if needed
    - _Requirements: 1.5, 5.1_

  - [ ] 2.3 Update third-party dependencies for Angular 17
    - Update ngx-bootstrap to Angular 17 compatible version
    - Update ngx-infinite-scroll to Angular 17 compatible version
    - Update @angular/cdk and @angular/material to 17.x
    - _Requirements: 1.2, 9.1, 9.3_

  - [ ] 2.4 Resolve peer dependency conflicts
    - Check for peer dependency warnings
    - Add npm overrides to package.json if needed for @project-sunbird packages
    - Document any packages requiring --legacy-peer-deps
    - _Requirements: 3.2, 3.4, 10.3_

  - [ ] 2.5 Update build configurations
    - Review angular.json for any deprecated options
    - Update tsconfig.json target and lib settings
    - Verify useDefineForClassFields setting
    - _Requirements: 5.1, 5.2, 5.3_

  - [ ] 2.6 Test library build
    - Run `npm run build-lib`
    - Verify dist/collection-editor-library output
    - Check for compilation errors
    - _Requirements: 2.1, 6.1_

  - [ ] 2.7 Test web component build
    - Run `npm run build-web-component`
    - Verify build-wc.js completes successfully
    - Check web-component/ directory for output files
    - _Requirements: 2.2, 2.3, 8.1_

  - [ ]* 2.8 Run unit tests
    - Execute `npm test`
    - Fix any test failures
    - Document test results
    - _Requirements: 11.3_

  - [ ]* 2.9 Test web component in browser
    - Open web-component-demo/index.html
    - Verify lib-editor custom element loads
    - Test basic functionality
    - _Requirements: 7.3, 7.4_

- [ ] 3. Checkpoint - Angular 17 Verification
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 4. Upgrade to Angular 18
  - [ ] 4.1 Execute Angular 18 migration
    - Run `ng update @angular/core@18 @angular/cli@18`
    - Review and accept migration prompts
    - Document any warnings or errors
    - _Requirements: 1.1, 4.2_

  - [ ] 4.2 Update TypeScript to 5.4+
    - Update TypeScript to 5.4.x or higher
    - Update tsconfig.json if needed
    - _Requirements: 1.5, 5.1_

  - [ ] 4.3 Update third-party dependencies for Angular 18
    - Update ngx-bootstrap to Angular 18 compatible version
    - Update ngx-infinite-scroll to Angular 18 compatible version
    - Update @angular/cdk and @angular/material to 18.x
    - _Requirements: 1.2, 9.1, 9.3_

  - [ ] 4.4 Resolve peer dependency conflicts
    - Check for peer dependency warnings
    - Update npm overrides if needed
    - _Requirements: 3.2, 3.4_

  - [ ] 4.5 Test library build
    - Run `npm run build-lib`
    - Verify output structure unchanged
    - _Requirements: 2.1, 6.1_

  - [ ] 4.6 Test web component build
    - Run `npm run build-web-component`
    - Verify build-wc.js still works
    - _Requirements: 2.2, 2.3, 8.1_

  - [ ]* 4.7 Run unit tests
    - Execute `npm test`
    - Fix any test failures
    - _Requirements: 11.3_

  - [ ]* 4.8 Test web component in browser
    - Verify lib-editor custom element works
    - Test functionality
    - _Requirements: 7.3, 7.4_

- [ ] 5. Checkpoint - Angular 18 Verification
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 6. Upgrade to Angular 19
  - [ ] 6.1 Execute Angular 19 migration
    - Run `ng update @angular/core@19 @angular/cli@19`
    - Review and accept migration prompts
    - Pay attention to standalone component migration
    - Document any warnings or errors
    - _Requirements: 1.1, 4.3_

  - [ ] 6.2 Update TypeScript to 5.7
    - Update TypeScript to ~5.7.0
    - Update tsconfig.json if needed
    - _Requirements: 1.5, 5.1_

  - [ ] 6.3 Update zone.js to 0.15.x
    - Update zone.js to ~0.15.0
    - Verify polyfills.ts configuration
    - _Requirements: 6.2_

  - [ ] 6.4 Update ng-packagr for Angular 19
    - Update ng-packagr to ^19.0.0
    - If official version not available, consider @kv-systems/ng-packagr
    - Update ng-package.json if needed
    - _Requirements: 2.1, 6.1_

  - [ ] 6.5 Update third-party dependencies for Angular 19
    - Update ngx-bootstrap to ^12.0.0 or Angular 19 compatible version
    - Update ngx-infinite-scroll to ^19.0.0
    - Update @angular/cdk and @angular/material to ^19.0.0
    - Check ngx-chips compatibility or find alternative
    - _Requirements: 1.2, 9.1, 9.2, 9.3_

  - [ ] 6.6 Handle Sunbird package compatibility
    - Check each @project-sunbird package for Angular 19 compatibility
    - Add npm overrides for packages with incompatible peer dependencies
    - Document which packages need updates from Sunbird team
    - _Requirements: 3.1, 3.2, 3.4_

  - [ ] 6.7 Verify standalone component migration
    - Check that all NgModule-based components have `standalone: false`
    - Verify AppModule in collection-editor-library-wc still works
    - Ensure BrowserModule and CommonModule import order is correct
    - _Requirements: 4.3, 4.7_

  - [ ] 6.8 Update build configurations for Angular 19
    - Review angular.json for new Angular 19 options
    - Verify TypeScript target is ES2022
    - Check that outputHashing: none is still set for web component build
    - _Requirements: 5.1, 5.2, 2.5_

  - [ ] 6.9 Test library build with Angular 19
    - Run `npm run build-lib`
    - Verify FESM2022 bundles created
    - Check type definitions generated
    - _Requirements: 2.1, 6.1_

  - [ ] 6.10 Inspect web component build output
    - Run `ng build collection-editor-library-wc`
    - Inspect dist/collection-editor-library-wc/ directory
    - Document output file structure (runtime.js, polyfills.js, main.js, scripts.js)
    - Check if Angular 19 changed file names or structure
    - _Requirements: 2.3, 8.1_

  - [ ] 6.11 Update build-wc.js if needed
    - If output structure changed, update file paths in build-wc.js
    - Consider using glob patterns for resilience
    - Test concatenation produces valid JavaScript
    - _Requirements: 2.3, 8.1, 8.2_

  - [ ] 6.12 Test complete web component build
    - Run `npm run build-web-component`
    - Verify web-component/sunbird-collection-editor.js created
    - Verify web-component-demo/sunbird-collection-editor.js created
    - Check bundle size is reasonable
    - _Requirements: 2.4, 8.4_

  - [ ]* 6.13 Run unit tests with Angular 19
    - Execute `npm test`
    - Fix any test failures
    - Verify test coverage maintained
    - _Requirements: 11.3_

  - [ ]* 6.14 Test web component in multiple browsers
    - Test in Chrome (latest)
    - Test in Firefox (latest)
    - Test in Safari (latest)
    - Test in Edge (latest)
    - Verify custom element registration works
    - Verify styling applied correctly
    - _Requirements: 6.3, 7.1, 7.2, 7.3_

- [ ] 7. Checkpoint - Angular 19 Core Verification
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Update Library Package Configuration
  - [ ] 8.1 Update library package.json peer dependencies
    - Update @angular/common to ^19.0.0
    - Update @angular/core to ^19.0.0
    - Update @angular/cdk to ^19.0.0
    - Update all other Angular peer dependencies to ^19.0.0
    - _Requirements: 3.3, 12.1, 12.2_

  - [ ] 8.2 Increment library version
    - Update version in projects/collection-editor-library/package.json
    - Follow semantic versioning (major version bump for Angular 19)
    - _Requirements: 12.5_

  - [ ] 8.3 Test library package installation
    - Create test project with Angular 19
    - Install built library package
    - Verify no peer dependency conflicts
    - _Requirements: 12.3, 12.4_

- [ ] 9. Security and Dependency Audit
  - [ ] 9.1 Run npm audit
    - Execute `npm audit`
    - Document all vulnerabilities
    - _Requirements: 10.1_

  - [ ] 9.2 Fix security vulnerabilities
    - Run `npm audit fix` (without --force)
    - Manually update packages with vulnerabilities
    - Verify Angular version >= 19.2.16 (fixes XSRF vulnerability)
    - _Requirements: 10.2, 10.5_

  - [ ] 9.3 Verify no high/critical vulnerabilities
    - Run `npm audit` again
    - Ensure zero high or critical vulnerabilities
    - Document any remaining low/moderate vulnerabilities
    - _Requirements: 10.1, 10.3_

  - [ ] 9.4 Update package-lock.json
    - Regenerate package-lock.json with secure versions
    - Commit updated lock file
    - _Requirements: 10.4_

- [ ] 10. Testing and Validation
  - [ ]* 10.1 Run full test suite
    - Execute `npm test` for all projects
    - Execute `npm run test-coverage`
    - Verify coverage meets baseline
    - _Requirements: 11.3, 11.4_

  - [ ]* 10.2 Test development server
    - Run `ng serve`
    - Verify application loads without errors
    - Test hot module replacement
    - _Requirements: 13.1, 13.3_

  - [ ]* 10.3 Test production build
    - Run `npm run build` with production configuration
    - Verify optimization applied
    - Check bundle sizes against budgets
    - _Requirements: 14.1, 14.2, 14.3_

  - [ ]* 10.4 Property-based testing
    - Verify Property 1: Build output completeness
    - Verify Property 2: Web component registration
    - Verify Property 3: Library build success
    - Verify Property 4: Peer dependency compatibility
    - Verify Property 5: Test execution success
    - Verify Property 6: Development server functionality
    - Verify Property 7: Security vulnerability resolution
    - Verify Property 8: Build script compatibility
    - Verify Property 9: TypeScript compilation
    - Verify Property 10: Module import consistency
    - _Requirements: All requirements validated by properties_

  - [ ]* 10.5 Integration testing
    - Test web component in standalone HTML page
    - Test component inputs and outputs
    - Test event handling
    - Verify asset loading (images, fonts, styles)
    - _Requirements: 7.3, 7.4, 7.5_

  - [ ]* 10.6 Regression testing
    - Test key user workflows manually
    - Create new collection
    - Add content to collection
    - Edit metadata
    - Preview content
    - Publish collection
    - _Requirements: All functional requirements_

- [ ] 11. Documentation and Cleanup
  - [ ] 11.1 Document migration changes
    - Create MIGRATION.md with all changes made
    - Document package version updates
    - Document code modifications
    - Document configuration changes
    - _Requirements: 15.1, 15.2, 15.3_

  - [ ] 11.2 Document known issues and workarounds
    - Document any Sunbird package compatibility issues
    - Document npm override usage
    - Document any manual steps required
    - _Requirements: 15.4_

  - [ ] 11.3 Update README.md
    - Update Angular version requirements
    - Update Node.js version requirements
    - Update build instructions if changed
    - _Requirements: 15.5_

  - [ ] 11.4 Update CI/CD configuration
    - Update Node.js version in CI/CD
    - Update build commands if changed
    - Verify CI/CD pipeline works
    - _Requirements: 13.1_

  - [ ] 11.5 Clean up temporary files
    - Remove any backup files
    - Remove any temporary test files
    - Verify .gitignore is up to date
    - _Requirements: 15.5_

- [ ] 12. Final Checkpoint and Sign-off
  - Ensure all tests pass, ask the user if questions arise.
  - Verify all requirements met
  - Get stakeholder approval for deployment

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP, but are recommended for production readiness
- Each checkpoint ensures incremental validation before proceeding
- Property tests validate universal correctness properties
- Integration and regression tests validate end-to-end functionality
- The migration must be done incrementally: 16→17→18→19
- Do not skip versions or attempt to jump directly to Angular 19
- Test thoroughly after each version upgrade before proceeding
- Document all issues and resolutions for future reference
- Keep backup of working state before each major step
