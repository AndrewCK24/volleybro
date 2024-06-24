import Record from "@/components/record";

const RecordPage = ({ params }) => {
  const { recordId } = params;
  
  return <Record recordId={recordId} className="w-full" />;
};

export default RecordPage;
