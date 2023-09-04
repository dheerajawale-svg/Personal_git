import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { CoursesCardListComponent } from './courses-card-list/courses-card-list.component';
import {CourseComponent} from "./course/course.component";
import {CoursesService} from "./services/courses.service";
import { CourseDialogComponent } from './course-dialog/course-dialog.component';
import { ReactiveFormsModule} from "@angular/forms";
import {CreateCourseComponent} from './create-course/create-course.component';
import {CreateCourseStep1Component} from './create-course/create-course-step-1/create-course-step-1.component';
import {CreateCourseStep2Component} from './create-course/create-course-step-2/create-course-step-2.component';

import {HttpClientModule} from "@angular/common/http";

import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button'
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDatepickerModule } from "@angular/material/datepicker";
import {  MatDialogModule } from "@angular/material/dialog";
import {  MatInputModule } from "@angular/material/input";
import {  MatListModule } from "@angular/material/list";
import {  MatPaginatorModule } from "@angular/material/paginator";
import {  MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import {  MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSortModule } from "@angular/material/sort";
import {  MatTableModule } from "@angular/material/table";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule} from '@angular/material/tooltip';
import { MatStepperModule } from '@angular/material/stepper';
import {MatGridListModule } from '@angular/material/grid-list';
import {MatTreeModule } from '@angular/material/tree';
import { MatFormFieldModule } from '@angular/material/form-field'
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FlexLayoutModule } from '@angular/flex-layout';

import {DragDropModule} from '@angular/cdk/drag-drop';
import {DragDropComponent} from './drag-drop/drag-drop.component';
import {TreeDemoComponent} from './tree-demo/tree-demo.component';

import {VirtualScrollingComponent} from './virtual-scrolling/virtual-scrolling.component';
import {ScrollingModule} from '@angular/cdk/scrolling';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        AboutComponent,
        CourseComponent,
        CoursesCardListComponent,
        CourseDialogComponent,
        CreateCourseComponent,
        CreateCourseStep1Component,
        CreateCourseStep2Component,
        DragDropComponent,
        TreeDemoComponent,
        VirtualScrollingComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,

        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatTabsModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatTooltipModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatStepperModule,
        MatDialogModule,
        MatSelectModule,
        MatCheckboxModule,
        MatRadioModule,
        MatSliderModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatGridListModule,
        MatTreeModule,
        MatFormFieldModule,
        MatSnackBarModule,

        FlexLayoutModule,
        ReactiveFormsModule,
        ScrollingModule,
        AppRoutingModule,
        DragDropModule,
    ],
    providers: [
        CoursesService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
