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

  const [qr, setQr] = useState<string>(JSON.stringify(linkQR));
  const [phase, setPhase] = useState<0 | 1 | 2>(2);

  const {
    query: { reqId },
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

      socket.current.on("org-auth", (data) => {
        setQr(data);
        setPhase(1);
      });

      socket.current.on("org-claim", (data) => {
        setQr(data);
        setPhase(2);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reqId]);

  const QRState = useMemo<Partial<QRPageProps>[]>(
    () => [
      {
        heading: (
          <>
            <span className="text-slate-blue">1/3</span> Connect your Wallet
            Address to deLinZK!
          </>
        ),
        description: (
          <>
            Please scan the QR code below using the{" "}
            <span className="font-semibold text-slate-blue">
              Polygon ID application
            </span>{" "}
            only to connect your wallet address to deLinZK.
          </>
        ),
      },
      {
        heading: (
          <>
            <span className="text-slate-blue">2/3</span> Authenticate your
            wallet address with deLinZK!
          </>
        ),
        description: (
          <>
            Once connected, we need to Authenticate your wallet address to
            generate a verified claim.
          </>
        ),
      },
      {
        heading: (
          <>
            <span className="text-slate-blue">3/3</span> Claim your offer for a
            verified organization!
          </>
        ),
        description: (
          <>
            One last step before you are finally onboarded! This is the claim
            that you will own. It states that your organization is verified on
            deLinZK.
          </>
        ),
        footer: (
          <>
            <p className="text-onyx text-opacity-75 text-center mt-8 text-sm">
              You are all done now!
            </p>

            <div className="flex justify-evenly mt-6">
              <Link href="/">
                <Button
                  primary={false}
                  className="border-2 border-slate-blue px-8"
                >
                  Go home
                </Button>
              </Link>

              <Link href="/organization/signin">
                <Button
                  primary={true}
                  className="border-2 border-slate-blue px-12"
                >
                  Signin
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
