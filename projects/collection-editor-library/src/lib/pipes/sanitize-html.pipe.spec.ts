import {SanitizeHtmlPipe} from './sanitize-html.pipe';
import {BrowserModule, DomSanitizer} from '@angular/platform-browser';
import {TestBed} from '@angular/core/testing';

describe('TitleCasePipe', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BrowserModule],
    });
  });

  it('should create an instance', () => {
    const domSanitizer = TestBed.get(DomSanitizer);
    const pipe = new SanitizeHtmlPipe(domSanitizer);
    expect(pipe).toBeTruthy();
  });
});
