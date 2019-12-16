import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private router: Router, private userService: UserService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl(),
      password: new FormControl()
    });
  }

  login(value) {
    this.userService.login(value).subscribe((data) => {
      console.log(data);
      const user = JSON.stringify(data.responde);
      if (data.response.email) {
        localStorage.setItem('email', data.response.email);
        localStorage.setItem('name', data.response.name);
        localStorage.setItem('mobile', data.response.mobile);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user', user);
        this.router.navigate(['/list']);
      }
    });
  }
}
