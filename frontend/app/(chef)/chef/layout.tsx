import { ChefSidebar } from "@/components/chef/ChefSidebar";
import { ChefHeader } from "@/components/chef/ChefHeader";

export default function ChefLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#FBFBF3]">
      <ChefSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <ChefHeader />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 pb-20">
          {children}
        </main>
      </div>
    </div>
  );
}
