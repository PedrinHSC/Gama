import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IMetaNota, NewMetaNota } from '../meta-nota.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IMetaNota for edit and NewMetaNotaFormGroupInput for create.
 */
type MetaNotaFormGroupInput = IMetaNota | PartialWithRequiredKeyOf<NewMetaNota>;

type MetaNotaFormDefaults = Pick<NewMetaNota, 'id'>;

type MetaNotaFormGroupContent = {
  id: FormControl<IMetaNota['id'] | NewMetaNota['id']>;
  area: FormControl<IMetaNota['area']>;
  meta: FormControl<IMetaNota['meta']>;
  aluno: FormControl<IMetaNota['aluno']>;
};

export type MetaNotaFormGroup = FormGroup<MetaNotaFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class MetaNotaFormService {
  createMetaNotaFormGroup(metaNota: MetaNotaFormGroupInput = { id: null }): MetaNotaFormGroup {
    const metaNotaRawValue = {
      ...this.getFormDefaults(),
      ...metaNota,
    };
    return new FormGroup<MetaNotaFormGroupContent>({
      id: new FormControl(
        { value: metaNotaRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      area: new FormControl(metaNotaRawValue.area, {
        validators: [Validators.required],
      }),
      meta: new FormControl(metaNotaRawValue.meta, {
        validators: [Validators.required, Validators.min(0), Validators.max(1000)],
      }),
      aluno: new FormControl(metaNotaRawValue.aluno),
    });
  }

  getMetaNota(form: MetaNotaFormGroup): IMetaNota | NewMetaNota {
    return form.getRawValue() as IMetaNota | NewMetaNota;
  }

  resetForm(form: MetaNotaFormGroup, metaNota: MetaNotaFormGroupInput): void {
    const metaNotaRawValue = { ...this.getFormDefaults(), ...metaNota };
    form.reset(
      {
        ...metaNotaRawValue,
        id: { value: metaNotaRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): MetaNotaFormDefaults {
    return {
      id: null,
    };
  }
}
