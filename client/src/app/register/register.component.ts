import { Component, inject, input, OnDestroy, output} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy {

  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);

  subscription = new Subscription();

// @Input() usersFromHomeComponent => we go to home's template and we add [usersFrom...]="users" (users is any in home component) to app-register || Parent to child

// @output() cancelRegister = new EventEmitter(); => we go to home's template and we add (cacelRegister)="cancelRegisterMode($event)" to <app-register></app-register>
// then in home.component.ts we add the method
// cancelRegisterMode(event: boolean) {
//    this.registerMode = event;                Child to parrent
// }

// usersFromHomeComponent = input.required<any>() // new way of having data go from the parent to child using signals
cancelRegister = output<boolean>();            // new way of having data go from the child to parent

  model: any = {}

  register() {
    const registerSubscription = this.accountService.register(this.model).subscribe({
      next: response => {
        console.log(response);
        this.cancel()
      },
      error: error => this.toastr.error(error.error),
    })
    this.subscription.add(registerSubscription);
  };

  cancel() {
    this.cancelRegister.emit(false);   // this is used in both ways old and new
  };


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
