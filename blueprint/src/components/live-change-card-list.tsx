import { ChangeCardList } from "@/components/change-card";
import { useChangeSummaries } from "@/lib/change-summary-client";

export function LiveChangeCardList({ limit }: { limit?: number }) {
  const { changes, failed } = useChangeSummaries(true);

  if (failed) {
    return <p role="alert">Change 暫時無法載入，請稍後再試。</p>;
  }
  if (!changes) {
    return <p role="status">載入已發布的 Change…</p>;
  }
  if (changes.length === 0) {
    return <p>目前沒有已發布的 Change。</p>;
  }

  return (
    <ChangeCardList
      changes={limit === undefined ? changes : changes.slice(0, limit)}
    />
  );
}
