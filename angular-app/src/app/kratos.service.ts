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

  protected sessionToken!: string;

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
  }

  public async login(passwordIdentifier: string, password: string): Promise<boolean> {
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

    const response = await this.ory.submitSelfServiceLoginFlow(
      this.loginFlow.id,
      undefined,
      body
    );

    return response.status === 200;;
  }

  public async registration(passwordIdentifier: string, password: string): Promise<boolean> {
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

    const response = await this.ory.submitSelfServiceRegistrationFlow(
      this.registrationFlow.id,
      body,
    );

    return response.status === 200;
  }

  public async logout(): Promise<boolean> {
    const logoutFlowResponse = await this.ory.createSelfServiceLogoutFlowUrlForBrowsers();
    const logoutResponse = await this.ory.submitSelfServiceLogoutFlow(logoutFlowResponse.data.logout_token);
    return logoutResponse.status === 204;
  }

  public async hasSession(): Promise<boolean> {
    try {
      const response = await this.ory.toSession();
      this.sessionToken = response.data.identity.id;
      const hasSession = response.status === 200 && !!response.data.active;

      console.log(hasSession);
      return hasSession;
    } catch (err) {
      return false;
    }
  }
}
