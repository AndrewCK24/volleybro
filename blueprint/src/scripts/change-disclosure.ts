function openDetailsForHashTarget(root: Document, hash: string) {
  if (!hash.startsWith("#")) return;
  let id: string;
  try {
    id = decodeURIComponent(hash.slice(1));
  } catch {
    return;
  }
  const target = root.getElementById(id);
  if (!target) return;

  let parent: Element | null = target;
  while (parent) {
    if (parent instanceof HTMLDetailsElement) parent.open = true;
    parent = parent.parentElement;
  }
}

function initializeChangeDisclosure() {
  const openCurrentTarget = () =>
    openDetailsForHashTarget(document, window.location.hash);

  openCurrentTarget();
  window.addEventListener("hashchange", openCurrentTarget);
  document.addEventListener("astro:page-load", openCurrentTarget);
}

initializeChangeDisclosure();
