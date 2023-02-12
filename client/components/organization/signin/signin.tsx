import type { Socket } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

import type { OrganizationSigninProps } from "@/utils/types/organization.types";
import { useAuth } from "@/utils/store/auth";
import { QRPage } from "@/components/shared";

const OrganizationSignin: React.FC<OrganizationSigninProps> = ({ qr }) => {
  const socket = useRef<Socket>();

  const { push } = useRouter();

  const { sessionId, setJWE } = useAuth();

  useEffect(() => {
    if (qr && sessionId) {
      socket.current = io(`ws://delinzk.loca.lt`, {
        reconnectionDelayMax: 10000,
        extraHeaders: {
          "Bypass-Tunnel-Reminder": "true",
        },
        query: {
          "x-session-id": sessionId,
        },
      });

      socket.current.on("auth", (jwe) => {
        setJWE(jwe);
        push("/organization/claims");
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qr, sessionId]);

  return (
    <QRPage
      qr={qr}
      heading={
        <span className="text-center block mb-8">
          Signin as an Organization!
        </span>
      }
    />
  );
};

export default OrganizationSignin;
