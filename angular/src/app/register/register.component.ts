import { UserService } from './../user.service';
import { Router } from '@angular/router';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.registerForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required]),
      mobile: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required])
    });
  }

  register(value) {
    if (this.registerForm.valid) {
      this.userService.register(value).subscribe((data) => {
        if (data.status === 0) {
          this.router.navigate(['/login']);
          alert('User registered successfully');
        }
      });
    }
  }

}
