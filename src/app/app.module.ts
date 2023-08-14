import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { CollectedComponent } from './modules/home/components/report/collected/collected.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthJwtInterceptor } from './modules/login/interceptor/auth-jwt.interceptor';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CollectedComponent
  ],
  imports: [
    BrowserModule,
	 HttpClientModule,
	 FormsModule 
  ],
  providers: [
	{
      provide: HTTP_INTERCEPTORS,
      useClass: AuthJwtInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
