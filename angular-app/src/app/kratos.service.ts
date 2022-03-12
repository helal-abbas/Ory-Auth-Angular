import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration, SelfServiceLoginFlow, SelfServiceRegistrationFlow, V0alpha2Api } from '@ory/kratos-client';
import { environment } from './../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class KratosService {
  protected ory: V0alpha2Api;
  protected loginFlow!: SelfServiceLoginFlow;
  protected registrationFlow!: SelfServiceRegistrationFlow;

  constructor(
    protected httpClient: HttpClient,
  ) {
    const configuration = new Configuration({
      basePath: environment.basePath,
      baseOptions: {
        withCredentials: true,
      }
    });

    this.ory = new V0alpha2Api(configuration);
  }

  public async initLoginFlow(): Promise<void> {
    this.loginFlow = (await this.ory.initializeSelfServiceLoginFlowForBrowsers(
      false,
      undefined,
      undefined,
    )).data;
  }

  public async initRegistrationFlow(): Promise<void> {
    this.registrationFlow = (await this.ory.initializeSelfServiceRegistrationFlowForBrowsers(undefined)).data;
    console.log(this.registrationFlow);
  }

  public async doLogin(passwordIdentifier: string, password: string): Promise<void> {
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

    console.log(await this.ory.submitSelfServiceLoginFlow(
      this.loginFlow.id,
      undefined,
      body
    ));
  }

  public async doRegistration(passwordIdentifier: string, password: string): Promise<void> {
    const body: any = {};

    for (const node of this.registrationFlow.ui.nodes as any[]) {
      if (node.attributes['name'] === 'traits.email') {
        body['traits.email'] = passwordIdentifier;
      } else if (node.attributes['name'] === 'password') {
        body['password'] = password;
      } else {
        body[node.attributes['name']] = node.attributes['value'];
      }
    }

    console.log(await this.ory.submitSelfServiceRegistrationFlow(
      this.registrationFlow.id,
      body,
    ));
  }
}
