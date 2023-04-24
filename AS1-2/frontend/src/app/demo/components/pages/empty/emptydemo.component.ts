import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PrimeIcons } from 'primeng/api';
import { QuestionService } from 'src/app/services/question.service';
import { AnswerService } from 'src/app/services/answer.service';
import { Answer } from 'src/app/models/answer';
import { Question } from 'src/app/models/question';

import { AuthService } from 'src/app/services/auth.service';
import { Message, MessageService } from 'primeng/api';
import { Router } from '@angular/router';


@Component({
    templateUrl: './emptydemo.component.html',
    providers: [MessageService]
})
export class EmptyDemoComponent implements OnInit {


    constructor (private router: Router ,private service: MessageService, private QuestionService : QuestionService, private AnswerService : AnswerService, private route: ActivatedRoute, private AuthService : AuthService) {}

    answer : Array<Answer> = [];

    answerRequest : Answer = {
        body : '',
        author : '',
        question : '',
        timestamp : '',
    }


    question : Array<Question> = [];

    displayAddAnswer: boolean = false;
    displayUpdateAnswer: boolean = false;
    selectedAnswerId: string | null = null;


    _idUser : string = this.AuthService.getUser().id;
    _idQuestion : string = String(this.route.snapshot.paramMap.get('_id'));
    _idQuestionAuthor : string = '';



    ngOnInit() : void {
        if (this.route.snapshot.paramMap.get('_id') != null)
            this.QuestionService.getbyid(String(this.route.snapshot.paramMap.get('_id'))).subscribe({
                next: (questions : Question) => {
                    this.question.push(questions);
                    this._idQuestionAuthor = questions.author;
                }
            });
        else
            console.log("ERROR");


        if (this.route.snapshot.paramMap.get('_id') != null)
            this.AnswerService.getAnswersByQuestionId(String(this.route.snapshot.paramMap.get('_id'))).subscribe({
            next: (answers: Array<Answer>) => {
                this.answer = answers.sort((a, b) => this.calculateScore(b) - this.calculateScore(a));
            }
            });
        else
            console.log("ERROR");
    }

    calculateScore(answer: Answer): number {
        return (answer.upvotes?.length ?? 0) - (answer.downvotes?.length ?? 0);
    }

    openUpdateAnswerDialog(answerId: string): void {
        this.selectedAnswerId = answerId;
        this.displayUpdateAnswer = true;
      }
      

    postAnswer() : void {
        this.answerRequest.author = this.AuthService.getUser().id;
        this.answerRequest.question = String(this.route.snapshot.paramMap.get('_id'));
        this.answerRequest.timestamp = new Date().toISOString();

        this.displayAddAnswer = false;

        this.AnswerService.postAnswer(String(this.route.snapshot.paramMap.get('_id')), this.answerRequest).subscribe({
            next: (answer : Answer) => {
                this.answer.push(this.answerRequest);
                this.ngOnInit();
                this.service.add({ key: 'tst', severity: 'success', summary: '', detail: 'Post success' });
            },
            error: (err : any) => {
                this.service.add({ key: 'tst', severity: 'error', summary: err.message, detail: 'Post failed' });
            }
        });
    }
    

    deleteAnswer(_id : string) : void {
        this.AnswerService.deleteAnswer(_id).subscribe({
            next: (answer : Answer) => {
                this.answer = this.answer.filter((answer : Answer) => answer._id !== _id);
                this.service.add({ key: 'tst', severity: 'success', summary: 'Delete success' });
            }, 
            error: (err : any) => {
                this.service.add({ key: 'tst', severity: 'error', summary: "Delete failed", detail: err.message });
            }
        });
    }

    voteAnswer(_id : string, vote : string) : void {
        this.AnswerService.voteAnswer(_id, vote).subscribe({
            next: () => {
                this.ngOnInit();
                this.service.add({ key: 'tst', severity: 'success', summary: 'Vote success'});            },
            error: (err : any) => {
                this.service.add({ key: 'tst', severity: 'error', summary: 'Vote faileds', detail: err.message });
            }
        });
    }

    voteQuestion(_id : string, vote : string) : void {
        this.QuestionService.voteQuestion(_id, vote).subscribe({
            next: () => {
                this.ngOnInit();
                this.service.add({ key: 'tst', severity: 'success', summary: 'Vote success'});
            },
            error: (err : any) => {
                this.service.add({ key: 'tst', severity: 'error', summary: "Vote failed", detail: 'You already downvote this question !' });
            }
        });
    }

    deleteQuestion(_id : string) : void {
        this.QuestionService.delete(_id).subscribe({
            next: () => {
                this.question = this.question.filter((question : Question) => question._id !== _id);
                this.router.navigate(['/uikit/list']);
            },
            error: (err : any) => {
                this.service.add({ key: 'tst', severity: 'error', summary: 'Delete failed', detail: err.message });
            }
        });
    }
    

    updateAnswer() : void {
        this.AnswerService.updateAnswer(String(this.selectedAnswerId), this.answerRequest).subscribe({
            next: () => {
                this.ngOnInit();
                this.displayUpdateAnswer = false;
                this.service.add({ key: 'tst', severity: 'success', summary: 'Update success'});
            },
            error: (err : any) => {
                this.service.add({ key: 'tst', severity: 'error', summary: 'Update faileds', detail: err.message });
            }
        });
    }
}

