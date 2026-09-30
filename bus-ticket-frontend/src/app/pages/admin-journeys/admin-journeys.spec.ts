import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdminJourneys } from './admin-journeys';

describe('AdminJourneys', () => {
  let component: AdminJourneys;
  let fixture: ComponentFixture<AdminJourneys>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminJourneys],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminJourneys);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
