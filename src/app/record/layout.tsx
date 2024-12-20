const RecordLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex flex-col items-center justify-center w-full h-full overflow-hidden pt-[calc(env(safe-area-inset-top)+5.5rem)]">
      <div className="flex flex-col items-center justify-start h-full w-full gap-2 max-w-[640px]">
        {children}
      </div>
    </main>
  );
};

export default RecordLayout;
