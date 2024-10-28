import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-activity-details-popover',
  templateUrl: './activity-details-popover.component.html',
  styleUrls: ['./activity-details-popover.component.scss'],
})
export class ActivityDetailsPopoverComponent {
  @Input() activity: any;
}