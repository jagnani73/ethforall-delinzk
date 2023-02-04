/* eslint-disable @next/next/no-img-element */

import Link from "next/link";
import { Button } from "@/components/shared";

const Home: React.FC = () => {
  return (
    <section className="flex w-full h-full items-center">
      <div className="w-full flex flex-col h-full p-8">
        <h1 className="text-6xl font-extralight leading-normal">
          Experience
          <br />
          trusted networking
          <br />
          on Polygon ID
        </h1>

        <div className="text-center flex flex-col gap-y-6 w-96 mt-20">
          <Link href="/admin" className="block">
            <Button className="w-full">Admin</Button>
          </Link>

          <div className="flex w-full gap-x-6">
            <Link href="/organizations/signup" className="block w-full">
              <Button className="w-full">
                Organization
                <br />
                Signup
              </Button>
            </Link>

            <Link href="/organizations/signin" className="block w-full">
              <Button className="w-full">
                Organization
                <br />
                Signin
              </Button>
            </Link>
          </div>

          <Link href="/employee" className="block">
            <Button className="w-full">Employee</Button>
          </Link>
        </div>
      </div>

      <div className="w-full flex flex-col items-center justify-evenly h-full">
        <figure className="w-full flex items-center justify-center">
          <img
            src="/home/hero.png"
            alt="deLinZK home hero"
            className="w-full flex"
          />
        </figure>

        <p className="text-2xl text-right my-12">
          Commodo sunt commodo nulla do veniam laborum occaecat.
        </p>
      </div>
    </section>
  );
};

export default Home;
