import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LibraryFilterComponent } from './library-filter.component';

describe('LibraryFilterComponent', () => {
  let component: LibraryFilterComponent;
  let fixture: ComponentFixture<LibraryFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
