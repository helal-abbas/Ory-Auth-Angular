import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KratosService } from './../kratos.service';
import  axios  from 'axios'

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(
    protected kratos: KratosService,
    protected router: Router,
  ) { }

  ngOnInit(): void {
  }

  async onLogout(): Promise<void> {
    if (await this.kratos.logout()) {
      this.router.navigate(['/login']);
    }
  }

  async onWhoAmI() : Promise<void> {
    const response = await axios.get('http://127.0.0.1:4433/sessions/whoami')
      .then((res) => {
        return res.data;
      }).catch((error) => {
        throw Error('Unauthorised');
      });
      
  }
}
