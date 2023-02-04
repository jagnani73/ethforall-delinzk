import localtunnel, { Tunnel } from "localtunnel";
class TunnelService {
  private static tunnel: Tunnel | null = null;
  private constructor() {}
  public static async initTunnel() {
    TunnelService.tunnel = await localtunnel(+process.env.PORT!, {
      subdomain: process.env.SUBDOMAIN!,
    });
    console.log("Localtunnel opened on link:", TunnelService.tunnel.url);
    process.on("SIGINT", () => TunnelService.tunnel!.close());
    process.on("SIGHUP", () => TunnelService.tunnel!.close());
  }
  public static async getTunnel() {
    if (this.tunnel) {
      return this.tunnel;
    } else {
      await this.initTunnel();
      return this.tunnel;
    }
  }
}

export default TunnelService;
