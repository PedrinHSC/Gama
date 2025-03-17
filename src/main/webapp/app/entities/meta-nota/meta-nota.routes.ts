import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import MetaNotaResolve from './route/meta-nota-routing-resolve.service';

const metaNotaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/meta-nota.component').then(m => m.MetaNotaComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/meta-nota-detail.component').then(m => m.MetaNotaDetailComponent),
    resolve: {
      metaNota: MetaNotaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/meta-nota-update.component').then(m => m.MetaNotaUpdateComponent),
    resolve: {
      metaNota: MetaNotaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/meta-nota-update.component').then(m => m.MetaNotaUpdateComponent),
    resolve: {
      metaNota: MetaNotaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default metaNotaRoute;
