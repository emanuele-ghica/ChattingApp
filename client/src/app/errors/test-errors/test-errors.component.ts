import { HttpClient } from '@angular/common/http';
import { Component, inject, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-test-errors',
  standalone: true,
  imports: [],
  templateUrl: './test-errors.component.html',
  styleUrl: './test-errors.component.css'
})
export class TestErrorsComponent implements OnDestroy{
 
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private subcription = new Subscription();
  validationErrors: string[] = [];

  get400Error() {
   const error400Subscription = this.http.get(this.baseUrl + 'buggy/bad-request').subscribe({
    next: response => console.log(response),
    error: error => console.log(error), 
   });
   this.subcription.add(error400Subscription);
  };

  get401Error() {
    const error401Subscription = this.http.get(this.baseUrl + 'buggy/auth').subscribe({
     next: response => console.log(response),
     error: error => console.log(error), 
    });
    this.subcription.add(error401Subscription);
   };

   get404Error() {
    const error404Subscription = this.http.get(this.baseUrl + 'buggy/not-found').subscribe({
     next: response => console.log(response),
     error: error => console.log(error), 
    });
    this.subcription.add(error404Subscription);
   };

   get500Error() {
    const error500Subscription = this.http.get(this.baseUrl + 'buggy/server-error').subscribe({
     next: response => console.log(response),
     error: error => console.log(error), 
    });
    this.subcription.add(error500Subscription);
   };

   get400ValidationError() {
    const error400ValidationSubscription = this.http.post(this.baseUrl + 'account/register', {}).subscribe({
     next: response => console.log(response),
     error: error => {
      console.log(error);
      this.validationErrors = error;
    }, 
    });
    this.subcription.add(error400ValidationSubscription);
   };

  ngOnDestroy(): void {
   this.subcription.unsubscribe();
  };
}
