const RecordLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col items-center justify-start h-full gap-2 overflow-hidden overscroll-y-none bg-accent">
      <div className="h-full flex flex-col items-center justify-start flex-1 w-full gap-2 md:px-[5%] max-w-[640px]">
        {children}
      </div>
    </main>
  );
};

export default RecordLayout;
