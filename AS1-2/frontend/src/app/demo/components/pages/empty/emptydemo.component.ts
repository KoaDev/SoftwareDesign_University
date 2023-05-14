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


    _idQuestionAuthor : string = '';



    ngOnInit() : void {
        if (this.route.snapshot.paramMap.get('_id') != null) {
            this.QuestionService.getbyid(String(this.route.snapshot.paramMap.get('_id'))).subscribe({
                next: (questions : Question) => {
                    this.question.push(questions);
                    this._idQuestionAuthor = questions.author;
                }
            });
        } else {
            this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Something wrong.' });
        }
        
        if (this.route.snapshot.paramMap.get('_id') != null){
            this.AnswerService.getAnswersByQuestionId(String(this.route.snapshot.paramMap.get('_id'))).subscribe({
                next: (answers: Array<Answer>) => {
                    this.answer = answers.sort((a, b) => this.calculateScore(b) - this.calculateScore(a));
                }
            });
        } else {
            this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'Something wrong.' });
        }
        
    }

    calculateScore(answer: Answer): number {
        return (answer.upvotes?.length ?? 0) - (answer.downvotes?.length ?? 0);
    }

    openUpdateAnswerDialog(answerId: string): void {
        this.selectedAnswerId = answerId;
        this.displayUpdateAnswer = true;
    }
    
    postAnswer() : void {
        if (this.AuthService.isLoggedIn()) {
            this.answerRequest.author = this.AuthService.getUser().id;
            this.answerRequest.question = String(this.route.snapshot.paramMap.get('_id'));
            this.answerRequest.timestamp = new Date().toISOString();

            this.displayAddAnswer = false;

            this.AnswerService.postAnswer(String(this.route.snapshot.paramMap.get('_id')), this.answerRequest).subscribe({
                next: (answer : Answer) => {
                    this.answer.push(this.answerRequest);
                    this.ngOnInit();
                    return this.service.add({ key: 'tst', severity: 'success', summary: '', detail: 'Post success' });
                },
                error: (err : any) => {
                    return this.service.add({ key: 'tst', severity: 'error', summary: "Error", detail: 'The answer body must be filled.' });
                }
            });
        } else {
            return this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'You must be logged in to view question details.' });    
        }
    }
    
    deleteAnswer(_id : string) : void {
        if (this.AuthService.isLoggedIn()) {
            this.AnswerService.deleteAnswer(_id).subscribe({
                next: (answer : Answer) => {
                    this.answer = this.answer.filter((answer : Answer) => answer._id !== _id);
                    this.service.add({ key: 'tst', severity: 'success', summary: 'Delete success' });
                }, 
                error: (err : any) => {
                    this.service.add({ key: 'tst', severity: 'error', summary: "Delete failed", detail: err.message });
                }
            });
        } else {
            this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'You must be logged in to view question details.' });    
        }
    }

    voteAnswer(_id : string, vote : string, answer: Answer) : void {
        if (this.AuthService.isLoggedIn()) {
            this.AnswerService.voteAnswer(_id, vote).subscribe({
                next: () => {

                    if (vote == "upvote") {
                        this.service.add({ key: 'tst', severity: 'success', summary: 'Success', detail: 'Upvote success'});

                        this.AuthService.getUserScoreById(this.getAuthorAnswer(answer)).subscribe({
                            next: (user) => {
                                const finalScore = user.score + 5;
                                this.AuthService.updateUserScoreById(finalScore.toString(), this.getAuthorQuestion()).subscribe({
                                    next: () => {
                                        this.service.add({ key: 'tst', severity: 'success', summary: 'Success', detail: 'Update score success'});
                                    },
                                    error: (err) => {
                                        this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: err.message});
                                    }
                                })
                            },
                            error: (err) => {
                                this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: err.message});
                            }
                        });



                    } else {
                        this.service.add({ key: 'tst', severity: 'success', summary: 'Success', detail: 'Downvote success'});

                        this.AuthService.getUserScoreById(this.getAuthorAnswer(answer)).subscribe({
                            next: (user) => {
                                const finalScore = user.score + -2.5;
                                this.AuthService.updateUserScoreById(finalScore.toString(), this.getAuthorQuestion()).subscribe({
                                    next: () => {
                                        this.service.add({ key: 'tst', severity: 'success', summary: 'Success', detail: 'Update score success'});
                                    },
                                    error: (err) => {
                                        this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: err.message});
                                    }
                                })
                            },
                            error: (err) => {
                                this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: err.message});
                            }
                        });
                    }

                    
                    
                    this.ngOnInit();
                },
                error: (err : any) => {
                    this.service.add({ key: 'tst', severity: 'error', summary: 'Vote faileds', detail: err.message });
                }
            });
        } else {
            this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'You must be logged in to view question details.' });    
        }
    }

    voteQuestion(_id : string, vote : string) : void {
        if (this.AuthService.isLoggedIn()) {

            this.QuestionService.voteQuestion(_id, vote).subscribe({
                next: () => {
                    this.ngOnInit();
                    if (vote == "upvote") {
                        this.service.add({ key: 'tst', severity: 'success', summary: 'Success', detail: 'Upvote success'});

                        this.AuthService.getUserScoreById(this.getAuthorQuestion()).subscribe({
                            next: (user) => {
                                const finalScore = user.score + 2.5;
                                this.AuthService.updateUserScoreById(finalScore.toString(), this.getAuthorQuestion()).subscribe({
                                    next: () => {
                                        this.service.add({ key: 'tst', severity: 'success', summary: 'Success', detail: 'Update score success'});
                                    },
                                    error: (err) => {
                                        this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: err.message});
                                    }
                                })
                            },
                            error: (err) => {
                                this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: err.message});
                            }
                        });

                    } else {
                        this.service.add({ key: 'tst', severity: 'success', summary: 'Success', detail: 'Downvote success'});

                        this.AuthService.getUserScoreById(this.getAuthorQuestion()).subscribe({
                            next: (user) => {
                                const finalScore = user.score - 1.5;
                                this.AuthService.updateUserScoreById(finalScore.toString(), this.getAuthorQuestion()).subscribe({
                                    next: () => {
                                        this.service.add({ key: 'tst', severity: 'success', summary: 'Success', detail: 'Update score success'});
                                    },
                                    error: (err) => {
                                        this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: err.message});
                                    }
                                })
                            },
                            error: (err) => {
                                this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: err.message});
                            }
                        });
                    }
                },
                error: (err : any) => {
                    if (vote == "upvote") {
                        this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'You already upvoted this question'});
                    } else {
                        this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'You already downvoted this question'});
                    }
                }
            });
        } else {
            this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'You must be logged in to view question details.' });    
        }
    }

    deleteQuestion(_id : string) : void {
        if (this.AuthService.isLoggedIn()) {

            this.QuestionService.delete(_id).subscribe({
                next: () => {
                    this.question = this.question.filter((question : Question) => question._id !== _id);
                    this.router.navigate(['/uikit/list']);
                },
                error: (err : any) => {
                    this.service.add({ key: 'tst', severity: 'error', summary: 'Delete failed', detail: err.message });
                }
            });
        } else {
            this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'You must be logged in to view question details.' });    
        }
    }
    
    updateAnswer() : void {
        if (this.AuthService.isLoggedIn()) {

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
        } else {
            this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'You must be logged in to view question details.' });    
        }
    }


    isAuthorQuestion() : boolean {
        if (this.AuthService.isLoggedIn()) {
            if (this.AuthService.isModerator()){
                return true;
            } else {
                return this.AuthService.getUser().id == this.getAuthorQuestion();
            }
        } else {
            return false;
        }
    }

    getTitleQuestion() : string {
        return this.question[0].title;
    }

    getBodyQuestion() : string {
        return this.question[0].body;
    }

    getAuthorQuestion() : string {
        return this.question[0].author;
    }

    getTimestampQuestion() : string {
        return this.question[0].timestamp;
    }

    getUpvotesQuestion(): Number {
        return this.question[0].upvotes?.length ?? 0;
    }

    getDownvotesQuestion(): Number {
        return this.question[0].downvotes?.length ?? 0;
    }

    getIdQuestion(): string {
        return String(this.route.snapshot.paramMap.get('_id'));;
    }
      


    getBodyAnswer(answer : Answer) : string {
        return answer.body;
    }

    getAuthorAnswer(answer : Answer) : string {
        return answer.author;
    }

    getTimestampAnswer(answer : Answer) : string {
        return answer.timestamp;
    }

    getUpvotesAnswer(answer : Answer): Number {
        return answer.upvotes?.length ?? 0;
    }

    getDownvotesAnswer(answer : Answer): Number {
        return answer.downvotes?.length ?? 0;
    }

    isAuthorAnswer(answer : Answer) : boolean {
        if (this.AuthService.isLoggedIn()) {
            if (this.AuthService.isModerator()){
                return true;
            } else {
                return answer.author == this.AuthService.getUser().id;
            }
        } else {
            return false;
        }
    }

    dialogAddAnswer() : void {
    
        if (this.AuthService.isLoggedIn()) {
            this.displayAddAnswer = true;
        } else {
            this.service.add({ key: 'tst', severity: 'error', summary: 'Error', detail: 'You must be logged in to view question details.' });
        }
    }

}

