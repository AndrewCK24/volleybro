import { useEffect, useState, type ComponentType } from "react";
import { MockupFrame } from "./MockupFrame";

type DesignModule = { default: ComponentType };

const designModules = import.meta.glob<DesignModule>(
  "../../content/changes/*/design.tsx",
);

export function DesignMockupIsland({ slug }: { slug: string }) {
  const loadDesign = designModules[`../../content/changes/${slug}/design.tsx`];
  const [Mockup, setMockup] = useState<ComponentType>();
  const [error, setError] = useState<string>();

  useEffect(() => {
    let mounted = true;
    if (!loadDesign) {
      setError("找不到此 Change 的 design.tsx");
      return () => {
        mounted = false;
      };
    }

    void loadDesign()
      .then((module) => {
        if (mounted) setMockup(() => module.default);
      })
      .catch((cause: unknown) => {
        if (mounted)
          setError(cause instanceof Error ? cause.message : String(cause));
      });

    return () => {
      mounted = false;
    };
  }, [loadDesign]);

  if (error)
    return (
      <p data-blueprint-render-error="true" className="text-sm text-error-text">
        此設計稿在此 checkout 中無法顯示：{error}
      </p>
    );
  if (!Mockup)
    return <p className="text-sm text-muted-foreground">載入設計稿…</p>;

  return <MockupFrame Mockup={Mockup} />;
}
