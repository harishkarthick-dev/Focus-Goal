export interface ShareContent {
  title?: string;
  text?: string;
  url?: string;
}

export async function shareContent(data: ShareContent): Promise<'shared' | 'copied' | 'failed'> {
  try {
    if (typeof navigator !== 'undefined' && navigator.share) {
      await navigator.share(data);
      return 'shared';
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      const textToCopy =
        `${data.title ? data.title + '\n' : ''}${data.text || ''} ${data.url || ''}`.trim();
      await navigator.clipboard.writeText(textToCopy);
      return 'copied';
    }
  } catch (error) {
    console.error('Share failed:', error);
    return 'failed';
  }
  return 'failed';
}
