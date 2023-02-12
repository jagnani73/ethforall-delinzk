import * as jose from "jose";
class TokenService {
  private static privateKey: jose.KeyLike | null = null;
  private static publicKey: jose.KeyLike | null = null;
  private static jwsSecret: Uint8Array | null = null;
  private constructor() {}
  public static async initTokenService() {
    this.publicKey = await jose.importPKCS8(
      process.env.JWE_PRIVATEKEY!,
      "RS256"
    );
    this.privateKey = await jose.importSPKI(
      process.env.JWE_PUBLICKEY!,
      "RS256"
    );
    this.jwsSecret = new TextEncoder().encode(process.env.JWS_SECRET);
    console.log("TokenService initiated successfully!");
  }
  public static async createJWS(
    payload: Record<string, any>,
    expiration: string
  ) {
    const jws = await new jose.SignJWT(payload)
      .setProtectedHeader({
        alg: "HS256",
      })
      .setIssuedAt()
      .setIssuer("deLinZK")
      .setExpirationTime(expiration)
      .sign(this.jwsSecret!);
    return jws;
  }
  public static async createJWE(payload: string) {
    const jwe = await new jose.CompactEncrypt(new TextEncoder().encode(payload))
      .setProtectedHeader({ alg: "RSA-OAEP-256", enc: "A256GCM" })
      .encrypt(this.publicKey!);
    return jwe;
  }
  public static async decryptJWE(jwe: string) {
    const { plaintext } = await jose.compactDecrypt(jwe, this.privateKey!);
    const decodedPayload = new TextDecoder().decode(plaintext);
    return decodedPayload;
  }
  public static async verifyJWS(jwt: string) {
    const { payload } = await jose.jwtVerify(jwt, this.jwsSecret!, {
      issuer: "deLinZK",
    });
    return payload;
  }
}

export default TokenService;
