import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'avaliacaoTesteApp.adminAuthority.home.title' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'aluno',
    data: { pageTitle: 'avaliacaoTesteApp.aluno.home.title' },
    loadChildren: () => import('./aluno/aluno.routes'),
  },
  {
    path: 'meta-nota',
    data: { pageTitle: 'avaliacaoTesteApp.metaNota.home.title' },
    loadChildren: () => import('./meta-nota/meta-nota.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
