import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppLoaderComponent } from './app-loader.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../services/config/config.service';



describe('AppLoaderComponent', () => {
  let component: AppLoaderComponent;
  let fixture: ComponentFixture<AppLoaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [ AppLoaderComponent ],
      providers: [ConfigService]
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
