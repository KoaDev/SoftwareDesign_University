import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmptyDemoRoutingModule } from './emptydemo-routing.module';
import { EmptyDemoComponent } from './emptydemo.component';
import { TimelineModule } from 'primeng/timeline';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { FormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { FieldsetModule } from 'primeng/fieldset';

@NgModule({
    imports: [
        CommonModule,
        EmptyDemoRoutingModule,
        TimelineModule,
        ButtonModule,
        CardModule,
        TagModule,
        DialogModule,
        FormsModule,
        ToastModule,
        FieldsetModule
    ],
    declarations: [EmptyDemoComponent]
})
export class EmptyDemoModule { }
