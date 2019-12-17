import { Router } from '@angular/router';
import { LocationService } from './../location.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-locationlist',
  templateUrl: './locationlist.component.html',
  styleUrls: ['./locationlist.component.css']
})
export class LocationlistComponent implements OnInit {
  locations = [];
  keyword: any;
  addLocationForm: FormGroup;
  modalRef: BsModalRef;
  selectedFile: any;
  isUpdate: any;
  selectedLocation: any;

  constructor(private modalService: BsModalService,
              private locationService: LocationService,
              private router: Router) { }

  ngOnInit() {
    this.addLocationForm = new FormGroup({
      name: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required)
    });

    this.getAllLocation();
  }

  openLocationForm(template, location) {
    this.selectedLocation = location;
    if (location) {
      this.isUpdate = true;
      this.addLocationForm.patchValue({
        name: location.name,
        address: location.address,
        description: location.description
      });

    } else {
      this.isUpdate = false;
      this.addLocationForm.reset();
    }

    this.modalRef = this.modalService.show(
      template,
      Object.assign({}, { class: 'gray modal-lg' })
    );
  }

  search() {
    this.locationService.search(this.keyword).subscribe((res) => {
      this.locations = res.response;
    });
  }

  getAllLocation() {
    this.locationService.getLocationsForUser(localStorage.email).subscribe((res) => {
      this.locations = res.response;
    });
  }

  fileUpload(event) {
     this.selectedFile = event.target.files[0];
  }

  addLocation(value) {
    const formData = new FormData();
    if (this.addLocationForm.valid && this.selectedFile) {
      formData.append('name', value.name);
      formData.append('description', value.description);
      formData.append('address', value.address);
      formData.append('image', this.selectedFile);
      formData.append('userId', localStorage.email);

      if (this.isUpdate) {
        formData.append('id', this.selectedLocation._id)
        this.locationService.updateLocation(formData).subscribe((res) => {
          console.log(res);
          if (res.status === 0) {
            this.modalRef.hide();
            this.getAllLocation();
            alert('Location updated successfully');
          }
        });
      } else {
        this.locationService.addLocation(formData).subscribe((res) => {
          console.log(res);
          if (res.status === 0) {
            this.modalRef.hide();
            this.getAllLocation();
            alert('Location added successfully');
          }
        });
      }
    } else {
      this.addLocationForm.markAsDirty();
    }
  }

  getLocationDetails(locationId) {
    this.router.navigate(['/details'], {queryParams: {id: locationId }});
  }
}
