import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorService } from '../../services/editor/editor.service';

import { AssignPageNumberComponent } from './assign-page-number.component';

describe('AssignPageNumberComponent', () => {
  let component: AssignPageNumberComponent;
  let fixture: ComponentFixture<AssignPageNumberComponent>;
  let editorService;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule],
      declarations: [ AssignPageNumberComponent ],
      providers:[EditorService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignPageNumberComponent);
    component = fixture.componentInstance;
    editorService = TestBed.inject(EditorService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('#ngOnint called',() => {
    spyOn(editorService,"getToolbarConfig").and.callThrough();
    component.toolbarConfig.title = 'Observation Title';
    component.ngOnInit();
  })

  it('#toolbarEventListener called on click back button',()=>{
    const event={
      button:'backContent'
    }
    spyOn(component,'toolbarEventListener').and.callThrough();
    component.toolbarEventListener(event);
    expect(component.toolbarEventListener).toHaveBeenCalledWith(event);
  })

});
