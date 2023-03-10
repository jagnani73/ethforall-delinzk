/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { useMemo, useState } from "react";

import { Button } from "@/components/shared";

const Home: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<
    "employee" | "organization" | null
  >(null);

  const ROLES = useMemo<
    {
      content: React.ReactNode;
      role: "employee" | "organization";
    }[]
  >(
    () => [
      {
        content: "an employee",
        role: "employee",
      },
      {
        content: "an organization",
        role: "organization",
      },
    ],
    []
  );

  return (
    <section className="relative w-full">
      <div className="flex w-9/12 mx-auto h-full items-center">
        <div className="w-full flex flex-col h-full p-8 justify-center">
          <h1 className="group text-6xl flex flex-col h-40 whitespace-nowrap font-bold">
            <span className="bg-white effect-shadow w-fit p-2 group-hover:effect-shadow-hover z-10 group-hover:z-0 border-2 border-b-0 rounded-b-none border-slate-blue rounded-lg">
              <span className="z-10 group-hover:z-0 group-hover:text-slate-blue transition-all">
                BUIDL
              </span>
              ing a
            </span>
            <span className="bg-white effect-shadow w-fit p-2 group-hover:effect-shadow-hover z-0 group-hover:z-10 border-2 border-t-0 rounded-tl-none border-slate-blue rounded-lg">
              <span className="z-0 group-hover:z-10 group-hover:text-slate-blue transition-all">
                V
              </span>
              in
              <span className="z-0 group-hover:z-10 group-hover:text-slate-blue transition-all">
                Cred
              </span>
              ible Network
            </span>
          </h1>

          <h2 className="text-2xl font-medium my-12">
            Experience{" "}
            <span className="text-slate-blue font-semibold underline">
              trusted networking
            </span>{" "}
            on Polygon ID
          </h2>

          <div className="text-center flex flex-col w-96 p-4 border-dashed border-2 rounded-lg border-slate-blue">
            <p className="mr-auto text-xl text-opacity-75 text-onyx font-light">
              Select an option to get started
            </p>

            <p className="text-4xl mr-auto font-medium mt-4 mb-6">are you?</p>

            <div className="flex flex-col gap-y-2">
              {ROLES.map(({ content, role }) => (
                <Button
                  key={role}
                  primary={false}
                  className={`w-full text-left border-2 transition-all ${
                    role === selectedRole
                      ? " border-slate-blue"
                      : "border-white"
                  }`}
                  onClick={() => setSelectedRole(role)}
                >
                  {content}
                </Button>
              ))}
            </div>

            <Link href={selectedRole ? `/${selectedRole}/signup` : "#"}>
              <Button primary={true} className="w-full text-xl mt-6 px-6">
                Get started today
              </Button>
            </Link>
          </div>
        </div>

        <div className="w-full flex flex-col items-center justify-center h-full">
          <figure className="w-10/12 ml-auto flex items-end justify-center">
            <img
              src="/home/hero.svg"
              alt="deLinZK home hero"
              className="w-full flex"
            />
          </figure>
        </div>
      </div>

      <p className="text-right text-lg absolute right-0 bottom-0 pb-4 pr-6">
        <Link href="/admin">
          Signin as an{" "}
          <span className="text-slate-blue font-semibold">Admin</span>
        </Link>
      </p>
    </section>
  );
};

export default Home;
