import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrumMasterDashboardComponent } from './scrum-master-dashboard.component';

describe('ScrumMasterDashboardComponent', () => {
  let component: ScrumMasterDashboardComponent;
  let fixture: ComponentFixture<ScrumMasterDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScrumMasterDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrumMasterDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
