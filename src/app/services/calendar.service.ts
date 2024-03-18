import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { monthDate } from '../models/monthDate';
import { event } from '../models/event';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {

  monthYearTitle: string = '';
  months: string[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  monthDates: monthDate[] = [];
  days: string[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  private monthDatesSource = new BehaviorSubject<monthDate[]>([]);
  monthDates$: Observable<monthDate[]> = this.monthDatesSource.asObservable();

  date: Date = new Date();
  currentDate = this.date.getDate();
  currentMonth = this.date.getMonth();
  currentYear = this.date.getFullYear();

  constructor(private http: HttpClient) {}

  // action btns
  changeCurrentMonth(): void {
    this.currentMonth = this.date.getMonth();
    this.currentYear = this.date.getFullYear();
    this.renderCalendar();
  }

  changePreviousMonth(): void {
    this.currentMonth--;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    }
    this.renderCalendar();
  }

  changeNextMonth(): void {
    this.currentMonth++;
    if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.renderCalendar();
  }

  // action support functions
  renderCalendar(): void {
    this.renderCalendarView();
    this.monthYearTitle = `${this.months[this.currentMonth]} ${
      this.currentYear
    }`;
    this.monthDatesSource.next(this.monthDates);
    console.log(this.monthDates);
  }

  renderCalendarView(): void {
    this.monthDates = [];
    const firstDay = new Date(this.currentYear, this.currentMonth, 1);
    const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
    const lastDayIndex = lastDay.getDay();
    const lastDayDate = lastDay.getDate();
    const prevLastDay = new Date(this.currentYear, this.currentMonth, 0);
    const prevLastDayDate = prevLastDay.getDate();
    const nextDays = 7 - lastDayIndex - 1;

    for (let x = firstDay.getDay(); x > 0; x--) {
      this.monthDates.push({
        date: this.createDateFromDMY(
          `${this.currentYear}-${this.currentMonth}-${prevLastDayDate - x + 1}`
        ),
        isPastMonthDay: true,
        isCurrentMonthDay: false,
        isNextMonthDay: false,
        hasEvent: false,
      });
    }

    for (let i = 1; i <= lastDayDate; i++) {
      if (
        i === new Date().getDate() &&
        this.currentMonth === new Date().getMonth() &&
        this.currentYear === new Date().getFullYear()
      ) {
        this.monthDates.push({
          date: this.createDateFromDMY(
            `${this.currentYear}-${this.currentMonth + 1}-${i}`
          ),
          isPastMonthDay: false,
          isCurrentMonthDay: true,
          isNextMonthDay: false,
          hasEvent: false,
        });
      } else {
        this.monthDates.push({
          date: this.createDateFromDMY(
            `${this.currentYear}-${this.currentMonth + 1}-${i}`
          ),
          isPastMonthDay: false,
          isCurrentMonthDay: true,
          isNextMonthDay: false,
          hasEvent: false,
        });
      }
    }

    for (let j = 1; j <= nextDays; j++) {
      this.monthDates.push({
        date: this.createDateFromDMY(
          `${this.currentYear}-${this.currentMonth + 2}-${j}`
        ),
        isPastMonthDay: false,
        isCurrentMonthDay: false,
        isNextMonthDay: true,
        hasEvent: false,
      });
    }
  }

  // events
  private API_URL = 'http://localhost:3000';
  events: event[] = [];

  getEvents(): Observable<event[]> {
    return this.http.get<event[]>(`${this.API_URL}/batch`);
  }
  
  fetchEvents(): void {
    this.getEvents().subscribe((data: event[]) => {
      this.events = this.eventSort([...data]);
      // return this.events = data
    });
  }

  // eventSort(events: any[]) {
  //    events.sort((a, b) => {
  //     const startDateA = new Date(a.start_date);
  //     const startDateB = new Date(b.start_date);

  //     if (startDateA.getTime() <= startDateB.getTime()) {
  //       return startDateA.getTime() - startDateB.getTime();
  //     } else {
  //       const endDateA = new Date(a.end_date);
  //       const endDateB = new Date(b.end_date);
  //       const durationA = endDateA.getTime() - startDateA.getTime();
  //       const durationB = endDateB.getTime() - startDateB.getTime();
  //       return durationB - durationA;
  //     }
  //   });
  //   return events
  // }

  eventSort(events: event[]) {
    events.sort((a: any, b: any) => {
      const startDateA = new Date(a.start_date);
      const endDateA = new Date(a.end_date);
      const startDateB = new Date(b.start_date);
      const endDateB = new Date(b.end_date);

      const dateGapA = endDateA.getTime() - startDateA.getTime();
      const dateGapB = endDateB.getTime() - startDateB.getTime();

      return dateGapB - dateGapA;
    });
    console.log(events);
    
    return events;
  }

  // utils functions
  createDateFromDMY(dateString: any): Date {
    let _parts = dateString.split('-');
    let _year = _parts[0];
    let _month = _parts[1];
    let _day = _parts[2];
    _day = _day.padStart(2, '0');
    _month = _month.padStart(2, '0');
    return new Date(_year, _month - 1, _day);
  }

  rowDivider() {
    return new Array(this.monthDates.length / 7)
  }

  columnDivider() {
    return new Array(7)
  }

}
