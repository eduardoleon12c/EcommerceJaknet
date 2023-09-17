import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CategoriesComponent } from './categories.component';
import { ListNewCategorieComponent } from './list-new-categorie/list-new-categorie.component';

const routes: Routes = [
  {
    path:'',
    component: CategoriesComponent,
    children:[
      {
        path:'list',
        component:ListNewCategorieComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CategoriesRoutingModule { }
