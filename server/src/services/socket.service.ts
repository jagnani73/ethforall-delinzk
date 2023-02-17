import { Server as HTTPServer } from "http";
import { Server } from "socket.io";

class SocketService {
  private static io: null | Server = null;
  private constructor() {}

  public static initSocket = async (expressServer: HTTPServer) => {
    try {
      this.io = new Server(expressServer, {
        cors: {
          origin: "*",
          methods: ["*"],
        },
      });
      process.on("SIGINT", () => this.io?.close());
      process.on("SIGHUP", () => this.io?.close());
      console.info(`Connected to Socket.IO on Port ${process.env.PORT}`);
      this.io.on("connection", (socket) => {
        console.log("New client connected:", socket.id);
        const sessionId = socket.handshake.query["x-session-id"] as string;
        socket.join(sessionId);
      });
      this.io.on("disconnect", (socket) => {
        console.log("New client disconnected:", socket.id);
      });
    } catch (err) {
      console.error("Could not connect to Socket.IO Server");
      console.error("SocketIOError\n%o", { error: err });
      throw err;
    }
  };
  public static getSocket = (): Server => {
    return this.io!;
  };
}

export default SocketService;
