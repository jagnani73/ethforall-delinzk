import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { Button } from ".";

const Topbar: React.FC = () => {
  const { asPath } = useRouter();

  return (
    <aside className="py-4 bg-slate-blue px-28 flex items-center justify-between">
      <Link href="/">
        <figure>
          <Image
            src="/logo.png"
            alt="deLinZK logo"
            width={240}
            height={240}
            className="bg-red-50"
          />
        </figure>
      </Link>

      {asPath === "/" && (
        <div className="flex items-center justify-center gap-x-8">
          <p className="font-bold text-lg text-white">Signin as</p>

          <Link href="/employee/signin">
            <Button primary={false} className="w-32">
              Employee
            </Button>
          </Link>

          <Link href="/organization/signin">
            <Button primary={false} className="w-32">
              Organization
            </Button>
          </Link>
        </div>
      )}
    </aside>
  );
};

export default Topbar;
