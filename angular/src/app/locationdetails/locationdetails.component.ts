import { LocationService } from './../location.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-locationdetails',
  templateUrl: './locationdetails.component.html',
  styleUrls: ['./locationdetails.component.css']
})
export class LocationdetailsComponent implements OnInit {

  id: any;
  location: any;
  constructor(private locationService: LocationService, private route: ActivatedRoute, private router: Router) { }
  ngOnInit() {
    this.id = this.route.snapshot.queryParamMap.get('id');
    this.getLocationDetails();
  }

  getLocationDetails() {
    this.locationService.getLocationDetails(this.id).subscribe((res) => {
      this.location = res.response;
    });
  }

  deleteLocation() {
    this.locationService.deleteLocation(this.id).subscribe((res) => {
      if (res.status.code === 0) {
        this.router.navigate(['/list']);
        alert('Location deleted successfully');
      }
    });
  }

}
