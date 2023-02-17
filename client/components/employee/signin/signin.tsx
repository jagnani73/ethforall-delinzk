import type { Socket } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { io } from "socket.io-client";

import type { EmployeeSignupProps } from "@/utils/types/employee.types";
import { useAuth } from "@/utils/store/auth";
import { QRPage } from "@/components/shared";
import { EmpCheck } from "@/utils/services/api";

const EmployeeSignin: React.FC<EmployeeSignupProps> = ({ qr, sessionId }) => {
  const socket = useRef<Socket>();

  const { push } = useRouter();

  const { JWE, setJWE } = useAuth();

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
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (JWE) {
      (async () => {
        try {
          await EmpCheck(JWE);
          push("/employee/profile");
        } catch (error) {
          console.error(error);
        } finally {
        }
      })();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JWE]);

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
