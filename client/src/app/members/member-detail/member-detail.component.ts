import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { MembersService } from '../../_services/members.service';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../_models/member';
import { Subscription } from 'rxjs';
import { TabsModule } from 'ngx-bootstrap/tabs';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [TabsModule],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css'
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  private memberService = inject(MembersService);
  private route = inject(ActivatedRoute);
  member?: Member;
  private subsciption = new Subscription();

  ngOnInit() : void {
    this.loadMember();
  }

  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    if(!username) return;
    const loadMemberSubscription = this.memberService.getMember(username).subscribe({
      next: member => this.member = member
    })
    this.subsciption.add(loadMemberSubscription);
  } 
  

  ngOnDestroy(): void {
    this.subsciption.unsubscribe();
  }



}
