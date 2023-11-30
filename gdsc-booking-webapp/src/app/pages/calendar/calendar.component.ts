import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {
  DayPilot,
  DayPilotCalendarComponent,
  DayPilotModule,
  DayPilotNavigatorComponent
} from "@daypilot/daypilot-lite-angular";
import {DataService} from "../../services/data.service";

import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    DayPilotModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css'
})
export class CalendarComponent implements AfterViewInit {

  @ViewChild("navigator") navigator!: DayPilotNavigatorComponent;
  @ViewChild("calendar") calendar!: DayPilotCalendarComponent;

  get date(): DayPilot.Date {
    return this.config.startDate as DayPilot.Date;
  }

  set date(value: DayPilot.Date) {
    this.config.startDate = value;
  }

  navigatorConfig: DayPilot.NavigatorConfig = {
    showMonths: 3,
    skipMonths: 3,
    selectMode: "Week",
    cellWidth: 30,
    cellHeight: 30,
    dayHeaderHeight: 30,
    titleHeight: 30
  };

  events: DayPilot.EventData[] = [];

  config: DayPilot.CalendarConfig = {
    startDate: DayPilot.Date.today(),
    viewType: "Week",
    cellHeight: 30,
    headerHeight: 30,
    hourWidth: 60,
    eventDeleteHandling: "Update",
    onEventDelete: async (args) => {
      if (!confirm("Do you really want to delete this event?")) {
        args.preventDefault();
      }
    },
    onEventDeleted: async (args) => {
      console.log("event deleted");
      // http.delete
    },
    onTimeRangeSelected: async (args) => {
      const modal = await DayPilot.Modal.prompt("Book this time slot for:", "GDSC UPT");
      const dp = args.control;
      dp.clearSelection();
      if (!modal.result) { return; }
      dp.events.add({
        start: args.start,
        end: args.end,
        id: DayPilot.guid(),
        text: modal.result
      });
    }
  };

  constructor(private ds: DataService) {
  }

  ngAfterViewInit(): void {
  }

  viewChange(): void {
    var from = this.calendar.control.visibleStart();
    var to = this.calendar.control.visibleEnd();

    console.log("viewChange(): " + from + " " + to);

    this.ds.getEvents(from, to).subscribe(result => {
      this.events = result;
    });
  }

  navigatePrevious(event: MouseEvent): void {
    event.preventDefault();
    this.config.startDate = (this.config.startDate as DayPilot.Date).addDays(-7);
  }

  navigateNext(event: MouseEvent): void {
    event.preventDefault();
    this.config.startDate = (this.config.startDate as DayPilot.Date).addDays(7);
  }

  navigateToday(event: MouseEvent): void {
    event.preventDefault();
    this.config.startDate = DayPilot.Date.today();
  }

}
