import Image from "next/image";
import Link from "next/link";

const Topbar: React.FC = () => {
  return (
    <aside className="py-4">
      <Link href="/">
        <figure>
          <Image src="/logo.png" alt="deLinZK logo" width={320} height={320} />
        </figure>
      </Link>
    </aside>
  );
};

export default Topbar;
