import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration, SelfServiceLoginFlow, V0alpha2Api } from '@ory/kratos-client';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KratosService {
  protected ory: V0alpha2Api;
  protected loginFlow!: SelfServiceLoginFlow;

  constructor(
    protected httpClient: HttpClient,
  ) {
    this.ory = new V0alpha2Api(new Configuration({ basePath: environment.basePath }));

    this.initLoginFlow();
  }

  public initLoginFlow(): void {
    this.ory.initializeSelfServiceLoginFlowForBrowsers(
      false,
      undefined,
      undefined,
    )
      .then(({ data }) => {
        this.loginFlow = data;
        console.log(this.loginFlow);
      });
  }

  public doLogin(passwordIdentifier: string, password: string): void {
    const body: any = {};

    for (const node of this.loginFlow.ui.nodes as any[]) {
      if (node.attributes['name'] === 'password_identifier') {
        body['password_identifier'] = passwordIdentifier;
      } else if (node.attributes['name'] === 'password') {
        body['password'] = password;
      } else {
        body[node.attributes['name']] = node.attributes['value'];
      }
    }

    const headers: HttpHeaders = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    headers.append('X-CSRF-Token', body['csrf_token']);

    this.httpClient.post(
      this.loginFlow.ui.action,
      body,
      { headers, withCredentials: true }
    ).subscribe((result) => {
      console.log(result);
    });
  }
}
