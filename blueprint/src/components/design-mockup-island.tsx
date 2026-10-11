import { useEffect, useState, type ComponentType } from "react";
import { MockupFrame } from "./MockupFrame";

type DesignModule = { default: ComponentType };

const designModules = import.meta.glob<DesignModule>(
  "../../content/changes/*/design.tsx",
);

export function DesignMockupIsland({ slug }: { slug: string }) {
  const loadDesign = designModules[`../../content/changes/${slug}/design.tsx`];
  const [result, setResult] = useState<{
    slug: string;
    Mockup?: ComponentType;
    error?: string;
  }>();

  useEffect(() => {
    let isActive = true;
    if (!loadDesign) return;

    void loadDesign()
      .then((module) => {
        if (isActive) setResult({ slug, Mockup: module.default });
      })
      .catch((cause: unknown) => {
        if (isActive)
          setResult({
            slug,
            error: cause instanceof Error ? cause.message : String(cause),
          });
      });

    return () => {
      isActive = false;
    };
  }, [loadDesign, slug]);

  if (!loadDesign || result?.error)
    return (
      <p data-blueprint-render-error="true" className="text-sm text-error-text">
        此設計稿在此 checkout 中無法顯示：
        {!loadDesign ? "找不到此 Change 的 design.tsx" : result?.error}
      </p>
    );
  if (result?.slug !== slug || !result.Mockup)
    return <p className="text-sm text-muted-foreground">載入設計稿…</p>;

  return <MockupFrame Mockup={result.Mockup} />;
}
