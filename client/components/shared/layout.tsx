import type { LayoutProps } from "@/utils/types/shared.types";
import { Topbar } from "./";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col mx-auto min-h-screen h-full">
      <aside className="h-10 text-white font-bold bg-red-600 text-center px-28 flex items-center justify-center">
        ⚠️ DISCLAIMER: The web application is compatible with PolygonID mobile
        app v1.0.3
      </aside>

      <Topbar />

      <main className="flex w-full h-full">{children}</main>
    </div>
  );
};

export default Layout;
