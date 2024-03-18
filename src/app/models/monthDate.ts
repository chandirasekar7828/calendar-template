export class monthDate {

    public date:Date;
    public isCurrentMonthDay:boolean;
    public isNextMonthDay:boolean;
    public isPastMonthDay:boolean;
    public hasEvent: boolean

    public constructor(date:Date, 
        isCurrentMonthDay:boolean, isNextMonthDay:boolean,
        isPastMonthDay:boolean,hasEvent: boolean) {
            this.date = date;
            this.isCurrentMonthDay = isCurrentMonthDay;
            this.isNextMonthDay = isNextMonthDay;
            this.isPastMonthDay = isPastMonthDay;
            this.hasEvent  = hasEvent;
    }

}