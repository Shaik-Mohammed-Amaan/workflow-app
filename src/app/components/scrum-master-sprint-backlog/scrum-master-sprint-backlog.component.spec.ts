import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScrumMasterSprintBacklogComponent } from './scrum-master-sprint-backlog.component';

describe('ScrumMasterSprintBacklogComponent', () => {
  let component: ScrumMasterSprintBacklogComponent;
  let fixture: ComponentFixture<ScrumMasterSprintBacklogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScrumMasterSprintBacklogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScrumMasterSprintBacklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
