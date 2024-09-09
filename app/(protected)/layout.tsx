import Navbar from "./_components/navbar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

const ProtectedLayout = ({ children }: ProtectedLayoutProps) => {
  return (
    <div className="w-full flex flex-col gap-y-10 items-center justify-center bg-sky-500">
      {/* h-full  */}
      <Navbar />
      {children}
    </div>
  );
};

export default ProtectedLayout;
