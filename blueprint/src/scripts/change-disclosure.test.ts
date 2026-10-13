import "./change-disclosure";

describe("migrated Change disclosure hash navigation", () => {
  afterEach(() => {
    document.body.replaceChildren();
    history.replaceState(null, "", window.location.pathname);
  });

  it("opens every historical disclosure containing the hash target", () => {
    document.body.innerHTML = `
      <details id="review">
        <summary>Review</summary>
        <div>
          <details id="review-s1">
            <summary>Shard 1</summary>
            <h3 id="review-section">Accepted decisions</h3>
          </details>
        </div>
      </details>
    `;

    history.replaceState(
      null,
      "",
      `${window.location.pathname}#review-section`,
    );
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    expect(document.getElementById("review")?.closest("details")?.open).toBe(
      true,
    );
    expect(document.getElementById("review-s1")?.closest("details")?.open).toBe(
      true,
    );

    document.getElementById("review")?.removeAttribute("open");
    history.replaceState(null, "", `${window.location.pathname}#review`);
    window.dispatchEvent(new HashChangeEvent("hashchange"));

    expect(document.getElementById("review")?.closest("details")?.open).toBe(
      true,
    );
  });
});
