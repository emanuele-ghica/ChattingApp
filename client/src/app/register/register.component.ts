import { Component, inject, OnDestroy, OnInit, output} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { Subscription } from 'rxjs';
import { TextInputComponent } from "../_forms/text-input/text-input.component";
import { DatePickerComponent } from '../_forms/date-picker/date-picker.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, TextInputComponent, DatePickerComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
 
  private accountService = inject(AccountService);
  private fb = inject(FormBuilder);
  private router = inject(Router)
  cancelRegister = output<boolean>();            // new way of having data go from the child to parent
  registerForm: FormGroup = new FormGroup({});
  subscription = new Subscription();
  maxDate = new Date();
  validationErrors:  string[] | undefined;


// @Input() usersFromHomeComponent => we go to home's template and we add [usersFrom...]="users" (users is any in home component) to app-register || Parent to child

// @output() cancelRegister = new EventEmitter(); => we go to home's template and we add (cacelRegister)="cancelRegisterMode($event)" to <app-register></app-register>
// then in home.component.ts we add the method
// cancelRegisterMode(event: boolean) {
//    this.registerMode = event;                Child to parrent
// }

// usersFromHomeComponent = input.required<any>() // new way of having data go from the parent to child using signals

  ngOnInit(): void {
    this.initializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  initializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]],
      confirmPassword: ['', [Validators.required, this.matchValues('password')]],
    })
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => this.registerForm.controls['confirmPassword'].updateValueAndValidity()
    })
  } 

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control.value === control.parent?.get(matchTo)?.value ? null : {isMatching: true}
    }
  }
  

  register() {
    const dateOfBirth = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    this.registerForm.patchValue({dateOfBirth: dateOfBirth});
    const registerSubscription = this.accountService.register(this.registerForm.value).subscribe({
      next: _ => this.router.navigateByUrl('/members'),
      error: error => this.validationErrors = error,
    })
    this.subscription.add(registerSubscription);
  };

  cancel() {
    this.cancelRegister.emit(false);   // this is used in both ways old and new
  };

  private getDateOnly(dateOfBirth: string | undefined) {
    if(!dateOfBirth) return;
    return new Date(dateOfBirth).toISOString().slice(0,10);
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
