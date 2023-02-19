import type { LayoutProps } from "@/utils/types/shared.types";
import { Topbar } from "./";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col mx-auto min-h-screen h-full">
      <aside className="h-10 text-white font-bold bg-red-600 text-center px-28 flex items-center justify-center">
        ⚠️ Please note that this platform is not compatible with PolygonID
        mobile application version 2.0.
      </aside>

      <Topbar />

      <main className="flex w-full h-full">{children}</main>
    </div>
  );
};

export default Layout;
