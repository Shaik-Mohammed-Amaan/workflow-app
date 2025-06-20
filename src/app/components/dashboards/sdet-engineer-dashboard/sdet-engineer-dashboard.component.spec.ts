import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SdetEngineerDashboardComponent } from './sdet-engineer-dashboard.component';

describe('SdetEngineerDashboardComponent', () => {
  let component: SdetEngineerDashboardComponent;
  let fixture: ComponentFixture<SdetEngineerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SdetEngineerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SdetEngineerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
