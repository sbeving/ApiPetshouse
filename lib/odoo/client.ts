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

  constructor(config: OdooConfig) {
    this.config = config;
    this.axiosInstance = axios.create({
      baseURL: config.url,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true,
    });
  }

  /**
   * Authenticate with Odoo and get session
   */
  async authenticate(): Promise<void> {
    try {
      const response = await this.axiosInstance.post('/web/session/authenticate', {
        jsonrpc: '2.0',
        params: {
          db: this.config.db,
          login: this.config.username,
          password: this.config.password,
        },
      });

      if (response.data.error) {
        throw new Error(`Odoo authentication failed: ${response.data.error.message}`);
      }

      this.uid = response.data.result.uid;
      this.sessionId = response.data.result.session_id;

      // Store cookies for session management
      if (response.headers['set-cookie']) {
        const cookies = response.headers['set-cookie'];
        this.axiosInstance.defaults.headers.common['Cookie'] = cookies.join('; ');
      }
    } catch (error: any) {
      throw new Error(`Odoo authentication error: ${error.message}`);
    }
  }

  /**
   * Execute an Odoo model method via JSON-RPC
   */
  async call(
    model: string,
    method: string,
    args: any[] = [],
    kwargs: any = {}
  ): Promise<any> {
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

      if (response.data.error) {
        throw new Error(response.data.error.message);
      }

      return response.data.result;
    } catch (error: any) {
      // Re-authenticate if session expired
      if (error.response?.status === 401 || error.message.includes('session')) {
        this.sessionId = null;
        this.uid = null;
        await this.authenticate();
        return this.call(model, method, args, kwargs);
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
