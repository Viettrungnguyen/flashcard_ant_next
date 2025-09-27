import Link from "@tiptap/extension-link";

type SharedLinkType = ReturnType<typeof Link.configure>;

type GlobalWithTiptap = typeof globalThis & {
  __TIPTAP_SHARED_LINK?: SharedLinkType;
};

// Lazily create and store a singleton Link extension on globalThis to
// ensure a single instance is reused across all editors at runtime.
export function getSharedLinkExtension(): SharedLinkType {
  const g = globalThis as GlobalWithTiptap;
  if (!g.__TIPTAP_SHARED_LINK) {
    g.__TIPTAP_SHARED_LINK = Link.configure({ openOnClick: false });
  }
  return g.__TIPTAP_SHARED_LINK as SharedLinkType;
}
