import { QRCode } from "react-qrcode-logo";

import type { QRPageProps } from "@/utils/types/shared.types";

const QRPage: React.FC<QRPageProps> = ({
  qr,
  description,
  heading,
  footer,
}) => {
  return (
    <div className="flex my-auto w-fit effect-shadow mx-auto">
      <main className="w-full max-w-3xl mx-auto py-6 px-12 bg-white">
        {heading && <h2 className="text-2xl font-semibold">{heading}</h2>}

        {description && (
          <p className="text-opacity-75 text-onyx my-4">{description}</p>
        )}

        <div className="bg-pale-purple w-fit p-4 mx-auto rounded">
          <QRCode
            value={qr}
            bgColor="#F8ECFF"
            // logoImage="/icon.png"
            // removeQrCodeBehindLogo
            fgColor="#7F56D9"
            qrStyle="dots"
            eyeRadius={[5, 5, 5]}
            size={400}
          />
        </div>

        {footer && <div>{footer}</div>}
      </main>
    </div>
  );
};

export default QRPage;
