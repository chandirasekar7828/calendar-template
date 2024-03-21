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
    // this.events = this._calendar.events;

    // this.calculateEventsByDay();
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
  eventsByDay: any[] = [];

  getEventsByDay(monthDate: monthDate){
    // console.log(this._calendar.getEventsByDay(monthDate));
    return this._calendar.getEventsByDay(monthDate); 
    // this.events = this._calendar.getEventsByDay(monthDate); 
  }

// utils funtions
  rowDivider() {
    return this._calendar.rowDivider()
  }
  
  columnDivider() {
    return this._calendar.columnDivider()
  }

  getMonthDate(rowIndex: number, colIndex: number): any {
    const index = rowIndex * this.columnDivider().length + colIndex;
    return this.monthDates[index];
  }

  getDateTime(monthDate: monthDate): number {
    return new Date(monthDate.date).getTime()
  }
}


// left: 14.29%; width: 14.29%; top: 0em; border-color: rgb(3, 155, 229);
