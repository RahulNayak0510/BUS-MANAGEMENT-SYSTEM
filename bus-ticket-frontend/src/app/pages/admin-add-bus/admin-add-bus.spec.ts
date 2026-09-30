import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminAddBus } from './admin-add-bus';

describe('AdminAddBus', () => {
  let component: AdminAddBus;
  let fixture: ComponentFixture<AdminAddBus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminAddBus],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminAddBus);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
