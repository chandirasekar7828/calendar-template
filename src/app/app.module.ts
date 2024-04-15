import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CalendarViewComponent } from './components/calendar-view/calendar-view.component';
import { HttpClientModule } from '@angular/common/http';
import { DayViewComponent } from './components/day-view/day-view.component';

@NgModule({
  declarations: [AppComponent, CalendarViewComponent, DayViewComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
