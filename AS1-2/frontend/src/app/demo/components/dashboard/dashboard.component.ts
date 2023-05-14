import { Component, OnInit, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Observable, Subscription } from 'rxjs';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AnswerService } from 'src/app/services/answer.service';
import { AuthService } from 'src/app/services/auth.service';
import { QuestionService } from 'src/app/services/question.service';

@Component({
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {

    score: number = 0;
    role: string = "";

    constructor(public layoutService: LayoutService, private AnswerService : AnswerService, private QuestionService : QuestionService, private AuthService : AuthService) { }

    ngOnInit() {
        this.AuthService.getUserScoreById(this.AuthService.getUser().id).subscribe((user) => {
            this.score = user.score;

            this.role = this.AuthService.getUser().role;
            
        });

        
    }
}
