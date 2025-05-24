import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageSpacesComponent } from './manage-spaces.component';

describe('ManageSpacesComponent', () => {
  let component: ManageSpacesComponent;
  let fixture: ComponentFixture<ManageSpacesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageSpacesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageSpacesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
