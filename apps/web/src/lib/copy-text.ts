/**
 * Copies text to the clipboard. Returns whether it worked, since browsers can refuse: the async
 * clipboard API needs a secure page and permission, so fall back to the older selection method.
 */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fall through to the legacy path.
  }

  const previouslyFocused = document.activeElement as HTMLElement | null;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.append(textarea);
  textarea.select();

  try {
    return document.execCommand("copy");
  } catch {
    return false;
  } finally {
    textarea.remove();
    // Selecting the textarea moved focus; put it back where the person was.
    previouslyFocused?.focus();
  }
}
