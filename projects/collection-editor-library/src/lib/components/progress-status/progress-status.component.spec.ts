import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressStatusComponent } from './progress-status.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('ProgressStatusComponent', () => {
  let component: ProgressStatusComponent;
  let fixture: ComponentFixture<ProgressStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    declarations: [ProgressStatusComponent],
    imports: [],
    providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
