import Record from "@/src/components/record";

const RecordPage = ({ params }) => {
  const { recordId } = params;

  return <Record recordId={recordId} />;
};

export default RecordPage;
