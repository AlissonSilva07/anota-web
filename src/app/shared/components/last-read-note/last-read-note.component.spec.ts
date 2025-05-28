import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastReadNoteComponent } from './last-read-note.component';

describe('LastReadNoteComponent', () => {
  let component: LastReadNoteComponent;
  let fixture: ComponentFixture<LastReadNoteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LastReadNoteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LastReadNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
