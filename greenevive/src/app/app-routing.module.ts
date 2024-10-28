import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';




const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
   
   {
     path: '',
     loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule),
   },
  {
    path: 'sign-in',
    loadChildren: () => import('./pages/sign-in/sign-in.module').then( m => m.SignInPageModule)
  },
  {
    path: 'sign-up',
    loadChildren: () => import('./pages/sign-up/sign-up.module').then( m => m.SignUpPageModule)
  },
  {
    path: 'forgot-password',
    loadChildren: () => import('./pages/forgot-password/forgot-password.module').then( m => m.ForgotPasswordPageModule)
  },
  {
    path: 'quotes',
    loadChildren: () => import('./pages/quotes/quotes.module').then( m => m.QuotesPageModule)
  },
  {
    path: 'activities',
    loadChildren: () => import('./pages/activities/activities.module').then( m => m.ActivitiesPageModule)
  },
  {
    path: 'invalid-op',
    loadChildren: () => import('./invalid-op/invalid-op.module').then( m => m.InvalidOpPageModule)
  },
  {
    path: 'habits',
    loadChildren: () => import('./pages/habits/habits.module').then( m => m.HabitsPageModule)
  },

  

  
  // { path: 'sign-up', component: SignUpComponent},
  // { path: 'sign-in', component: SignInComponent},
 
  
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
  
}
