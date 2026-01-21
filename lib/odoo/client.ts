import axios, { AxiosInstance } from 'axios';

export interface OdooConfig {
  url: string;
  db: string;
  username: string;
  password: string;
}

export class OdooClient {
  private axiosInstance: AxiosInstance;
  private config: OdooConfig;
  private sessionId: string | null = null;
  private uid: number | null = null;
  private authenticating: Promise<void> | null = null;

  constructor(config: OdooConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.url,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
      timeout: 30000, // 30 second timeout
    });
  }

  /**
   * Authenticate with Odoo and get session
   * Uses a promise to prevent multiple simultaneous auth attempts
   */
  async authenticate(): Promise<void> {
    // If already authenticating, wait for that to complete
    if (this.authenticating) {
      return this.authenticating;
    }

    // If already authenticated with valid session, skip
    if (this.uid && this.sessionId) {
      return;
    }

    this.authenticating = (async () => {
      try {
        console.log('Authenticating with Odoo...');
        const response = await this.axiosInstance.post('/web/session/authenticate', {
          jsonrpc: '2.0',
          params: {
            db: this.config.db,
            login: this.config.username,
            password: this.config.password,
          },
        });

        if (response.data.error) {
          const errorMsg = response.data.error.message || response.data.error.data?.message || 'Unknown authentication error';
          throw new Error(`Odoo authentication failed: ${errorMsg}`);
        }

        if (!response.data.result || !response.data.result.uid) {
          throw new Error('Odoo authentication failed: No UID returned');
        }

        this.uid = response.data.result.uid;
        this.sessionId = response.data.result.session_id;

        console.log(`✅ Authenticated successfully as UID: ${this.uid}`);

        // Store cookies for session management
        if (response.headers['set-cookie']) {
          const cookies = response.headers['set-cookie'];
          this.axiosInstance.defaults.headers.common['Cookie'] = cookies.join('; ');
        }
      } catch (error: any) {
        this.uid = null;
        this.sessionId = null;
        
        if (error.response?.data?.error) {
          const odooError = error.response.data.error;
          throw new Error(`Odoo authentication error: ${odooError.message || odooError.data?.message || 'Unknown error'}`);
        }
        
        throw new Error(`Odoo authentication error: ${error.message}`);
      } finally {
        this.authenticating = null;
      }
    })();

    return this.authenticating;
  }

  /**
   * Execute an Odoo model method via JSON-RPC
   */
  async call(
    model: string,
    method: string,
    args: any[] = [],
    kwargs: any = {},
    retryCount: number = 0
  ): Promise<any> {
    // Authenticate if not already authenticated
    if (!this.uid) {
      await this.authenticate();
    }

    try {
      const response = await this.axiosInstance.post('/web/dataset/call_kw', {
        jsonrpc: '2.0',
        method: 'call',
        params: {
          model,
          method,
          args,
          kwargs,
        },
      });

      // Check for Odoo errors in response
      if (response.data.error) {
        const errorMessage = response.data.error.message || response.data.error.data?.message || 'Unknown Odoo error';
        
        // Check if it's a session expiry error
        const isSessionError = 
          errorMessage.includes('Session') ||
          errorMessage.includes('session') ||
          errorMessage.includes('expired') ||
          errorMessage.includes('Expired') ||
          response.data.error.code === 100 ||
          response.data.error.data?.name === 'odoo.http.SessionExpiredException';

        // Retry authentication once if session expired
        if (isSessionError && retryCount === 0) {
          console.log('Session expired, re-authenticating...');
          this.sessionId = null;
          this.uid = null;
          await this.authenticate();
          return this.call(model, method, args, kwargs, retryCount + 1);
        }

        throw new Error(errorMessage);
      }

      return response.data.result;
    } catch (error: any) {
      // Handle network/HTTP errors
      if (error.response?.status === 401 && retryCount === 0) {
        console.log('401 Unauthorized, re-authenticating...');
        this.sessionId = null;
        this.uid = null;
        await this.authenticate();
        return this.call(model, method, args, kwargs, retryCount + 1);
      }
      throw error;
    }
  }

  /**
   * Search and read records from an Odoo model
   */
  async searchRead(
    model: string,
    domain: any[] = [],
    fields: string[] = [],
    limit: number = 0,
    offset: number = 0
  ): Promise<any[]> {
    return this.call(model, 'search_read', [], {
      domain,
      fields,
      limit,
      offset,
    });
  }

  /**
   * Create a record in an Odoo model
   */
  async create(model: string, values: any): Promise<number> {
    return this.call(model, 'create', [values]);
  }

  /**
   * Write/update records in an Odoo model
   */
  async write(model: string, ids: number[], values: any): Promise<boolean> {
    return this.call(model, 'write', [ids, values]);
  }

  /**
   * Read records from an Odoo model
   */
  async read(model: string, ids: number[], fields: string[] = []): Promise<any[]> {
    return this.call(model, 'read', [ids], { fields });
  }

  /**
   * Execute workflow action
   * @deprecated Odoo has moved to activity-based workflows. This method may not work in newer versions.
   * Use action methods like action_confirm, action_done, etc. instead.
   */
  async execWorkflow(model: string, id: number, signal: string): Promise<any> {
    return this.call(model, 'exec_workflow', [[id], signal]);
  }
}

// Singleton instance
let odooClientInstance: OdooClient | null = null;

export function getOdooClient(): OdooClient {
  if (!odooClientInstance) {
    const config: OdooConfig = {
      url: process.env.ODOO_URL || '',
      db: process.env.ODOO_DB || '',
      username: process.env.ODOO_USERNAME || '',
      password: process.env.ODOO_PASSWORD || '',
    };

    if (!config.url || !config.db || !config.username || !config.password) {
      throw new Error('Odoo configuration is incomplete. Check environment variables.');
    }

    odooClientInstance = new OdooClient(config);
  }

  return odooClientInstance;
}

/**
 * Reset the Odoo client singleton (useful for reconnection or testing)
 */
export function resetOdooClient(): void {
  odooClientInstance = null;
}
