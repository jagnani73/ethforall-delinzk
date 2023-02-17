import type { Socket } from "socket.io-client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { io } from "socket.io-client";

import type { EmployeeClaimProps } from "@/utils/types/employee.types";
import type { QRPageProps } from "@/utils/types/shared.types";
import { Button, QRPage } from "@/components/shared";

const EmployeeClaim: React.FC<EmployeeClaimProps> = ({ linkQR }) => {
  const socket = useRef<Socket>();

  const [qr, setQr] = useState<string>(linkQR);
  const [phase, setPhase] = useState<0 | 1>(0);

  const {
    query: { reqId },
    replace,
  } = useRouter();

  useEffect(() => {
    if (reqId) {
      replace("/employee/claim", undefined, { shallow: true });

      socket.current = io(`wss://${process.env.API_BASE_URL}`, {
        reconnectionDelayMax: 10000,
        extraHeaders: {
          "Bypass-Tunnel-Reminder": "true",
        },
        query: {
          "x-session-id": reqId,
        },
      });

      socket.current.on("user-claim", (data) => {
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
            <span className="text-slate-blue">1/2</span> Authorize your Wallet
            Address to deLinZK!
          </>
        ),
        description: (
          <>
            Please scan the QR code below using the{" "}
            <span className="font-semibold text-slate-blue">
              Polygon ID application
            </span>{" "}
            only, to connect your wallet address to deLinZK.
          </>
        ),
      },
      {
        heading: (
          <>
            <span className="text-slate-blue">2/2</span> Claim your Proof of
            Employment!
          </>
        ),
        description: <>This will store the your claim.</>,
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

              <Link href="/employee/signin">
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

export default EmployeeClaim;
