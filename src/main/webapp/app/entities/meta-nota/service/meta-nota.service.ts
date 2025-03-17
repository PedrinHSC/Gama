import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IMetaNota, NewMetaNota } from '../meta-nota.model';

export type PartialUpdateMetaNota = Partial<IMetaNota> & Pick<IMetaNota, 'id'>;

export type EntityResponseType = HttpResponse<IMetaNota>;
export type EntityArrayResponseType = HttpResponse<IMetaNota[]>;

@Injectable({ providedIn: 'root' })
export class MetaNotaService {
  protected readonly http = inject(HttpClient);
  protected readonly applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/meta-notas');

  create(metaNota: NewMetaNota): Observable<EntityResponseType> {
    return this.http.post<IMetaNota>(this.resourceUrl, metaNota, { observe: 'response' });
  }

  update(metaNota: IMetaNota): Observable<EntityResponseType> {
    return this.http.put<IMetaNota>(`${this.resourceUrl}/${this.getMetaNotaIdentifier(metaNota)}`, metaNota, { observe: 'response' });
  }

  partialUpdate(metaNota: PartialUpdateMetaNota): Observable<EntityResponseType> {
    return this.http.patch<IMetaNota>(`${this.resourceUrl}/${this.getMetaNotaIdentifier(metaNota)}`, metaNota, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IMetaNota>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IMetaNota[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getMetaNotaIdentifier(metaNota: Pick<IMetaNota, 'id'>): number {
    return metaNota.id;
  }

  compareMetaNota(o1: Pick<IMetaNota, 'id'> | null, o2: Pick<IMetaNota, 'id'> | null): boolean {
    return o1 && o2 ? this.getMetaNotaIdentifier(o1) === this.getMetaNotaIdentifier(o2) : o1 === o2;
  }

  addMetaNotaToCollectionIfMissing<Type extends Pick<IMetaNota, 'id'>>(
    metaNotaCollection: Type[],
    ...metaNotasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const metaNotas: Type[] = metaNotasToCheck.filter(isPresent);
    if (metaNotas.length > 0) {
      const metaNotaCollectionIdentifiers = metaNotaCollection.map(metaNotaItem => this.getMetaNotaIdentifier(metaNotaItem));
      const metaNotasToAdd = metaNotas.filter(metaNotaItem => {
        const metaNotaIdentifier = this.getMetaNotaIdentifier(metaNotaItem);
        if (metaNotaCollectionIdentifiers.includes(metaNotaIdentifier)) {
          return false;
        }
        metaNotaCollectionIdentifiers.push(metaNotaIdentifier);
        return true;
      });
      return [...metaNotasToAdd, ...metaNotaCollection];
    }
    return metaNotaCollection;
  }
}
