import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { monthDate } from '../../models/monthDate';
import { event } from '../../models/event';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.css'
})
export class CalendarViewComponent {
  monthYearTitle: string = '';
  days: string[] = [];
  monthDates: monthDate[] = [];
  events: event[] = []

  constructor(private _calendar: CalendarService) {}

  ngOnInit(): void {
    // month title calling
    this._calendar.changeCurrentMonth();
    this.monthYearTitle = this._calendar.monthYearTitle;

    // month days calling
    this.days = this._calendar.days;
    this._calendar.monthDates$.subscribe((monthDate) => {
      this.monthDates = monthDate;
    });

    // event calling
    this._calendar.fetchEvents();
    this.events = this._calendar.events;
  }

  // action btns
  currentMonthBtn(): void {
    this._calendar.changeCurrentMonth();
    this.monthYearTitle = this._calendar.monthYearTitle;
  }

  previousMonthBtn(): void {
    this._calendar.changePreviousMonth();
    this.monthYearTitle = this._calendar.monthYearTitle;
  }

  nextMonthBtn(): void {
    this._calendar.changeNextMonth();
    this.monthYearTitle = this._calendar.monthYearTitle;
  }

  // events

  getEventsByDay(monthDate: monthDate){
    let day = monthDate.date;
    let filteredEvents: event[] = [];
    let hasEvents = false;

    this.events.forEach((event) => {
      let eventStartDate = new Date(event.start_date);
      let eventEndDate = new Date(event.end_date);

      if (day >= eventStartDate && day <= eventEndDate) {
        filteredEvents.push(event);
        hasEvents = true;
      }
      
    });

    monthDate.hasEvent = hasEvents;
    return filteredEvents;
  }

  // utils funtions
  rowDivider() {
    return this._calendar.rowDivider()
  }
  
  columnDivider() {
    return this._calendar.columnDivider()
  }

}
