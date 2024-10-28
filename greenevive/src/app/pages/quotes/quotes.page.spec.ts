import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuotesPage } from './quotes.page';

describe('QuotesPage', () => {
  let component: QuotesPage;
  let fixture: ComponentFixture<QuotesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(QuotesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
