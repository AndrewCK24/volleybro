const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="w-full h-full flex flex-col justify-end items-center gap-0 p-0 overflow-hidden overscroll-y-none bg-primary px-[5%]">
      {children}
    </main>
  );
};

export default AuthLayout;
