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

  public monthDatesSource = new BehaviorSubject<monthDate[]>([]);
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

  currentDateBtn(): void {
    this.currentDate = this.currentDate;
  }

  previousDateBtn(): void {}

  nextDateBtn(): void {}

  // action support functions
  renderCalendar(): void {
    this.renderCalendarView();
    this.monthYearTitle = `${this.months[this.currentMonth]} ${
      this.currentYear
    }`;
    this.monthDatesSource.next(this.monthDates);
    this.monthDates$.subscribe((monthDates) => {
      // this.monthDates = monthDates;
      monthDates.forEach((monthDate) => {
        this.getWeekStartEndDates(monthDate.date);
      });
    });

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
  eventsForNMoreBlock: event[] = [];
  formatedEvents: any[] = [];

  getEvents(): Observable<event[]> {
    return this.http.get<event[]>(`${this.API_URL}/batch`);
  }

  fetchEvents(): void {
    this.getEvents().subscribe((data: event[]) => {
      this.events = [...data];
      this.eventsForNMoreBlock = [...data];
      this.breakEvents();
      this.enhancedBreakEvents();
      this.monthDates.forEach((monthDate) =>
        this.getWeekStartEndDates(monthDate.date)
      );
    });
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

          updatedEvents.push({
            ...event,
            start_date: start_date,
            end_date: new_end_date,
            styles: this.getStylesOfEvent(
              start_date.getDay(),
              start_date,
              end_date
            ),
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
        styles: this.getStylesOfEvent(
          start_date.getDay(),
          start_date,
          end_date
        ),
      });
    }
    this.formatedEvents = updatedEvents;
  }

  getStylesOfEvent(startingDay: number, startDate: Date, endDate: Date) {
    let leftSpace = startingDay;
    let eventDateDifference =
      this.getEventDateDifference(startDate, endDate) + 1;

    let topSpace = 0;
    return {
      top: `${topSpace}em`,
      left: `${14.29 * leftSpace}%`,
      width: `${14.29 * eventDateDifference}%`,
    };
  }

  getEventDateDifference(startDateString: Date, endDateString: Date): number {
    const eventStartDate = new Date(startDateString);
    const eventEndDate = new Date(endDateString);
    const differenceMs = Math.abs(
      eventEndDate.getTime() - eventStartDate.getTime()
    );
    const differenceDays = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

    return differenceDays;
  }

  enhancedBreakEvents() {
    this.formatedEvents = this.formatedEvents.filter((formatedEvent) => {
      const startDate = new Date(formatedEvent.start_date);
      const endDate = new Date(formatedEvent.end_date);
      return endDate >= startDate;
    });
  }

  displayFormatedEvents(monthDate: monthDate): any[] {
    let day = new Date(monthDate.date);
    let displayFormatedEvents: any[] = [];
    let hasEvents = false;

    this.formatedEvents.forEach((formatedEvent) => {
      let formatedEventStartDate = new Date(formatedEvent.start_date);

      if (day.toDateString() === formatedEventStartDate.toDateString()) {
        displayFormatedEvents.push(formatedEvent);
        hasEvents = true;
      }
    });

    monthDate.hasEvent = hasEvents;
    return displayFormatedEvents;
  }

  getWeekStartEndDates(date: Date) {
    const currentDate = new Date(date);

    const currentDayOfWeek = currentDate.getDay();

    const differenceToSunday = currentDayOfWeek === 0 ? 0 : currentDayOfWeek;
    const differenceToSaturday =
      currentDayOfWeek === 0 ? 6 : 6 - currentDayOfWeek;

    const weekStart = new Date(currentDate);
    weekStart.setDate(currentDate.getDate() - differenceToSunday);

    const weekEnd = new Date(currentDate);
    weekEnd.setDate(currentDate.getDate() + differenceToSaturday);

    this.getEventsFromWeek(weekStart, weekEnd);
  }

  getEventsFromWeek(weekStartDate: any, weekEndDate: any) {
    let temp = 0;
    const eventsFromWeek = this.formatedEvents.filter((formatedEvent) => {
      const eventStartDate = new Date(formatedEvent.start_date);
      const eventEndDate = new Date(formatedEvent.end_date);
      return eventStartDate >= weekStartDate && eventEndDate <= weekEndDate;
    });

    this.eventSort(eventsFromWeek);

    eventsFromWeek.forEach((eventFromWeek, index) => {
      if (
        index === 0 ||
        new Date(eventFromWeek.start_date) >
          new Date(eventsFromWeek[index - 1].end_date)
      ) {
        temp = 0;
      } else {
        let hasIntersect = false;
        for (let i = 0; i < index; i++) {
          const prevEvent = eventsFromWeek[i];
          const eventStartDate = new Date(eventFromWeek.start_date);
          const eventEndDate = new Date(eventFromWeek.end_date);
          const prevEventStartDate = new Date(prevEvent.start_date);
          const prevEventEndDate = new Date(prevEvent.end_date);

          if (
            eventStartDate <= prevEventEndDate &&
            eventEndDate >= prevEventStartDate
          ) {
            hasIntersect = true;
            break;
          }
        }
        if (!hasIntersect) {
          temp = 0;
        } else {
          temp++;
        }
      }

      eventFromWeek.styles.top = `${temp}em`;
    });
  }

  eventSort(events: any[]) {
    events.sort((a: any, b: any) => {
      const startDateA = new Date(a.start_date);
      const endDateA = new Date(a.end_date);
      const startDateB = new Date(b.start_date);
      const endDateB = new Date(b.end_date);

      const dateGapA = endDateA.getTime() - startDateA.getTime();
      const dateGapB = endDateB.getTime() - startDateB.getTime();

      return dateGapA - dateGapB;
    });
    return events;
  }

  getEventsByDate(monthDate: monthDate) {
    let day = monthDate.date;
    let filteredEventsByDate: event[] = [];
    // let hasEvents = false;

    this.eventsForNMoreBlock.forEach((event) => {
      let eventStartDate = new Date(event.start_date);
      let eventEndDate = new Date(event.end_date);

      if (day >= eventStartDate && day <= eventEndDate) {
        filteredEventsByDate.push(event);
        // hasEvents = true;
      }
    });

    // monthDate.hasEvent = hasEvents;
    console.log('Date - ' + monthDate.date.getDate() + ' - ');

    console.log(filteredEventsByDate);

    return filteredEventsByDate;
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

  getMonthDate(rowIndex: number, colIndex: number): any {
    const index = rowIndex * this.columnDivider().length + colIndex;
    console.log(this.monthDates[index]);
    return this.monthDates[index];
  }

  getDateTime(monthDate: monthDate): number {
    return new Date(monthDate.date).getTime();
  }
}
