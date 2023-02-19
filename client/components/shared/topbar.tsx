import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { Button } from ".";

const Topbar: React.FC = () => {
  const { asPath } = useRouter();

  const NAVIGATION = useMemo<{
    prompt?: string;
    routes: { href: string; content: string }[];
  }>(() => {
    switch (asPath) {
      case "/": {
        return {
          prompt: "Signin as",
          routes: [
            {
              content: "Employee",
              href: "/employee/signin",
            },
            {
              content: "Organization",
              href: "/organization/signin",
            },
          ],
        };
      }

      case "/employee/claim": {
        return {
          prompt: "Don't have an account yet?",
          routes: [
            {
              content: "Signup",
              href: "/employee/signup",
            },
          ],
        };
      }
      case "/employee/profile": {
        return {
          routes: [
            {
              content: "Add a PoE",
              href: "/employee/proof",
            },
            {
              content: "Logout",
              href: "/",
            },
          ],
        };
      }
      case "/employee/proof": {
        return {
          routes: [
            {
              content: "Profile",
              href: "/employee/profile",
            },
            {
              content: "Logout",
              href: "/",
            },
          ],
        };
      }
      case "/employee/signin": {
        return {
          routes: [
            {
              content: "Signup",
              href: "/employee/signup",
            },
          ],
        };
      }
      case "/employee/signup": {
        return {
          routes: [
            {
              content: "Signin",
              href: "/employee/signin",
            },
          ],
        };
      }

      case "/organization/claims": {
        return {
          routes: [
            {
              content: "Create Job",
              href: "/organization/jobs/create",
            },
          ],
        };
      }
      case "/organization/signin": {
        return {
          routes: [
            {
              content: "Signup",
              href: "/organization/signup",
            },
          ],
        };
      }
      case "/organization/signup": {
        return {
          routes: [
            {
              content: "Signin",
              href: "/organization/signin",
            },
          ],
        };
      }
      case "/organization/jobs/create": {
        return {
          routes: [
            {
              content: "Offer PoE",
              href: "/organization/claims",
            },
          ],
        };
      }

      default:
        return {
          routes: [],
        };
    }
  }, [asPath]);

  return (
    <aside className="h-24 bg-slate-blue px-28 flex items-center justify-between">
      <Link href="/">
        <figure>
          <Image src="/logo.png" alt="deLinZK logo" width={240} height={240} />
        </figure>
      </Link>

      <div className="flex items-center justify-center gap-x-8">
        {NAVIGATION.prompt && (
          <p className="font-bold text-lg text-white">{NAVIGATION.prompt}</p>
        )}

        {NAVIGATION.routes.map(({ content, href }) => (
          <Link key={href + content} href={href}>
            <Button primary={false} className="w-32">
              {content}
            </Button>
          </Link>
        ))}
      </div>
    </aside>
  );
};

export default Topbar;
