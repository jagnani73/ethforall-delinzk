import axios from "axios";
import CacheService from "../services/cache.service";
import SocketService from "../services/socket.service";
import { checkClaimStatus } from "../org/org.service";

export const checkIfClaimOfferExists = async (
  reqId: string
): Promise<{ available: boolean; claimOfferId?: string }> => {
  const cache = await CacheService.getCache();
  const claimOfferId = await cache?.get(`delinzk:claim-pending:${reqId}`);
  if (claimOfferId) {
    return {
      available: true,
      claimOfferId: claimOfferId,
    };
  } else {
    return {
      available: false,
    };
  }
};

export const listenForClaimAuthComplete = async (
  reqId: string,
  claimOfferId: string,
  claimOfferSessionId: string
) => {
  const socket = await SocketService.getSocket();
  const cache = await CacheService.getCache();
  Promise.all([checkClaimStatus(claimOfferId, claimOfferSessionId)]).then(
    async (qrCodeData) => {
      socket.to(reqId).emit("user-claim", JSON.stringify(qrCodeData[0]));
      await cache?.DEL(`delinzk:claim-pending:${reqId}`);
    }
  );
};
