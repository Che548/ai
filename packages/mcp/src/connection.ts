import { EventEmitter } from 'events';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { WebSocketClientTransport } from '@modelcontextprotocol/sdk/client/websocket.js';
import { ResourceListChangedNotificationSchema } from '@modelcontextprotocol/sdk/types.js';
import type { Transport } from '@modelcontextprotocol/sdk/shared/transport.js';
import type { Logger } from 'winston';
import type * as t from './types/mcp.js';

export class MCPConnection extends EventEmitter {
  private static instance: MCPConnection | null = null;
  public client: Client;
  private transport: Transport | null = null; // Make this nullable
  private connectionState: t.ConnectionState = 'disconnected';
  private connectPromise: Promise<void> | null = null;
  private lastError: Error | null = null;
  private lastConfigUpdate = 0;
  private readonly CONFIG_TTL = 5 * 60 * 1000; // 5 minutes
  private reconnectAttempts = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 3;
  private readonly RECONNECT_DELAY = 1000; // 1 second

  constructor(private readonly options: t.MCPOptions, private logger?: Logger) {
    super();
    this.logger = logger;
    this.client = new Client(
      {
        name: 'librechat-client',
        version: '1.0.0',
      },
      {
        capabilities: {},
      },
    );

    this.setupEventListeners();
  }

  public static getInstance(options: t.MCPOptions): MCPConnection {
    if (!MCPConnection.instance) {
      MCPConnection.instance = new MCPConnection(options);
    }
    return MCPConnection.instance;
  }

  public static getExistingInstance(): MCPConnection | null {
    return MCPConnection.instance;
  }

  public static async destroyInstance(): Promise<void> {
    if (MCPConnection.instance) {
      await MCPConnection.instance.disconnect();
      MCPConnection.instance = null;
    }
  }

