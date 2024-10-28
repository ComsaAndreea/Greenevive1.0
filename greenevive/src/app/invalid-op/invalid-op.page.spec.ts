import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InvalidOpPage } from './invalid-op.page';

describe('InvalidOpPage', () => {
  let component: InvalidOpPage;
  let fixture: ComponentFixture<InvalidOpPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(InvalidOpPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
