export const Benefits = () => {
  return (
    <section className="flex flex-col items-center justify-center w-full px-6 py-8 bg-background md:px-[5%]">
      <h2 className="my-6 text-4xl font-bold text-center text-foreground">
        核心優勢
      </h2>
      <ul className="flex flex-col items-center justify-center w-full gap-2">
        <BenefitCard description="現場即時記錄，無需賽後整理" />
        <BenefitCard description="自動化統計，降低人為錯誤" />
        <BenefitCard description="隨時隨地在行動裝置與電腦查看" />
        <BenefitCard description="由排球人參與開發，符合實際需求" />
      </ul>
    </section>
  );
};

const BenefitCard = ({ description }) => {
  return (
    <li className="flex flex-row items-start justify-start w-full gap-2 px-4 py-2 text-lg text-foreground md:w-[50%]">
      {description}
    </li>
  );
};
