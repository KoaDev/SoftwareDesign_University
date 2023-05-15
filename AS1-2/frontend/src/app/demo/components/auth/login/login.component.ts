import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Message, MessageService } from 'primeng/api';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    providers: [MessageService]
})
export class LoginComponent {
    email!: string;
    password!: string;
    msgs: Message[] = [];
  
    constructor(private authService: AuthService, public layoutService: LayoutService, private router: Router, private service: MessageService) {}
  
    onSubmit() {
      this.authService.login(this.email, this.password)
        .subscribe(
          res => {
            localStorage.setItem('token', res.token);

            if (this.authService.getUser().role == "banned") {
              alert("You are banned");
              localStorage.removeItem('token');
            }

            this.router.navigate(['']);
          },
          err => {
            this.service.add({ key: 'tst', severity: 'error', summary: err.error.message, detail: 'Validation failed' });
          }
        );
    }
  }
