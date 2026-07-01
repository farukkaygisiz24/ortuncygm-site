// Classifies the flat Tebliğ paragraph list into typed items so the page can
// give it real visual hierarchy (chapter / article / body) without touching
// a single word of the legal text itself.

export type MevzuatItem = {
  text: string;
  isChapter: boolean;
  isArticleNumber: boolean;
  isArticleTitle: boolean;
  isChapterSubtitle: boolean;
  isPara: boolean;
  isListItem: boolean;
};

const ARTICLE_RE = /^(MADDE(\s\d+)?|GE[Cç][İI]C[İI]\s+MADDE(\s+\d+)?)$/i;

export function classifyMevzuat(paragraphs: string[]): MevzuatItem[] {
  return paragraphs.map((text, i) => {
    const next = paragraphs[i + 1] || "";
    const prev = i > 0 ? paragraphs[i - 1] : "";
    const isChapter = /BÖLÜM$/.test(text);
    const isArticleNumber = ARTICLE_RE.test(text.trim());
    const isArticleTitle = !isChapter && !isArticleNumber && ARTICLE_RE.test(next.trim());
    const isChapterSubtitle = !isChapter && !isArticleNumber && !isArticleTitle && /BÖLÜM$/.test(prev);
    const isListItem = /^[a-zçğıöşü0-9ığ]{1,3}\)/i.test(text.trim());
    const isPara = !isChapter && !isArticleNumber && !isArticleTitle && !isChapterSubtitle;
    return { text, isChapter, isArticleNumber, isArticleTitle, isChapterSubtitle, isPara, isListItem };
  });
}
