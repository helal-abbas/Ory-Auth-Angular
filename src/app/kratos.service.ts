import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Configuration, Identity, SelfServiceLoginFlow, SelfServiceRegistrationFlow, V0alpha2Api } from '@ory/kratos-client';
import { environment } from './../environments/environment';
import axios from 'axios';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class KratosService {
  protected ory: V0alpha2Api;

  protected loginFlow!: SelfServiceLoginFlow;
  protected registrationFlow!: SelfServiceRegistrationFlow;

  protected identity!: Identity;
  public response!: any;

  constructor(
    protected httpClient: HttpClient,
    protected router: Router,
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
      true,
      undefined,
      undefined,
    )).data;
    this.router.navigate([`/login`],
    { queryParams: { flow: this.loginFlow.id } }
    );
  }

  public async initRegistrationFlow(): Promise<void> {
    console.log("Initiated for registration")
    // this.registrationFlow = (await this.ory.initializeSelfServiceRegistrationFlowForBrowsers(undefined)).data;
    this.response = await axios.get('http://127.0.0.1:4433/self-service/registration/browser', {
      withCredentials: true
    })
    console.log("Closed Initiation", `/registration?flow=${this.response.data.id}` )
    console.log(this.response.data.ui.nodes[0].attributes.value)
   
    this.router.navigate([`/registration`],
    { queryParams: { flow: this.response.data.id } }
    );
   
    return
  }

  public async login(passwordIdentifier: string, password: string): Promise<boolean> {
    let body: any = {};
    console.log('-------------------------------------------------')
    console.log(passwordIdentifier)

    console.log('-------------------------------------------------')
    console.log(password)
    for (const node of this.loginFlow.ui.nodes as any[]) {
      if (node.attributes['name'] === 'password_identifier') {
        body['password_identifier'] = passwordIdentifier;
      } else if (node.attributes['name'] === 'password') {
        body['password'] = password;
      } else {
        body[node.attributes['name']] = node.attributes['value'];
      }
    }
    
    body = { ...body, password_identifier: passwordIdentifier}
    console.log(body)
    const param = {
      csrf_token: body.csrf_token,
      method: 'password',
      password: body.password,
      password_identifier: body.password_identifier
    }
    const response = await this.ory.submitSelfServiceLoginFlow(
      this.loginFlow.id,
      undefined,
      param
    );

    return response.status === 200;
  }

  public async registration(passwordIdentifier: string, password: string, firstName: string, lastName: string, companyName: string, phoneNumber: string,userName: string): Promise<boolean> {
    let body: any = {};

    for (const node of this.response?.data.ui?.nodes as any[]) {
      if (node.attributes['name'] === 'traits.email') {
        body['traits.email'] = passwordIdentifier;
      } else if (node.attributes['name'] === 'password') {
        body['password'] = password;
      } else {
        body[node.attributes['name']] = node.attributes['value'];
      }
    }
   
    body = {...body, "traits.name.first":firstName ,'traits.name.last': lastName, 'traits.corporate.companyName': companyName, 'traits.username': userName, 'traits.phoneNumber.phoneNumber': phoneNumber }
    
    // const response = await this.ory.submitSelfServiceRegistrationFlow(
    //   this.registrationFlow.id,
    //   body,
    // );
    const response : any=await axios.post(`http://127.0.0.1:4433/self-service/registration?flow=${this.response.data.id}`,
    body,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },}
        ).then((res: any) => {
          // console.log(res)
          return res
          }).catch((error: any) => {
            console.log(error)
          });
          
          console.log("respons edata",response)
    return response.status === 200
  }

  public async logout(): Promise<boolean> {
    const logoutFlowResponse = await this.ory.createSelfServiceLogoutFlowUrlForBrowsers();
    const logoutResponse = await this.ory.submitSelfServiceLogoutFlow(logoutFlowResponse.data.logout_token);
    return logoutResponse.status === 204;
  }

  public async hasIdentity(): Promise<boolean> {
    try {
      const response = await this.ory.toSession();
      this.identity = response.data.identity;

      return response.status === 200 && !!response.data.active;
    } catch (err) {
      return false;
    }
  }
}
