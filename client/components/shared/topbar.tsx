import Image from "next/image";
import Link from "next/link";

import { Button } from ".";

const Topbar: React.FC = () => {
  return (
    <aside className="py-4 bg-slate-blue px-28 flex items-center justify-between">
      <Link href="/">
        <figure>
          <Image
            src="/logo.png"
            alt="deLinZK logo"
            width={320}
            height={320}
            className="bg-red-50"
          />
        </figure>
      </Link>

      <div className="flex items-center justify-center gap-x-8">
        <p className="font-bold text-lg text-white">Signin as</p>

        <Button primary={false} className="w-32">
          Organization
        </Button>

        <Button primary={false} className="w-32">
          Employee
        </Button>
      </div>
    </aside>
  );
};

export default Topbar;
