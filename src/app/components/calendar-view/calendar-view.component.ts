import { Component, OnInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';
import { monthDate } from '../../models/monthDate';
import { event } from '../../models/event';

@Component({
  selector: 'app-calendar-view',
  templateUrl: './calendar-view.component.html',
  styleUrl: './calendar-view.component.css'
})
export class CalendarViewComponent implements OnInit{
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

  displayFormatedEvents(monthDate: monthDate){
    return this._calendar.displayFormatedEvents(monthDate); 
  }

// utils funtions
  rowDivider() {
    return this._calendar.rowDivider()
  }
  
  columnDivider() {
    return this._calendar.columnDivider()
  }

  getMonthDate(rowIndex: number, colIndex: number): any {
    return this._calendar.getMonthDate(rowIndex, colIndex)
  }

  getDateTime(monthDate: monthDate): number {
    return this._calendar.getDateTime(monthDate)
  }

  getWeekStartEndDates(monthDate: Date) {
    return this._calendar.getWeekStartEndDates(monthDate)
  }

  getEventsByDate(monthDate: monthDate) {
    return this._calendar.getEventsByDate(monthDate);
  }

}
