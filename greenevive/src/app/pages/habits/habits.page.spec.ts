import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { HabitsPage } from './habits.page';

describe('HabitsPage', () => {
  let component: HabitsPage;
  let fixture: ComponentFixture<HabitsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(HabitsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
