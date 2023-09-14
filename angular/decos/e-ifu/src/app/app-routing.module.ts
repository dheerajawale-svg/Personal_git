import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WelcomeComponent } from './welcome/welcome.component';
import { ThemeSwitchComponent } from './theme-switch/theme-switch.component';

const routes: Routes = [
  {path: '', component: WelcomeComponent},
  {path: 'theme', component: ThemeSwitchComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
