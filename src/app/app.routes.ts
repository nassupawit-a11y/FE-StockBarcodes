import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    redirectTo: 'barcodes',
    pathMatch: 'full'
  },
  {
    path: 'barcodes',
    loadComponent: () =>
      import('./components/barcodes/pages/barcode-list.component/barcode-list.component')
        .then(m => m.BarcodeListComponent),
  }
];
