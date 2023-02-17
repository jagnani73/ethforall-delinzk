import localtunnel, { Tunnel } from "localtunnel";
class TunnelService {
  private static tunnel: Tunnel | null = null;
  private constructor() {}
  public static async initTunnel() {
    if (process.env.NODE_ENV !== "production") {
      TunnelService.tunnel = await localtunnel(+process.env.PORT!, {
        subdomain: process.env.LOCALTUNNEL_SUBDOMAIN!,
      });
      console.log("Localtunnel opened on link:", TunnelService.tunnel.url);
      process.on("SIGINT", () => TunnelService.tunnel!.close());
      process.on("SIGHUP", () => TunnelService.tunnel!.close());
    } else {
      this.tunnel = {
        url: process.env.SUBDOMAIN_BE ?? "",
      } as Tunnel;
      console.log("Production code, using domain name:", this.tunnel.url);
    }
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
