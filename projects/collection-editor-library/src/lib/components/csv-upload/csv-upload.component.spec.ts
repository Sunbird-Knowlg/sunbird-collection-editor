import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CsvUploadComponent } from './csv-upload.component';

xdescribe('CsvUploadComponent', () => {
  let component: CsvUploadComponent;
  let fixture: ComponentFixture<CsvUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CsvUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CsvUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  // it('#createHierarchyCsv() should call createHierarchyCsv and open pop up', () => {
  //   spyOn(component, 'createHierarchyCsv').and.callThrough();
  //   component.createHierarchyCsv();
  //   expect(component.showCreateCSV).toBeTruthy();
  //   expect(component.uploadCSVFile).toBeTruthy();
  // });
  // it('#onClickReupload() should call onClickReupload and reset conditionns', () => {
  //   spyOn(component, 'onClickReupload').and.callThrough();
  //   spyOn(component, 'resetConditionns').and.callThrough();
  //   component.showCreateCSV = true;
  //   component.onClickReupload();
  //   expect(component.uploadCSVFile).toBeTruthy();
  //   expect(component.resetConditionns).toHaveBeenCalled();
  // });
  // it('#onClickReupload() should call onClickReupload and reset conditionns', () => {
  //   spyOn(component, 'onClickReupload').and.callThrough();
  //   spyOn(component, 'resetConditionns').and.callThrough();
  //   component.showCreateCSV = false;
  //   component.onClickReupload();
  //   expect(component.updateCSVFile).toBeTruthy();
  //   expect(component.resetConditionns).toHaveBeenCalled();
  // });
  // it('#resetConditionns() should call resetConditionns and reset conditionns', () => {
  //   spyOn(component, 'closeHierarchyModal').and.callThrough();
  //   component.closeHierarchyModal();
  //   expect(component.errorCSV.status).toBeFalsy();
  //   expect(component.errorCSV.message).toBe('');
  //   expect(component.isUploadCSV).toBeFalsy();
  //   expect(component.formData).toBe(null);
  // });
  // it('#closeHierarchyModal() should call closeHierarchyModal and reset conditionns', () => {
  //   spyOn(component, 'closeHierarchyModal').and.callThrough();
  //   spyOn(component, 'resetConditionns').and.callThrough();
  //   component.closeHierarchyModal();
  //   expect(component.uploadCSVFile).toBeFalsy();
  //   expect(component.showCreateCSV).toBeFalsy();
  //   expect(component.showUpdateCSV).toBeFalsy();
  //   expect(component.updateCSVFile).toBeFalsy();
  //   expect(component.openCSVPopUp).toBeFalsy();
  //   expect(component.resetConditionns).toHaveBeenCalled();
  // });
  // it('#validateCSVFile() should call validateCSVFile and check csv file for error case', () => {
  //   spyOn(component['editorService'], 'validateCSVFile').and.returnValue(throwError(csvImport.importError));
  //   spyOn(component, 'mergeCollectionExternalProperties');
  //   component.validateCSV = true;
  //   component.uploadCSVFile = false;
  //   component.isUploadCSV = true;
  //   component.isClosable = false;
  //   component.validateCSVFile();
  //   component['editorService'].validateCSVFile(null, 'do_113312173590659072160').subscribe(data => {
  //   },
  //     error => {
  //       expect(error.responseCode).toBe('CLIENT_ERROR');
  //       expect(component.validateCSV).toBeFalsy();
  //       expect(component.errorCSV.status).toBeTruthy();
  //       expect(component.isClosable).toBeTruthy();
  //     });
  // });
  // it('#uploadCSV() should upload file', () => {
  //   const file = new File([''], 'filename', { type: 'csv/text' });
  //   const event = {
  //     target: {
  //       files: [
  //         file
  //       ]
  //     }
  //   };
  //   component.uploadCSV(event);
  //   expect(component.isUploadCSV).toBeTruthy();
  // });
  // it('#updateHierarchyCSVFile() should call updateHierarchyCSVFile', () => {
  //   spyOn(component, 'updateHierarchyCSVFile').and.callThrough();
  //   component.updateHierarchyCSVFile();
  //   expect(component.openCSVPopUp).toBeTruthy();
  //   expect(component.showUpdateCSV).toBeTruthy();
  //   expect(component.updateCSVFile).toBeTruthy();
  //   expect(component.errorCSV.status).toBeFalsy();
  //   expect(component.errorCSV.message).toBe('');
  // });
});