  private emitError(error: unknown, errorPrefix: string): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    this.logger?.error(`${errorPrefix} ${errorMessage}`, error);
    this.emit('error', new Error(`${errorPrefix} ${errorMessage}`));
  }

  private constructTransport(options: t.MCPOptions): Transport {
    try {
      switch (options.transport.type) {
        case 'stdio':
          return new StdioClientTransport({
            command: options.transport.command,
            args: options.transport.args,
          });
        case 'websocket':
          return new WebSocketClientTransport(new URL(options.transport.url));
        case 'sse': {
          const url = new URL(options.transport.url);
          this.logger?.info('Creating SSE transport with URL:', url.toString());
          const transport = new SSEClientTransport(url);

          // Add debug listeners
          transport.onclose = () => {
            this.logger?.info('SSE transport closed');
            this.emit('connectionChange', 'disconnected');
          };

          transport.onerror = (error) => {
            this.logger?.error('SSE transport error:', error);
            this.emitError(error, 'SSE transport error:');
          };

          transport.onmessage = (message) => {
            this.logger?.info('SSE transport received message:', message);
          };

          return transport;
        }
        default: {
          const transportType = (options.transport as { type: string }).type;
          throw new Error(`Unsupported transport type: ${transportType}`);
        }
      }
    } catch (error) {
      this.emitError(error, 'Failed to construct transport:');
      throw error;
    }
  }

  private setupEventListeners(): void {
    this.on('connectionChange', (state: t.ConnectionState) => {
      this.connectionState = state;
      if (state === 'error') {
        this.handleReconnection();
      }
    });

    this.subscribeToResources();
  }

  private async handleReconnection(): Promise<void> {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      this.emit('error', new Error('Max reconnection attempts reached'));
      return;
    }

    this.reconnectAttempts++;
    await new Promise((resolve) => setTimeout(resolve, this.RECONNECT_DELAY));

    try {
      await this.connectClient();
      this.reconnectAttempts = 0;
    } catch (error) {
      this.emit('error', error);
    }
  }

  private subscribeToResources(): void {
    this.client.setNotificationHandler(ResourceListChangedNotificationSchema, async () => {
      this.invalidateCache();
      this.emit('resourcesChanged');
    });
  }

  private invalidateCache(): void {
    // this.cachedConfig = null;
    this.lastConfigUpdate = 0;
  }

  async connectClient(): Promise<void> {
    if (this.connectionState === 'connected') {
      return;
    }

    if (this.connectPromise) {
      await this.connectPromise;
      return;
    }

    this.emit('connectionChange', 'connecting');

    this.connectPromise = (async () => {
      try {
        // Clean up existing connection if any
        if (this.transport) {
          try {
            await this.client.close();
            this.transport = null;
          } catch (error) {
            this.logger?.warn('Error closing existing connection:', error);
          }
        }

        this.logger?.info('Creating new transport...');
        this.transport = this.constructTransport(this.options);

        // Debug transport events
        this.transport.onmessage = (msg) => {
          this.logger?.info('Transport received message:', JSON.stringify(msg, null, 2));
        };

        const originalSend = this.transport.send.bind(this.transport);
        this.transport.send = async (msg) => {
          this.logger?.info('Transport sending message:', JSON.stringify(msg, null, 2));
          return originalSend(msg);
        };

        // Connect with longer timeout for debugging
        this.logger?.info('Connecting to transport...');
        const connectPromise = this.client.connect(this.transport);
        const timeoutPromise = new Promise((_resolve, reject) => {
          setTimeout(() => reject(new Error('Connection timeout')), 10000);
        });

        await Promise.race([connectPromise, timeoutPromise]);
        this.logger?.info('Successfully connected to transport');

        this.connectionState = 'connected';
        this.emit('connectionChange', 'connected');
        this.reconnectAttempts = 0;
      } catch (error) {
        this.logger?.error('Connection error:', error);
        this.connectionState = 'error';
        this.emit('connectionChange', 'error');
        this.lastError = error instanceof Error ? error : new Error(String(error));
        throw error;
      } finally {
        this.connectPromise = null;
      }
    })();

    return this.connectPromise;
  }

  public async disconnect(): Promise<void> {
    try {
      if (this.transport) {
        await this.client.close();
        this.transport = null;
      }
      this.connectionState = 'disconnected';
      this.emit('connectionChange', 'disconnected');
    } catch (error) {
      this.emit('error', error);
      throw error;
    } finally {
      this.invalidateCache();
      this.connectPromise = null;
    }
  }

  async fetchResources(): Promise<t.MCPResource[]> {
    try {
      const { resources } = await this.client.listResources();
      return resources;
    } catch (error) {
      this.emitError(error, 'Failed to fetch resources:');
      return [];
    }
  }

  async fetchTools() {
    try {
      const { tools } = await this.client.listTools();
      return tools;
    } catch (error) {
      this.emitError(error, 'Failed to fetch tools:');
      return [];
    }
  }

  async fetchPrompts(): Promise<t.MCPPrompt[]> {
    try {
      const { prompts } = await this.client.listPrompts();
      return prompts;
    } catch (error) {
      this.emitError(error, 'Failed to fetch prompts:');
      return [];
    }
  }

  // public async modifyConfig(config: ContinueConfig): Promise<ContinueConfig> {
  //   try {
  //     // Check cache
  //     if (this.cachedConfig && Date.now() - this.lastConfigUpdate < this.CONFIG_TTL) {
  //       return this.cachedConfig;
  //     }

  //     await this.connectClient();

  //     // Fetch and process resources
  //     const resources = await this.fetchResources();
  //     const submenuItems = resources.map(resource => ({
  //       title: resource.name,
  //       description: resource.description,
  //       id: resource.uri,
  //     }));

  //     if (!config.contextProviders) {
  //       config.contextProviders = [];
  //     }

  //     config.contextProviders.push(
  //       new MCPContextProvider({
  //         submenuItems,
  //         client: this.client,
  //       }),
  //     );

  //     // Fetch and process tools
  //     const tools = await this.fetchTools();
  //     const continueTools: Tool[] = tools.map(tool => ({
  //       displayTitle: tool.name,
  //       function: {
  //         description: tool.description,
  //         name: tool.name,
  //         parameters: tool.inputSchema,
  //       },
  //       readonly: false,
  //       type: 'function',
  //       wouldLikeTo: `use the ${tool.name} tool`,
  //       uri: `mcp://${tool.name}`,
  //     }));

  //     config.tools = [...(config.tools || []), ...continueTools];

  //     // Fetch and process prompts
  //     const prompts = await this.fetchPrompts();
  //     if (!config.slashCommands) {
  //       config.slashCommands = [];
  //     }

  //     const slashCommands: SlashCommand[] = prompts.map(prompt =>
  //       constructMcpSlashCommand(
  //         this.client,
  //         prompt.name,
  //         prompt.description,
  //         prompt.arguments?.map(a => a.name),
  //       ),
  //     );
  //     config.slashCommands.push(...slashCommands);

  //     // Update cache
  //     this.cachedConfig = config;
  //     this.lastConfigUpdate = Date.now();

  //     return config;
  //   } catch (error) {
  //     this.emit('error', error);
  //     // Return original config if modification fails
  //     return config;
  //   }
  // }

  // Public getters for state information
  public getConnectionState(): t.ConnectionState {
    return this.connectionState;
  }

  public isConnected(): boolean {
    return this.connectionState === 'connected';
  }

  public getLastError(): Error | null {
    return this.lastError;
  }
}
