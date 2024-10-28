
import { Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown'
import { Subscription } from 'rxjs';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule, BsDropdownModule, RouterLink, RouterLinkActive, TitleCasePipe],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent implements OnDestroy {

  accountService = inject(AccountService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  private subscription = new Subscription();

  model: any = {};
  login() {
    const loginSub = this.accountService.login(this.model).subscribe({
      next: () => {
        void this.router.navigateByUrl('/members');
      },
      error: error => this.toastr.error(error.error),
    });

    this.subscription.add(loginSub); // add the subscription to the parent subscription
  };

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }



  ngOnDestroy(): void {
    this.subscription.unsubscribe();  // we unsubscribe from all subscriptions here at once.
  }

}
