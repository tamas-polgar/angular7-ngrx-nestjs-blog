import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';
import { routerReducer, StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { environment } from '../environments/environment';
import { AppComponent } from './app.component';
import { AppErrorsHandeler } from './helpers/error.handeler';
import { AppHttpInterceptor } from './helpers/http.interceptor';
import { AuthorEffects } from './ngrx/effects/author.effects';
import { CategoryEffects } from './ngrx/effects/category.effects';
import { metaReducers, reducers } from './ngrx/reducers';
import { CustomRouteSerializer } from './ngrx/serializers/custom-oute-serializer';
import { AuthorService } from './providers/author.service';
import { CategoryService } from './providers/category.service';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: './modules/auth/auth.module#AuthModule',
  },
  {
    path: '',
    loadChildren: './modules/layout/layout.module#LayoutModule',
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules }),
    StoreModule.forRoot({ router: routerReducer, ...reducers }, { metaReducers }),
    EffectsModule.forRoot([CategoryEffects, AuthorEffects]),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router',
      serializer: CustomRouteSerializer,
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
  ],
  providers: [
    CategoryService,
    AuthorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AppHttpInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: AppErrorsHandeler,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
