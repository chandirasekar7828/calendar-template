import { Component, Input, OnInit } from '@angular/core';
import { CalendarService } from '../../services/calendar.service';

@Component({
  selector: 'app-day-view',
  templateUrl: './day-view.component.html',
  styleUrl: './day-view.component.css',
})
export class DayViewComponent implements OnInit {
  @Input() day: string = '';
  @Input() eventValue: any = '';

  ngOnInit(): void {}

  constructor(private _dailyview: CalendarService) {}

  currentDateBtn(): void {
    this._dailyview.currentDateBtn();
  }

  previousDateBtn(): void {}

  nextDateBtn(): void {}

  time: any[] = [
    'GMT+00',
    '1AM',
    '2AM',
    '3AM',
    '4AM',
    '5AM',
    '6AM',
    '7AM',
    '8AM',
    '9AM',
    '10AM',
    '11AM',
    '12PM',
    '1PM',
    '2PM',
    '3PM',
    '4PM',
    '5PM',
    '6PM',
    '7PM',
    '8PM',
    '9PM',
    '10PM',
    '11PM',
  ];

  range(start: number, end: number): number[] {
    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }
}
