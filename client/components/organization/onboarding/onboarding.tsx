import type { Socket } from "socket.io-client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { io } from "socket.io-client";

import type { OrganizationOnboardingProps } from "@/utils/types/organization.types";
import type { QRPageProps } from "@/utils/types/shared.types";
import { Button, QRPage } from "@/components/shared";

const OrganizationOnboarding: React.FC<OrganizationOnboardingProps> = ({
  linkQR,
}) => {
  const socket = useRef<Socket>();

  const [qr, setQr] = useState<string>(linkQR);
  const [phase, setPhase] = useState<0 | 1>(0);

  const {
    query: { reqId },
    replace,
  } = useRouter();

  useEffect(() => {
    if (reqId) {
      replace("/organization/onboarding", undefined, { shallow: true });

      socket.current = io(process.env.NEXT_PUBLIC_API_HOSTNAME!, {
        reconnectionDelayMax: 10000,
        extraHeaders: {
          "Bypass-Tunnel-Reminder": "true",
        },
        query: {
          "x-session-id": reqId,
        },
      });

      socket.current.on("org-claim", (data) => {
        setQr(data);
        setPhase(1);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reqId]);

  const QRState = useMemo<Partial<QRPageProps>[]>(
    () => [
      {
        heading: (
          <>
            <span className="text-slate-blue">1/2</span> Connect your Wallet
            Address to deLinZK!
          </>
        ),
        description: (
          <>
            Please scan the QR code below using the{" "}
            <span className="font-semibold text-slate-blue">
              Polygon ID application
            </span>{" "}
            to connect your wallet address to{" "}
            <span className="font-bold">deLinZK</span>.
          </>
        ),
        footer: (
          <p className="mt-4 text-center font-bold text-red-600">
            Make sure you select the wallet carefully. This wallet will be used
            to authenticate and operate on deLinZK
          </p>
        ),
      },
      {
        heading: (
          <>
            <span className="text-slate-blue">2/2</span> Claim your offer as a
            verified organization!
          </>
        ),
        description: (
          <>
            <span className="font-bold">
              <span className="text-slate-blue">WAGMI!</span> One last step
            </span>{" "}
            before you are finally onboarded! This is the claim that you will
            own. It is proof that your organization is verified with{" "}
            <span className="font-bold">deLinZK</span>.
          </>
        ),
        footer: (
          <>
            <p className="text-onyx text-opacity-75 text-center mt-8 text-sm font-medium">
              Once claimed, you are all done now! 🥳
            </p>

            <div className="flex justify-evenly mt-6">
              <Link href="/">
                <Button
                  primary={false}
                  className="border-2 border-slate-blue px-4 py-2 text-sm"
                >
                  Go Home
                </Button>
              </Link>
            </div>
          </>
        ),
      },
    ],
    []
  );

  return <QRPage qr={qr} {...QRState[phase]} />;
};

export default OrganizationOnboarding;
