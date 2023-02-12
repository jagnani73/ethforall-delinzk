import type { Socket } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

import type { EmployeeSignupProps } from "@/utils/types/employee.types";
import { useAuth } from "@/utils/store/auth";
import { QRPage } from "@/components/shared";

const EmployeeSignin: React.FC<EmployeeSignupProps> = ({ qr, sessionId }) => {
  const socket = useRef<Socket>();

  const { push } = useRouter();

  const { setJWE } = useAuth();

  useEffect(() => {
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
      push("/employee/profile");
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <QRPage
      qr={qr}
      heading={
        <span className="text-center block mb-8">Signin as an Employee!</span>
      }
    />
  );
};

export default EmployeeSignin;
