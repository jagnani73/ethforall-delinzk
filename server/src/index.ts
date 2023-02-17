import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import { config as dotenvConfig } from "dotenv";

import orgRoutes from "./org/org.routes";
import CacheService from "./services/cache.service";
import TunnelService from "./services/tunnel.service";
import SocketService from "./services/socket.service";
import SupabaseService from "./services/supabase.service";
import adminRoutes from "./admin/admin.routes";
import EmailService from "./services/email.service";
import TokenService from "./services/token.service";
import userRoutes from "./user/user.routes";

dotenvConfig();
const app: Express = express();

app.use(cors());

app.use("/api/v1/org", orgRoutes);
app.use("/api/v1/admin", express.json(), adminRoutes);
app.use("/api/v1/user", userRoutes);
app.get("/api/v1/healthcheck", (req: Request, res: Response) => {
  res.json({
    success: true,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

app.use("*", (req: Request, res: Response, next: NextFunction) => {
  res.status(405).json({
    success: false,
    message: "Method Not Allowed!",
  });
});
app.use((err: Error | any, req: Request, res: Response, next: NextFunction) => {
  if (err?.errorCode) {
    console.error("User Input Error!");
    console.error(err);
    res.status(err.errorCode).json({
      success: false,
      message: `${err.name}: ${err.message}`,
    });
  } else {
    console.error("Unknown Error Occurred!");
    console.error(new Date().toISOString());
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Internal Server Error!",
    });
  }
});

Promise.all([
  CacheService.initCache(),
  TunnelService.initTunnel(),
  SupabaseService.initSupabase(),
  EmailService.initEmailClient(),
  TokenService.initTokenService(),
])
  .then((_) => {
    const server = app.listen(process.env.PORT!, async () => {
      console.log("Server listening on port:", process.env.PORT!);
    });
    return server;
  })
  .then((httpServer) => {
    return SocketService.initSocket(httpServer);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });

process.on("SIGINT", () => process.exit(0));
process.on("SIGHUP", () => process.exit(0));
