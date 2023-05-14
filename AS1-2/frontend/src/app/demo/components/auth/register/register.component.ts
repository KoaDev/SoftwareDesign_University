import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Message, MessageService } from 'primeng/api';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
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
export class RegisterComponent {
    name!: string;
    email!: string;
    password!: string;
    msgs: Message[] = [];
  
    constructor(private authService: AuthService, public layoutService: LayoutService, private router: Router, private service: MessageService) {}
  
    onSubmit() {
      this.authService.register(this.name, this.email, this.password)
        .subscribe(
          res => {
            localStorage.setItem('token', res.token);
            this.router.navigate(['']);
          },
          err => {
            console.log(err);
            this.service.add({ key: 'tst', severity: 'error', summary: err.error.message, detail: 'Validation failed' });
          }
        );
    }
}
