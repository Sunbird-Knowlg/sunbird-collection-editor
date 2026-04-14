import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AppLoaderComponent } from './app-loader.component';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ConfigService } from '../../services/config/config.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';



describe('AppLoaderComponent', () => {
  let component: AppLoaderComponent;
  let fixture: ComponentFixture<AppLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
    declarations: [AppLoaderComponent],
    imports: [],
    providers: [ConfigService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
})
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
