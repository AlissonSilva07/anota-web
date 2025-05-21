import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomImgPickerComponent } from './custom-img-picker.component';

describe('CustomImgPickerComponent', () => {
  let component: CustomImgPickerComponent;
  let fixture: ComponentFixture<CustomImgPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomImgPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomImgPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
