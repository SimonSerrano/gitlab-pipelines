import pkceChallenge from 'pkce-challenge';
import { Configuration } from '../provider/ConfigurationProvider';
import { Service } from './Service';

type GitlabOAuthResponse = {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  refresh_token: string;
  created_at: number;
};
/**
 * Service that allows for connection to the OAuth PKCE flow on gitlab
 *
 * @class OAuthPKCEFlowService
 */
class OAuthPKCEFlowService extends Service {
  protected appID;
  protected redirectURI = `${window.location.origin}${
    process.env.REACT_APP_HOMEPAGE || ''
  }/oauth/redirect`;

  protected gitlabDomain;

  /**
   * Creates an instance of OAuthPKCEFlowService.
   * @param {AbortSignal} abortSignal
   * @param {Configuration} config
   * @memberof OAuthPKCEFlowService
   */
  constructor(abortSignal: AbortSignal, config: Configuration) {
    super(abortSignal);
    this.gitlabDomain = config.gitlabDomain;
    this.appID = config.appID;
  }

  /**
   * Requests an authorization url for OAuth redirect. It generates a CSRF token as well during the process if it fails to do so, an error is
   * thrown
   *
   * @return {Promise<string>}
   * @memberof OAuthPKCEFlowService
   */
  public async requestAuthorization(): Promise<string> {
    const pkce = this.getPKCE();
    return `https://${this.gitlabDomain}/oauth/authorize?client_id=${
      this.appID
    }&redirect_uri=${this.redirectURI}&response_type=code&state=${window.btoa(
      JSON.stringify(await this.requestCSRFToken()),
    )}&scope=read_api&code_challenge=${
      pkce.codeChallenge
    }&code_challenge_method=S256`;
  }

  /**
   * Check if the CSRF token is valid. If not throw an error
   *
   * @param {{token: string}} state
   * @return {Promise<void>}
   * @memberof OAuthPKCEFlowService
   */
  public async verifyState(state: { token: string }): Promise<void> {
    const body = new FormData();
    body.append('token', state.token);
    const res = await fetch(`${this.apiBaseUrl}/token`, {
      method: 'POST',
      signal: this.abortSignal,
      body,
    });
    if (res.status !== 200) {
      throw new Error('State is not valid');
    }
  }

  /**
   * Requests an access token against gitlab api. Throws an error if the access token could not be gotten
   *
   * @param {string} code
   * @return {Promise<GitlabOAuthResponse>}
   * @memberof OAuthPKCEFlowService
   */
  public async requestAccessToken(code: string): Promise<GitlabOAuthResponse> {
    const pkce = this.getPKCE();
    const body = new FormData();
    body.append('client_id', this.appID);
    body.append('code', code);
    body.append('grant_type', 'authorization_code');
    body.append('redirect_uri', this.redirectURI);
    body.append('code_verifier', pkce.codeVerifier);

    const res = await fetch(`https://${this.gitlabDomain}/oauth/token`, {
      method: 'POST',
      body,
    });
    if (res.status === 200) {
      const body = await res.json();
      return body;
    }

    throw new Error('Cannot request an access token');
  }

  /**
   * Refresh an access if expired. Throws an error if the access could not be refreshed
   *
   * @param {GitlabOAuthResponse} access
   * @return {Promise<GitlabOAuthResponse>}
   * @memberof OAuthPKCEFlowService
   */
  public async refresh(
    access: GitlabOAuthResponse,
  ): Promise<GitlabOAuthResponse> {
    const pkce = this.getPKCE();
    const body = new FormData();
    body.append('client_id', this.appID);
    body.append('refresh_token', access.refresh_token);
    body.append('grant_type', 'refresh_token');
    body.append('redirect_uri', this.redirectURI);
    body.append('code_verifier', pkce.codeVerifier);
    const res = await fetch(`https://${this.gitlabDomain}/oauth/token`, {
      method: 'POST',
      body,
    });
    if (res.status === 200) {
      const body = await res.json();
      return body;
    }

    throw new Error('Cannot request an access token');
  }

  /**
   * Requests a CSRF token from the api, if it fails to do so, throw an error
   *
   * @protected
   * @return {Promise<{token: string}>}
   * @memberof OAuthPKCEFlowService
   */
  protected async requestCSRFToken(): Promise<{ token: string }> {
    const res = await fetch(`${this.apiBaseUrl}/token`, {
      method: 'GET',
      signal: this.abortSignal,
    });

    if (res.status === 200) {
      const body = await res.json();
      if (body.token) {
        return body;
      }
    }
    throw new Error('Cannot get a CSRF token');
  }

  /**
   * Creates a PKCE challenge and code verifier
   *
   * @protected
   * @return {{ codeVerifier: string, codeChallenge: string }}
   * @memberof OAuthPKCEFlowService
   */
  protected getPKCE(): { codeVerifier: string; codeChallenge: string } {
    const pkce = localStorage.getItem('pkce');
    if (pkce) {
      return JSON.parse(pkce);
    }

    const { code_verifier: codeVerifier, code_challenge: codeChallenge } =
      pkceChallenge(Math.floor(Math.random() * (128 - 43 + 1) + 43));

    localStorage.setItem(
      'pkce',
      JSON.stringify({ codeVerifier, codeChallenge }),
    );

    return { codeVerifier, codeChallenge };
  }
}

export { OAuthPKCEFlowService };
export type { GitlabOAuthResponse };
