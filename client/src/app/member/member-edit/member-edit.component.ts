import { Component, HostListener, inject, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { Member } from '../../_models/member';
import { AccountService } from '../../_services/account.service';
import { MembersService } from '../../_services/members.service';
import { Subscription } from 'rxjs';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { FormsModule, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-edit',
  standalone: true,
  imports: [TabsModule, FormsModule],
  templateUrl: './member-edit.component.html',
  styleUrl: './member-edit.component.css'
})
export class MemberEditComponent implements OnInit, OnDestroy{
  @ViewChild('editForm') editForm? : NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: any) {
    if(this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
 
  private accountService = inject(AccountService);
  private memberService = inject(MembersService);
  private toastr = inject(ToastrService);
  private subscription = new Subscription;
  member?: Member;


  ngOnInit(): void {
   this.loadMember();
  }

  loadMember() {
    const user = this.accountService.currentUser();
    if(!user) return;
    const loadMemberSubscription = this.memberService.getMember(user.username).subscribe({
      next: member => this.member = member
    })
    this.subscription.add(loadMemberSubscription);
  }

  updateMember() {
    const updateMemberSubscription = this.memberService.updateMember(this.editForm?.value).subscribe({
      next: _ => {
        this.toastr.success("Profile update successfully")
        this.editForm?.reset(this.member)
      }
    })
    this.subscription.add(updateMemberSubscription);
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
