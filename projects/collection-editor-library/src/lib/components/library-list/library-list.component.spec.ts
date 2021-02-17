import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryListComponent } from './library-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TelemetryInteractDirective } from '../../directives/telemetry-interact/telemetry-interact.directive';
import { EditorTelemetryService } from '../../services/telemetry/telemetry.service';
import {mockData} from './library-list.component.spec.data'
describe('LibraryListComponent', () => {
  let component: LibraryListComponent;
  let fixture: ComponentFixture<LibraryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [EditorTelemetryService],
      imports: [HttpClientTestingModule],
      declarations: [ LibraryListComponent, TelemetryInteractDirective ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call addToLibrary to open the hierarchy popup', () => {
    spyOn(component.moveEvent, 'emit').and.returnValue(mockData.openPopUp);
    component.addToLibrary();
    expect(component.moveEvent.emit).toHaveBeenCalledWith(mockData.openPopUp); 
  });
  it('should call onShowAddedContentChange to show the added content', () => {
    component.showAddedContent = true;
    spyOn(component.moveEvent, 'emit').and.returnValue(mockData.showAddedContent);
    component.onShowAddedContentChange();
    expect(component.moveEvent.emit).toHaveBeenCalledWith(mockData.showAddedContent); 
  });
  it('should call onShowAddedContentChange to hide added content', () => {
    component.showAddedContent = false;
    spyOn(component.moveEvent, 'emit').and.returnValue(mockData.hideAddedContent);
    component.onShowAddedContentChange();
    expect(component.moveEvent.emit).toHaveBeenCalledWith(mockData.hideAddedContent); 
  });
  it('should call changeFilter', () => {
    spyOn(component.moveEvent, 'emit').and.returnValue(mockData.showFilter);
    component.changeFilter();
    expect(component.moveEvent.emit).toHaveBeenCalledWith(mockData.showFilter); 
  });
  it('should call onContentChange', () => {
    spyOn(component.contentChangeEvent, 'emit').and.returnValue(mockData.selectedContent);
    component.onContentChange(mockData.selectedContent.content);
    expect(component.contentChangeEvent.emit).toHaveBeenCalledWith(mockData.selectedContent); 
  });
});
