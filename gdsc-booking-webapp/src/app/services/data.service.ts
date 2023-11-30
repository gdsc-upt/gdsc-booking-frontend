import { Injectable } from '@angular/core';
import {DayPilot} from "@daypilot/daypilot-lite-angular";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataService {

  events: DayPilot.EventData[] = [
    {
      id: "1",
      start: DayPilot.Date.today().addHours(10),
      end: DayPilot.Date.today().addHours(12),
      text: "GDSC UPT"
    },
    {
      id: "2",
      start: DayPilot.Date.today().addHours(24),
      end: DayPilot.Date.today().addHours(25),
      text: "LIGA AC"
    }
  ];

  constructor(){
  }

  getEvents(from: DayPilot.Date, to: DayPilot.Date): Observable<any[]> {

    // simulating an HTTP request
    return new Observable(observer => {
      setTimeout(() => {
        observer.next(this.events);
        observer.complete();
      }, 200);
    });

    // return this.http.get("/api/events?from=" + from.toString() + "&to=" + to.toString());
  }

}

