import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductOwnerDashboardComponent } from './product-owner-dashboard.component';

describe('ProductOwnerDashboardComponent', () => {
  let component: ProductOwnerDashboardComponent;
  let fixture: ComponentFixture<ProductOwnerDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductOwnerDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductOwnerDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
