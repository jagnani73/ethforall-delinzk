import type { Socket } from "socket.io-client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import QRCode from "react-qr-code";
import { io } from "socket.io-client";

import { OrgSignin } from "@/utils/services/api";
import { useAuth } from "@/utils/store/auth";
import { Button } from "@/components/shared";

const OrganizationsSignin: React.FC = () => {
  const [QRData, setQRData] = useState<string | null>(null);

  const socket = useRef<Socket>();

  const {
    query: { onboarding },
    replace,
  } = useRouter();

  const { sessionId, setSessionId, setIdentifier } = useAuth();

  useEffect(() => {
    if (onboarding)
      replace("/organizations/signin", undefined, { shallow: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onboarding]);

  useEffect(() => {
    if (QRData && sessionId) {
      socket.current = io(`ws://delinzk.loca.lt`, {
        reconnectionDelayMax: 10000,
        extraHeaders: {
          "Bypass-Tunnel-Reminder": "true",
        },
        query: {
          "x-session-id": sessionId,
        },
      });

      socket.current.on("auth", (_identifier) => {
        alert("proof generated and verified");
        setIdentifier(_identifier);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QRData, sessionId]);

  const signinHandler = useCallback(async () => {
    try {
      const { qr, sessionId } = await OrgSignin();
      setSessionId(sessionId);
      setQRData(JSON.stringify(qr));
    } catch (error) {
      console.error(error);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="w-full mt-20">
      <div className="bg-gray-100 flex flex-col justify-center items-center rounded-lg py-8 px-12 mx-auto w-fit">
        {!QRData ? (
          <>
            <h3 className="font-medium text-4xl text-center mb-8">
              Signin as an Organization
            </h3>

            <Button primary onClick={signinHandler} className="w-32">
              Sign In
            </Button>

            {onboarding && (
              <p className="text-lg text-center mt-8">
                You have successfully signed up as an Organization, now login to
                create claims
              </p>
            )}
          </>
        ) : (
          <div>
            <h3 className="font-medium text-4xl text-center mb-8">
              Scan the QR Code
            </h3>

            <QRCode
              value={QRData}
              bgColor="white"
              className="mx-auto"
              fgColor="#7F56D9"
            />

            <p className="text-lg text-center mt-8">
              or alternatively click{" "}
              <a
                href={`iden3comm://?i_m=${btoa(QRData)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline font-medium"
              >
                here
              </a>
              .
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default OrganizationsSignin;
