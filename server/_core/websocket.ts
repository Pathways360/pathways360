import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import { verify } from 'jsonwebtoken';

interface AuthenticatedWebSocket extends WebSocket {
  userId?: number;
  role?: string;
  isAlive?: boolean;
  subscriptions?: string[];
}

interface NotificationPayload {
  type: 'alert' | 'message' | 'referral' | 'appointment' | 'reminder';
  title: string;
  description?: string;
  data?: Record<string, any>;
  targetRoles?: string[];
  targetUserIds?: number[];
}

class WebSocketManager {
  private wss: WebSocketServer;
  private clients: Map<number, Set<AuthenticatedWebSocket>> = new Map();
  private JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

  constructor(server: Server) {
    this.wss = new WebSocketServer({ server, path: '/api/ws' });
    this.setupConnectionHandler();
    this.setupHeartbeat();
  }

  private setupConnectionHandler() {
    this.wss.on('connection', (ws: AuthenticatedWebSocket, req) => {
      const token = this.extractToken(req.url || '');
      
      if (!token) {
        ws.close(1008, 'Unauthorized');
        return;
      }

      try {
        const decoded: any = verify(token, this.JWT_SECRET);
        ws.userId = Number(decoded.sub);
        ws.role = String(decoded.role);
        ws.isAlive = true;

        // Register client
        if (!this.clients.has(ws.userId)) {
          this.clients.set(ws.userId, new Set());
        }
        this.clients.get(ws.userId)!.add(ws);

        // Send connection confirmation
        ws.send(JSON.stringify({
          type: 'connected',
          userId: ws.userId,
          role: ws.role,
          timestamp: new Date().toISOString(),
        }));

        // Handle messages
        ws.on('message', (data) => this.handleMessage(ws, data));
        ws.on('close', () => this.handleClose(ws));
        ws.on('pong', () => {
          ws.isAlive = true;
        });
      } catch (error) {
        ws.close(1008, 'Invalid token');
      }
    });
  }

  private setupHeartbeat() {
    const interval = setInterval(() => {
      this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
        if (!ws.isAlive) {
          ws.terminate();
          return;
        }
        ws.isAlive = false;
        ws.ping();
      });
    }, 30000);

    this.wss.on('close', () => clearInterval(interval));
  }

  private extractToken(url: string): string | null {
    const match = url.match(/token=([^&]*)/);
    return match ? match[1] : null;
  }

  private handleMessage(ws: AuthenticatedWebSocket, data: Buffer | ArrayBuffer | Buffer[]) {
    try {
      let str = '';
      if (typeof data === 'string') {
        str = data;
      } else if (Buffer.isBuffer(data)) {
        str = data.toString();
      } else if (data instanceof ArrayBuffer) {
        str = Buffer.from(data).toString();
      } else if (Array.isArray(data)) {
        str = Buffer.concat(data).toString();
      }
      
      const message = JSON.parse(str);
      if (message.type === 'subscribe') {
        ws.subscriptions = message.subscriptions || [];
      }
    } catch (error) {
      console.error('WebSocket message error:', error);
    }
  }

  private handleClose(ws: AuthenticatedWebSocket) {
    if (ws.userId) {
      const clientSet = this.clients.get(ws.userId);
      if (clientSet) {
        clientSet.delete(ws);
        if (clientSet.size === 0) {
          this.clients.delete(ws.userId);
        }
      }
    }
  }

  /**
   * Broadcast notification to specific users or roles
   */
  public broadcast(notification: NotificationPayload) {
    const payload = JSON.stringify({
      ...notification,
      timestamp: new Date().toISOString(),
    });

    if (notification.targetUserIds && notification.targetUserIds.length > 0) {
      // Send to specific users
      notification.targetUserIds.forEach((userId) => {
        const clientSet = this.clients.get(userId);
        if (clientSet) {
          clientSet.forEach((ws) => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(payload);
            }
          });
        }
      });
    } else if (notification.targetRoles && notification.targetRoles.length > 0) {
      // Send to users with specific roles
      this.clients.forEach((clientSet, userId) => {
        clientSet.forEach((ws: AuthenticatedWebSocket) => {
          if (
            ws.readyState === WebSocket.OPEN &&
            ws.role &&
            notification.targetRoles?.includes(ws.role)
          ) {
            ws.send(payload);
          }
        });
      });
    } else {
      // Broadcast to all connected clients
      this.wss.clients.forEach((ws: AuthenticatedWebSocket) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload);
        }
      });
    }
  }

  /**
   * Send notification to specific user
   */
  public sendToUser(userId: number, notification: NotificationPayload) {
    const clientSet = this.clients.get(userId);
    if (clientSet) {
      const payload = JSON.stringify({
        ...notification,
        timestamp: new Date().toISOString(),
      });
      clientSet.forEach((ws) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(payload);
        }
      });
    }
  }

  /**
   * Send notification to multiple users
   */
  public sendToUsers(userIds: number[], notification: NotificationPayload) {
    const payload = JSON.stringify({
      ...notification,
      timestamp: new Date().toISOString(),
    });
    userIds.forEach((userId) => {
      const clientSet = this.clients.get(userId);
      if (clientSet) {
        clientSet.forEach((ws) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.send(payload);
          }
        });
      }
    });
  }

  /**
   * Send notification to users with specific role
   */
  public sendToRole(role: string, notification: NotificationPayload) {
    const payload = JSON.stringify({
      ...notification,
      timestamp: new Date().toISOString(),
    });
    this.clients.forEach((clientSet) => {
      clientSet.forEach((ws: AuthenticatedWebSocket) => {
        if (ws.readyState === WebSocket.OPEN && ws.role === role) {
          ws.send(payload);
        }
      });
    });
  }

  /**
   * Get number of connected clients
   */
  public getConnectionCount(): number {
    return this.wss.clients.size;
  }

  /**
   * Get number of connected users
   */
  public getConnectedUsers(): number {
    return this.clients.size;
  }

  /**
   * Get connected user IDs
   */
  public getConnectedUserIds(): number[] {
    return Array.from(this.clients.keys());
  }
}

let wsManager: WebSocketManager | null = null;

export function initializeWebSocket(server: Server): WebSocketManager {
  if (!wsManager) {
    wsManager = new WebSocketManager(server);
  }
  return wsManager;
}

export function getWebSocketManager(): WebSocketManager | null {
  return wsManager;
}

export type { NotificationPayload };
