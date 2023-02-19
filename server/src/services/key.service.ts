import * as jssha from "jssha";
class KeyServices {
  public static createPoeHashKey(tenure: number, orgId: number) {
    const hash = new jssha.default("SHAKE128", "TEXT");
    hash.update(`${tenure}${orgId}`);
    const hashHex = hash.getHash("HEX", { outputLen: 48 });
    const decimalHash = parseInt(hashHex, 16);
    return decimalHash;
  }
}

export default KeyServices;
