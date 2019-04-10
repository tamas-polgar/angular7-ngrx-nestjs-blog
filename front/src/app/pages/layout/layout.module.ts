import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SharedModule } from '../../shared/shared.module';
import { LayoutComponent } from './layout.component';


const routes: Routes = [{
  path: '',
  component: LayoutComponent,
  children: [{
    path: '',
    redirectTo: 'articles'
  }, {
    path: 'articles',
    loadChildren: '../articles/articles.module#ArticlesModule'
  }, {
    path: 'articles/article',
    loadChildren: '../article/article.module#ArticleModule'
  }]
}];


@NgModule({
  declarations: [
    LayoutComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class LayoutModule { }
