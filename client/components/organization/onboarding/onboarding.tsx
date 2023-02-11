import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { useEffect, useRef } from "react";
import QRCode from "react-qr-code";

import type { OrganizationOnboardingProps } from "@/utils/types/organization.types";
import { useRouter } from "next/router";

const OrganizationOnboarding: React.FC<OrganizationOnboardingProps> = ({
  qr,
}) => {
  const socket = useRef<Socket>();

  const {
    query: { reqId },
    push,
    replace,
  } = useRouter();

  useEffect(() => {
    if (reqId) {
      replace("/organization/onboarding", undefined, { shallow: true });

      socket.current = io(`ws://delinzk.loca.lt`, {
        reconnectionDelayMax: 10000,
        extraHeaders: {
          "Bypass-Tunnel-Reminder": "true",
        },
        query: {
          "x-session-id": reqId,
        },
      });

      socket.current.on("auth", () => {
        push("/organization/signin?onboarding=true");
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reqId]);

  return (
    <main className="w-full mt-20">
      <div className="bg-gray-100 flex flex-col justify-center items-center rounded-lg py-8 px-12 mx-auto w-fit">
        <h3 className="font-medium text-4xl text-center mb-8">
          Scan the QR Code
        </h3>

        <QRCode
          value={JSON.stringify(qr)}
          bgColor="white"
          className="mx-auto"
          fgColor="#7F56D9"
        />

        <p className="text-lg text-center mt-8">
          This is the final step for onboarding you to deLinkZK!
        </p>
      </div>
    </main>
  );
};

export default OrganizationOnboarding;
