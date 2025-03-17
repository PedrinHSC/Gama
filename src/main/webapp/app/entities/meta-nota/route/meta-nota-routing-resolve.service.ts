import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IMetaNota } from '../meta-nota.model';
import { MetaNotaService } from '../service/meta-nota.service';

const metaNotaResolve = (route: ActivatedRouteSnapshot): Observable<null | IMetaNota> => {
  const id = route.params.id;
  if (id) {
    return inject(MetaNotaService)
      .find(id)
      .pipe(
        mergeMap((metaNota: HttpResponse<IMetaNota>) => {
          if (metaNota.body) {
            return of(metaNota.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default metaNotaResolve;
