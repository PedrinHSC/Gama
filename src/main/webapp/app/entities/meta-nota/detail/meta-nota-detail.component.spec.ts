import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { of } from 'rxjs';

import { MetaNotaDetailComponent } from './meta-nota-detail.component';

describe('MetaNota Management Detail Component', () => {
  let comp: MetaNotaDetailComponent;
  let fixture: ComponentFixture<MetaNotaDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MetaNotaDetailComponent],
      providers: [
        provideRouter(
          [
            {
              path: '**',
              loadComponent: () => import('./meta-nota-detail.component').then(m => m.MetaNotaDetailComponent),
              resolve: { metaNota: () => of({ id: 20191 }) },
            },
          ],
          withComponentInputBinding(),
        ),
      ],
    })
      .overrideTemplate(MetaNotaDetailComponent, '')
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MetaNotaDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load metaNota on init', async () => {
      const harness = await RouterTestingHarness.create();
      const instance = await harness.navigateByUrl('/', MetaNotaDetailComponent);

      // THEN
      expect(instance.metaNota()).toEqual(expect.objectContaining({ id: 20191 }));
    });
  });

  describe('PreviousState', () => {
    it('Should navigate to previous state', () => {
      jest.spyOn(window.history, 'back');
      comp.previousState();
      expect(window.history.back).toHaveBeenCalled();
    });
  });
});
