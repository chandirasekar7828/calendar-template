export class event {
    public id: number;
    public batch_code: string;
    public start_date: Date;
    public end_date: Date;
    public description: string;
    public background_color: string;
    public location: string;
  
    public constructor(
      id: number,
      batch_code: string,
      start_date: Date,
      end_date: Date,
      description: string,
      background_color: string,
      location: string
    ) {
      this.id = id;
      this.batch_code = batch_code;
      this.start_date = start_date;
      this.end_date = end_date;
      this.description = description;
      this.background_color = background_color;
      this.location = location
    }
  }
  