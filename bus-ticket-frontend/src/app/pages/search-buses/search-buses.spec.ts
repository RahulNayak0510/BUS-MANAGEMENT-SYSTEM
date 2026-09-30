import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBuses } from './search-buses';

describe('SearchBuses', () => {
  let component: SearchBuses;
  let fixture: ComponentFixture<SearchBuses>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBuses],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBuses);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
