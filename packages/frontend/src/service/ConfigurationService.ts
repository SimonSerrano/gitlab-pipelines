import { Configuration } from '../provider/ConfigurationProvider';
import { Service } from './Service';

/**
 * Service to get the current configuration
 *
 * @class ConfigurationService
 * @extends {Service}
 */
class ConfigurationService extends Service {
  /**
   * Get the configuration
   *
   * @return {Promise<Configuration>}
   * @memberof ConfigurationService
   */
  async getConfig(): Promise<Configuration> {
    const res = await fetch(`${this.apiBaseUrl}/config`, {
      method: 'GET',
    });
    if (res.status === 200) {
      const body = await res.json();
      return body;
    }

    throw new Error('Cannot request an access token');
  }
}

export { ConfigurationService };
