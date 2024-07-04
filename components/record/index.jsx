"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { recordActions } from "@/app/store/record-slice";
import { useRecord } from "@/hooks/use-data";
import Header from "@/components/record/header";
import RecordCourt from "@/components/record/court";
import RecordPanels from "@/components/record/panels";
import LoadingCourt from "@/components/custom/loading/court";
import LoadingCard from "@/components/custom/loading/card";

const Record = ({ recordId }) => {
  const dispatch = useDispatch();
  const { record, isLoading, error } = useRecord(recordId);

  useEffect(() => {
    if (record) dispatch(recordActions.initialize(record));
  }, [record, dispatch]);

  if (error) throw new Error(error);
  if (isLoading) {
    return (
      <>
        <Header />
        <LoadingCourt />
        <LoadingCard className="flex-1 w-full pb-4" />
      </>
    );
  }

  return (
    <>
      <Header recordId={recordId} />
      <RecordCourt />
      <RecordPanels recordId={recordId} />
    </>
  );
};

export default Record;
