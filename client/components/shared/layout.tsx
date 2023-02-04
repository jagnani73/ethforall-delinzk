import type { LayoutProps } from "@/utils/types/shared.types";
import { Topbar } from "./";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="max-w-7xl flex flex-col mx-auto min-h-screen bg-gray-50 p-4">
      <Topbar />

      <main className="flex w-full h-full">{children}</main>
    </div>
  );
};

export default Layout;
