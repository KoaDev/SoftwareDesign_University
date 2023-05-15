import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem, MessageService } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { User } from 'src/app/models/user';
import { AnswerService } from 'src/app/services/answer.service';
import { AuthService } from 'src/app/services/auth.service';
import { QuestionService } from 'src/app/services/question.service';

@Component({
    templateUrl: './dashboard.component.html',
    providers: [MessageService]
})
export class DashboardComponent implements OnInit {

    score: number = 0;
    role: string = "";


    listOfUsers: User[] = [];


    constructor(public layoutService: LayoutService, private service: MessageService, private AnswerService : AnswerService, private QuestionService : QuestionService, private AuthService : AuthService) { }

    ngOnInit() {
        this.AuthService.getUserScoreById(this.AuthService.getUser().id).subscribe((user) => {
            this.score = user.score;

            this.role = this.AuthService.getUser().role;

            if(this.role == "moderator"){
                this.AuthService.getAllUsers().subscribe((users) => {
                    this.listOfUsers = users;
                });
            }
            
        });
    }

    isModerator(){
        if(this.role == "moderator"){
            return true;
        }
        else{
            return false;
        }
    }

    banUser(user : User){
        if(user.role = "user") {
            this.AuthService.banUserById(user._id || '').subscribe((user) => {
                this.service.add({ key: 'tst', severity: 'success', summary: 'Success', detail: 'User banned successfully' });
                this.ngOnInit();
            });
        }
        
        if (user.role = "banned") {
            this.AuthService.unbanUserById(user._id || '').subscribe((user) => {
                this.service.add({ key: 'tst', severity: 'success', summary: 'Success', detail: 'User unbanned successfully' });
                this.ngOnInit();
            });
        }
    }

}
