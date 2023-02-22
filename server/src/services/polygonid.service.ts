import Axios, { AxiosInstance } from "axios";
class PolygonIDService {
  private static apiInstance: AxiosInstance;
  private static issuerDid: string;
  public static async initService() {
    try {
      if (
        process.env.POLYGONID_BASEURL &&
        process.env.POLYGONID_AUTH_USERNAME &&
        process.env.POLYGONID_AUTH_PASSWORD &&
        process.env.POLYGONID_ISSUER_DID
      ) {
        this.issuerDid = process.env.POLYGONID_ISSUER_DID;
        this.apiInstance = Axios.create({
          baseURL:
            `${process.env.POLYGONID_BASEURL}/v1/${process.env.POLYGONID_ISSUER_DID}`!,
          auth: {
            username: process.env.POLYGONID_AUTH_USERNAME!,
            password: process.env.POLYGONID_AUTH_PASSWORD!,
          },
        });
        const { data } = await this.apiInstance.post(`/state/publish`);
        console.log(
          "Polygon ID Service initiated! Issuer identity publish state results:"
        );
        console.log(JSON.stringify(data));
      } else {
        console.error(
          "Variables not set! Please set the following environmental variables: POLYGONID_BASEURL, POLYGONID_AUTH_USERNAME, POLYGONID_AUTH_PASSWORD, POLYGONID_ISSUER_DID"
        );
        process.exit(1);
      }
    } catch (err) {
      console.error("PolygonIDService not initialized:", err);
      process.exit(1);
    }
  }
  public static async getService() {
    if (!this.apiInstance) {
      await this.initService();
    }
    return this.apiInstance;
  }
  public static async getIssuerDID() {
    if (!this.issuerDid) {
      await this.initService();
    }
    return this.issuerDid;
  }
  public static async createVerifiedOrgClaim(orgDid: string) {
    try {
      const { data } = await this.apiInstance.post("/claims", {
        credentialSchema: process.env.POLYGONID_CLAIMSCHEMA_VERIFIED_ORG!,
        type: "ProofOfdeLinZKVerifiedOrganization",
        credentialSubject: {
          id: orgDid,
          isdeLinZKVerified: 1,
        },
      });
      const claimId = data.id;
      const { data: qrData } = await this.apiInstance.get(
        `/claims/${claimId}/qrcode`
      );
      return qrData;
    } catch (err) {
      console.error("Error in creating verified organization claim!");
      console.error(err);
      throw {
        errorCode: 500,
        name: "Polygon ID Error",
        message: "Error in creating verified organization claim!",
        polygonIdError: err,
      };
    }
  }
}

export default PolygonIDService;
