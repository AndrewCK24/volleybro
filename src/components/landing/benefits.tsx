export const Benefits = () => {
  return (
    <section className="flex flex-col items-center justify-center w-full px-6 py-8 bg-foreground md:px-[5%]">
      <h2 className="my-6 text-4xl font-bold text-center text-primary-foreground">
        核心優勢
      </h2>
      <div className="flex flex-col items-center justify-center w-full gap-4">
        <BenefitCard title="即時" description="現場即時記錄，無需賽後整理" />
        <BenefitCard title="準確" description="自動化統計，降低人為錯誤" />
        <BenefitCard title="便利" description="隨時隨地在行動裝置與電腦查看" />
        <BenefitCard
          title="專業"
          description="由排球人參與開發，符合實際需求"
        />
      </div>
    </section>
  );
};

const BenefitCard = ({ title, description }) => {
  return (
    <div className="flex flex-row items-start justify-start w-full gap-2 px-4 py-2 md:w-[50%]">
      <h3 className="w-12 text-lg font-semibold text-primary-foreground">
        {title}
      </h3>
      <p className="text-lg text-primary-foreground">{description}</p>
    </div>
  );
};
