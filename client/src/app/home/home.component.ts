import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

  
  registerMode = false;
  http = inject(HttpClient);
  users: any;
  subscription = new Subscription();


  ngOnInit(): void {
    this.getUsers();
  }

  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }


  getUsers() {
    const getUserSub = this.http.get('https://localhost:5001/api/users').subscribe({   // a http request always completes, as such, we don't necessarily need to unsubcribe.
      next: response => this.users = response,
      error: error => console.log(error),
      complete: () => console.log('Request has completed')
    });
    this.subscription.add(getUserSub);
  };

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
