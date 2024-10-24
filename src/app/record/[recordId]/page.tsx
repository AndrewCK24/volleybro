import Record from "@/components/record";

const RecordPage = async (props: { params: Promise<{ recordId: string }> }) => {
  const params = await props.params;
  const { recordId } = params;

  return <Record recordId={recordId} />;
};

export default RecordPage;
