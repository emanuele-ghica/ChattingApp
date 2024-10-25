
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnDestroy {

  accountService = inject(AccountService);
  private subscription = new Subscription();

  model: any = {};
  login() {
    const loginSub = this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
      },
      error: error => console.log(error),
    });

    this.subscription.add(loginSub); // add the subscription to the parent subscription
  };

  logout() {
    this.accountService.logout();
  }



  ngOnDestroy(): void {
    this.subscription.unsubscribe();  // we unsubscribe from all subscriptions here at once.
  }

}
