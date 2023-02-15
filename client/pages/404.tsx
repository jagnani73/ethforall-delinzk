import type { NextPage } from "next";
import Link from "next/link";

import { Message } from "@/components/shared";

const NotFound: NextPage = () => {
  return (
    <Message>
      <div className="text-center p-6">
        <h1 className="text-5xl font-bold">4 · O · 4</h1>
        <h3 className="my-8 text-lg">
          Looks like you are living the nomad life
        </h3>

        <Link href="/" className="font-semibold text-2xl">
          here is a <span className="text-slate-blue underline">Home</span>
        </Link>
      </div>
    </Message>
  );
};

export default NotFound;
