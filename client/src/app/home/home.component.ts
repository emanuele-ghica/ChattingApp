import { Component} from '@angular/core';
import { RegisterComponent } from "../register/register.component";
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RegisterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {  
  registerMode = false;


  subscription = new Subscription();


  registerToggle() {
    this.registerMode = !this.registerMode;
  }

  cancelRegisterMode(event: boolean) {
    this.registerMode = event;
  }




}
