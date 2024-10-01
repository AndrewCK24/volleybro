import Record from "@/src/components/record";

const RecordPage = ({ params }: { params: { recordId: string } }) => {
  const { recordId } = params;

  return <Record recordId={recordId} />;
};

export default RecordPage;
