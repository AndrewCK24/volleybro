/** @jest-environment node */

import { sanitizeLegacyHtml } from "./sanitize-legacy-html";

describe("sanitizeLegacyHtml", () => {
  it("keeps historical anchors and prose while removing scripts and event handlers", () => {
    const html = sanitizeLegacyHtml(
      '<section id="review-s1"><h2>Review</h2><script>steal()</script><a href="javascript:steal()" onclick="steal()">details</a></section>',
    );

    expect(html).toContain('id="review-s1"');
    expect(html).toContain("Review");
    expect(html).toContain("details");
    expect(html).not.toContain("steal()");
    expect(html).not.toContain("onclick");
    expect(html).not.toContain("javascript:");
  });
});
