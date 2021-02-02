import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LibraryPlayerComponent } from './library-player.component';

describe('LibraryPlayerComponent', () => {
  let component: LibraryPlayerComponent;
  let fixture: ComponentFixture<LibraryPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LibraryPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LibraryPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
