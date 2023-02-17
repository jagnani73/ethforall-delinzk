import type { Socket } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

import type { OrganizationSigninProps } from "@/utils/types/organization.types";
import { useAuth } from "@/utils/store/auth";
import { QRPage } from "@/components/shared";

const OrganizationSignin: React.FC<OrganizationSigninProps> = ({
  qr,
  sessionId,
}) => {
  const socket = useRef<Socket>();

  const { push } = useRouter();

  const { setJWE } = useAuth();

  useEffect(() => {
    socket.current = io(`wss://${process.env.API_BASE_URL}`, {
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

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <QRPage
      qr={qr}
      heading={
        <span className="text-center block">Signin as an Organization!</span>
      }
      description={
        <>Make sure you are verified as an Organization before signing in.</>
      }
    />
  );
};

export default OrganizationSignin;
