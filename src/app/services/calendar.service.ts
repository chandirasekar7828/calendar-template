import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { monthDate } from '../models/monthDate';
import { event } from '../models/event';

@Injectable({
  providedIn: 'root',
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
  days: string[] = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

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
    // console.log(this.monthDates);
    
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
  formatedEvents: any[] = []

  getEvents(): Observable<event[]> {
    return this.http.get<event[]>(`${this.API_URL}/batch`);
  }

  fetchEvents(): void {
    this.getEvents().subscribe((data: event[]) => {
      // this.events = this.eventSort([...data]);
      this.events = [...data];
      // return this.events = data
      console.log(this.events);
      this.breakEvents()
      this.filterEvents()
    });
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
    return new Array(this.monthDates.length / 7);
  }

  columnDivider() {
    return new Array(7);
  }

  breakEvents() {
    let updatedEvents = [];
    for (let event of this.events) {
      let start_date = new Date(event.start_date);
      let end_date = new Date(event.end_date);
      let current_date = new Date(start_date);

      while (current_date <= end_date) {
        if (current_date.getDay() === 6) { 
          let new_end_date = new Date(current_date);
          // new_end_date.setDate(current_date.getDate() - 1);

          updatedEvents.push({
            ...event,
            start_date: start_date,
            end_date: new_end_date,
            styles: this.stylesOfEvent(start_date.getDay(), start_date, end_date)
          });
          
          start_date = new Date(current_date);
          start_date.setDate(current_date.getDate() + 1);
        }
        current_date.setDate(current_date.getDate() + 1);
      }

      updatedEvents.push({
        ...event,
        start_date: start_date,
        end_date: end_date,
        styles: this.stylesOfEvent(start_date.getDay(), start_date, end_date)
      });
    }

    
    this.formatedEvents = updatedEvents
    
  }

  filterEvents() {
    this.formatedEvents = this.formatedEvents.filter(formatedEvent => {
      const startDate = new Date(formatedEvent.start_date);
      const endDate = new Date(formatedEvent.end_date);
      return endDate >= startDate;
    });
  }
  
  stylesOfEvent(startingDay: number, startDate:Date, endDate: Date) {
    let leftSpace = startingDay;
    let eventDateDifference = this.calculateDateDifference(startDate, endDate) + 1;

    let topSpace = 0
    return {
      top:  `${topSpace}em`,
      left: `${14.29 * leftSpace}%`,
      width: `${14.29 * eventDateDifference}%`,
    };
  }

  calculateDateDifference(startDateString: Date, endDateString: Date): number {
    const eventStartDate = new Date(startDateString);
    const eventEndDate = new Date(endDateString);
    const differenceMs = Math.abs(eventEndDate.getTime() - eventStartDate.getTime());
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    return differenceDays;
  }

  getEventsByDay(monthDate: monthDate): any[] {
    let day = new Date(monthDate.date);
    let formatedFilteredEvents: any[] = [];
    let hasEvents = false;
    console.log(this.formatedEvents);

    this.formatedEvents.forEach((formatedEvent) => {
      let formatedEventStartDate = new Date(formatedEvent.start_date);
      
      if (day.toDateString() === formatedEventStartDate.toDateString()) {
        formatedFilteredEvents.push(formatedEvent);
        hasEvents = true;
      }
    });

    monthDate.hasEvent = hasEvents;
    return formatedFilteredEvents;
  }

  // eventSort(events: event[]) {
  //   events.sort((a: any, b: any) => {
  //     const startDateA = new Date(a.start_date);
  //     const endDateA = new Date(a.end_date);
  //     const startDateB = new Date(b.start_date);
  //     const endDateB = new Date(b.end_date);

  //     const dateGapA = endDateA.getTime() - startDateA.getTime();
  //     const dateGapB = endDateB.getTime() - startDateB.getTime();

  //     return dateGapB - dateGapA;
  //   });
  //   return events;
  // }
 
}
