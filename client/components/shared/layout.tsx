import type { LayoutProps } from "@/utils/types/shared.types";
import { Topbar } from "./";

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col mx-auto min-h-screen h-full">
      <Topbar />

      <main className="flex w-full h-full">{children}</main>
    </div>
  );
};

export default Layout;
