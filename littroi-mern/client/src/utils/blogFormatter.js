/**
 * Smart Blog Content Formatter & Parser
 * Converts plain text, markdown, or messy copied drafts into clean, semantic HTML
 * with proper <h2>, <h3>, <ul>, <ol>, <blockquote>, and <p> tags.
 */

export function autoFormatTextToHtml(input) {
  if (!input || typeof input !== "string") return "";

  let text = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n").trim();
  if (!text) return "";

  // If text is already well-structured semantic HTML (has <h2> or <h3>, plus paragraphs/lists),
  // return as-is without stripping.
  const hasSemanticHeadings = /<h[1-6][\s>]/i.test(text);
  const hasMultipleHtmlTags = (text.match(/<\/(?:p|h[1-6]|ul|ol|blockquote|div)>/gi) || []).length >= 3;
  if (hasSemanticHeadings && hasMultipleHtmlTags) {
    return text;
  }

  // Strip non-semantic or basic <p>/<div> wrapper tags from pasted text to rebuild cleanly
  if (/<[a-z][\s\S]*>/i.test(text)) {
    text = text
      .replace(/<!--[\s\S]*?-->/g, "")
      .replace(/<\/?(div|p|h[1-6]|li|blockquote|section|article)[^>]*>/gi, "\n")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/&nbsp;/gi, " ");
  }

  // Pre-process arrow workflow chains: e.g. "Write \n ↓ \n Format \n ↓ \n Add Images \n ..."
  text = text.replace(/(?:^[^\n]+\n\s*(?:↓|→|->|-->)\s*\n)+[^\n]+/gm, (match) => {
    const rawSteps = match
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s && !/^(?:↓|→|->|-->)$/.test(s));
    return `\n\n__WORKFLOW_CHAIN__:${JSON.stringify(rawSteps)}\n\n`;
  });

  const rawLines = text.split("\n");
  const lines = [];

  for (let l of rawLines) {
    const trimmed = l.trim();
    if (trimmed) {
      lines.push(trimmed);
    } else {
      lines.push("");
    }
  }

  const blocks = [];
  let i = 0;

  function isNumberedHeading(line) {
    // Matches "1. Start With a Clear Blog Title", "7. Preview Before Publishing", "12. Conclusion"
    return /^\d+[.)]\s+[A-Z0-9].{3,95}$/.test(line) && !line.endsWith(".");
  }

  function isQuestionHeading(line) {
    // Matches "What Is a Blog Editor?", "Why Choose Us?", "How to Do Keyword Research?"
    return /^(What|Why|How|When|Where|Who|Which|Is|Are|Can|Do|Does|Should)\b.{3,80}\?$/i.test(line);
  }

  function isNamedHeading(line) {
    return /^(Introduction|Overview|Conclusion|Summary|Final Thoughts|Key Takeaways|Next Steps|Best Practices|Pro Tip|Bonus Tip)$/i.test(line);
  }

  function isMarkdownHeading(line) {
    return /^#{1,4}\s+.+$/.test(line);
  }

  function isSubHeadingOrLabel(line, idx) {
    if (/^(Weak title|Better title|For example|Instead of|Example|Note|Pro Tip|Tip|Warning|Notice)\s*:?$/i.test(line)) return true;
    if (/^H[1-6]\s*(:|→|-)\s*.+$/i.test(line)) return true;
    // SEO fields when used as standalone section labels
    if (/^(SEO Title|Meta Description|URL Slug|Primary Keyword|Secondary Keywords|Keywords)\s*:?$/i.test(line)) {
      // If followed by a full sentence explanation, it's a section label
      const nextLine = getNextNonEmptyLine(idx);
      if (nextLine && (nextLine.length > 30 || nextLine.endsWith("."))) {
        return true;
      }
      return false;
    }
    return false;
  }

  function getNextNonEmptyLine(fromIdx) {
    for (let k = fromIdx + 1; k < lines.length; k++) {
      if (lines[k]) return lines[k];
    }
    return null;
  }

  function isStandaloneTitle(line, lineIdx) {
    if (isNamedHeading(line)) return true;
    if (line.length > 85) return false;
    if (/[.,:;]$/.test(line)) return false;
    if (/^(use|and|or|for|instead|check|image\d+)\b/i.test(line)) return false;

    // Don't treat examples as standalone titles if preceded by "Weak title:", "Better title:", etc.
    let prevNonEmpty = null;
    for (let p = lineIdx - 1; p >= 0; p--) {
      if (lines[p]) {
        prevNonEmpty = lines[p];
        break;
      }
    }
    if (prevNonEmpty && /^(Weak title|Better title|Instead of|For example):?$/i.test(prevNonEmpty)) {
      return false;
    }

    const words = line.split(/\s+/).filter(Boolean);
    if (words.length < 3) return false;

    const upperWords = words.filter((w) => /^[A-Z0-9]/.test(w));
    const isCapitalized = upperWords.length >= Math.ceil(words.length * 0.55);

    const prevEmpty = lineIdx === 0 || !lines[lineIdx - 1];
    const nextEmpty = lineIdx + 1 >= lines.length || !lines[lineIdx + 1];

    return isCapitalized && prevEmpty && nextEmpty;
  }

  function formatInline(str) {
    if (!str) return "";
    return str
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/__(.*?)__/g, "<strong>$1</strong>")
      .replace(/\*([^*]+)\*/g, "<em>$1</em>")
      .replace(/_([^_]+)_/g, "<em>$1</em>")
      .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  }

  while (i < lines.length) {
    const line = lines[i];

    if (!line) {
      i++;
      continue;
    }

    // 1. Workflow Chain
    if (line.startsWith("__WORKFLOW_CHAIN__:")) {
      try {
        const steps = JSON.parse(line.replace("__WORKFLOW_CHAIN__:", ""));
        blocks.push(
          `<div class="workflow-chain flex flex-wrap items-center gap-2 my-6 p-4 rounded-2xl bg-white/[0.04] border border-[#B3FFC9]/30 text-xs font-mono text-white/80">\n  ${steps
            .map((s, sIdx) => `<span class="px-3 py-1.5 rounded-lg bg-white/10 font-bold text-white shadow-sm">${s}</span>${sIdx < steps.length - 1 ? ' <span class="text-[#B3FFC9] font-bold text-sm">→</span>' : ""}`)
            .join("\n  ")}\n</div>`
        );
      } catch (e) {}
      i++;
      continue;
    }

    // 2. SEO Spec Block detection (e.g. SEO Title:, Meta Description:, URL Slug:)
    if (
      line.startsWith("SEO Title:") ||
      line.startsWith("Meta Description:") ||
      line.startsWith("URL Slug:") ||
      line.startsWith("Primary Keyword:")
    ) {
      const seoLines = [];
      while (
        i < lines.length &&
        lines[i] &&
        (lines[i].startsWith("SEO Title:") ||
          lines[i].startsWith("Meta Description:") ||
          lines[i].startsWith("URL Slug:") ||
          lines[i].startsWith("Primary Keyword:") ||
          lines[i].startsWith("Secondary Keywords:") ||
          lines[i].startsWith("Keywords:"))
      ) {
        seoLines.push(lines[i]);
        i++;
      }
      if (seoLines.length > 0) {
        blocks.push(
          `<div class="blog-seo-callout my-6 p-4 rounded-2xl bg-white/[0.03] border border-[#B3FFC9]/30 text-xs text-white/70 space-y-1.5 font-mono">\n  <div class="font-bold text-[#B3FFC9] uppercase tracking-wider text-[11px] mb-2">📌 Article SEO Specifications</div>\n  ${seoLines
            .map((sl) => {
              const colonIdx = sl.indexOf(":");
              const k = sl.slice(0, colonIdx);
              const v = sl.slice(colonIdx + 1).trim();
              return `<div><strong class="text-white">${k}:</strong> ${formatInline(v)}</div>`;
            })
            .join("\n  ")}\n</div>`
        );
        continue;
      }
    }

    // 3. Markdown Headings
    if (isMarkdownHeading(line)) {
      if (line.startsWith("###")) {
        blocks.push(`<h3>${formatInline(line.replace(/^#{3,6}\s+/, "").trim())}</h3>`);
      } else {
        blocks.push(`<h2>${formatInline(line.replace(/^#{1,2}\s+/, "").trim())}</h2>`);
      }
      i++;
      continue;
    }

    // 4. Numbered Headings (e.g. "1. Start With a Clear Blog Title", "7. Preview Before Publishing")
    if (isNumberedHeading(line)) {
      blocks.push(`<h2>${formatInline(line)}</h2>`);
      i++;
      continue;
    }

    // 5. Question Headings (e.g. "What Is a Blog Editor?")
    if (isQuestionHeading(line)) {
      blocks.push(`<h2>${formatInline(line)}</h2>`);
      i++;
      continue;
    }

    // 6. Named Section Headings ("Conclusion", "Summary", "Key Takeaways")
    if (isNamedHeading(line)) {
      blocks.push(`<h2>${formatInline(line)}</h2>`);
      i++;
      continue;
    }

    // 7. Title comparisons (Weak title: / Better title:)
    if (/^Weak title:?$/i.test(line)) {
      let example = "";
      let j = i + 1;
      while (j < lines.length && !lines[j]) j++;
      if (j < lines.length && lines[j]) {
        example = lines[j];
        i = j + 1;
      } else {
        i++;
      }
      blocks.push(
        `<div class="my-4 p-4 rounded-xl bg-red-500/10 border border-red-500/25">\n  <div class="text-[11px] font-mono font-bold text-red-400 uppercase tracking-wider mb-1">❌ Weak Title Example</div>\n  <div class="text-white/80 font-medium text-base line-through">${formatInline(example)}</div>\n</div>`
      );
      continue;
    }

    if (/^Better title:?$/i.test(line)) {
      let example = "";
      let j = i + 1;
      while (j < lines.length && !lines[j]) j++;
      if (j < lines.length && lines[j]) {
        example = lines[j];
        i = j + 1;
      } else {
        i++;
      }
      blocks.push(
        `<div class="my-4 p-4 rounded-xl bg-[#B3FFC9]/10 border border-[#B3FFC9]/30">\n  <div class="text-[11px] font-mono font-bold text-[#B3FFC9] uppercase tracking-wider mb-1">✨ Better Title Example</div>\n  <div class="text-white font-semibold text-lg">${formatInline(example)}</div>\n</div>`
      );
      continue;
    }

    // 8. Consecutive H1, H2, H3 hierarchy blocks (e.g. "H1 → Main Blog Title" or "H1: How to Choose...")
    if (/^H[1-6]\s*(:|→|-)\s*.+/i.test(line)) {
      const hLines = [line];
      let k = i + 1;
      while (k < lines.length) {
        if (!lines[k]) {
          // Check if after blank line there's another H[1-6] line
          let nextNonEmpty = null;
          let m = k;
          while (m < lines.length && !lines[m]) m++;
          if (m < lines.length && /^H[1-6]\s*(:|→|-)\s*.+/i.test(lines[m])) {
            k = m;
            continue;
          }
          break;
        }
        if (/^H[1-6]\s*(:|→|-)\s*.+/i.test(lines[k])) {
          hLines.push(lines[k]);
          k++;
        } else {
          break;
        }
      }
      i = k;

      blocks.push(
        `<div class="my-5 p-5 rounded-2xl bg-white/[0.03] border border-white/10 font-mono text-xs sm:text-sm space-y-2.5">\n  <div class="text-[11px] font-bold text-[#B3FFC9] uppercase tracking-wider mb-2">Heading Hierarchy Structure</div>\n  ${hLines
          .map((hl) => {
            const match = hl.match(/^H([1-6])\s*(:|→|-)\s*(.+)$/i);
            if (!match) return `<div>${formatInline(hl)}</div>`;
            const level = match[1];
            const title = match[3].trim();
            const indent = (parseInt(level) - 1) * 16;
            const badgeColor =
              level === "1"
                ? "bg-[#B3FFC9]/20 text-[#B3FFC9] border-[#B3FFC9]/30"
                : level === "2"
                ? "bg-blue-500/20 text-blue-300 border-blue-500/30"
                : "bg-purple-500/20 text-purple-300 border-purple-500/30";
            return `<div style="padding-left: ${indent}px" class="flex items-center gap-2">\n    <span class="px-2 py-0.5 rounded border ${badgeColor} font-bold text-[11px]">H${level}</span>\n    <span class="text-white/90 font-medium">${formatInline(title)}</span>\n  </div>`;
          })
          .join("\n  ")}\n</div>`
      );
      continue;
    }

    // 9. "Check both:" with Desktop & Mobile
    if (/^Check both:?$/i.test(line)) {
      let j = i + 1;
      const deviceWords = [];
      while (j < lines.length && j < i + 8) {
        const trimmed = lines[j]?.trim();
        if (trimmed) {
          deviceWords.push(trimmed);
        }
        if (deviceWords.length >= 3 || (deviceWords.length >= 2 && trimmed.length > 20)) break;
        j++;
      }
      if (deviceWords.some((d) => /desktop/i.test(d)) && deviceWords.some((d) => /mobile/i.test(d))) {
        blocks.push(
          `<div class="my-4 space-y-2">\n  <p class="font-semibold text-white/90">Check both:</p>\n  <div class="flex items-center gap-3">\n    <span class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-xs sm:text-sm flex items-center gap-2">🖥️ Desktop</span>\n    <span class="text-white/30 font-mono text-xs uppercase font-bold">and</span>\n    <span class="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-xs sm:text-sm flex items-center gap-2">📱 Mobile</span>\n  </div>\n</div>`
        );
        i = j + 1;
        continue;
      }
      blocks.push(`<p class="font-semibold text-white/90">Check both:</p>`);
      i++;
      continue;
    }

    // 10. Standalone Multi-Word Titles ("How to Use a Blog Editor to Create Better Content")
    if (isStandaloneTitle(line, i)) {
      blocks.push(`<h2>${formatInline(line)}</h2>`);
      i++;
      continue;
    }

    // 11. Subheading or Labels ("For example:", "SEO Title")
    if (isSubHeadingOrLabel(line, i)) {
      blocks.push(`<h3>${formatInline(line)}</h3>`);
      i++;
      continue;
    }

    // 12. Explicit Bullet List (- item, * item, • item)
    if (/^[-*•–]\s+.+/.test(line)) {
      const items = [];
      while (i < lines.length && /^[-*•–]\s+.+/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*•–]\s+/, "").trim());
        i++;
      }
      blocks.push(`<ul class="space-y-2 my-4 list-disc list-inside text-white/80">\n  ${items.map((it) => `<li>${formatInline(it)}</li>`).join("\n  ")}\n</ul>`);
      continue;
    }

    // 13. Explicit Numbered List (short ordered steps)
    if (/^\d+[.)]\s+.+/.test(line) && !isNumberedHeading(line)) {
      const items = [];
      while (i < lines.length && /^\d+[.)]\s+.+/.test(lines[i]) && !isNumberedHeading(lines[i])) {
        items.push(lines[i].replace(/^\d+[.)]\s+/, "").trim());
        i++;
      }
      blocks.push(`<ol class="space-y-2 my-4 list-decimal list-inside text-white/80">\n  ${items.map((it) => `<li>${formatInline(it)}</li>`).join("\n  ")}\n</ol>`);
      continue;
    }

    // 14. Blockquote (> text)
    if (/^>\s+.+/.test(line)) {
      const quotes = [];
      while (i < lines.length && /^>\s+.+/.test(lines[i])) {
        quotes.push(lines[i].replace(/^>\s+/, "").trim());
        i++;
      }
      blocks.push(`<blockquote><p>${formatInline(quotes.join(" "))}</p></blockquote>`);
      continue;
    }

    // 15. Short consecutive list items without bullets
    // e.g. "Spelling \n Grammar \n Headings \n Images \n Links \n SEO title \n Meta description \n Formatting \n Mobile layout"
    // or: "Write and edit content \n Add headings and paragraphs..."
    const isShortItem = (str) => {
      if (!str) return false;
      if (str.length > 55) return false;
      if (str.endsWith(".") || str.endsWith("?")) return false;
      if (isNumberedHeading(str) || isNamedHeading(str)) return false;
      if (/^(Weak title|Better title|Instead of|For example):?$/i.test(str)) return false;
      if (/^H[1-6]\s*(:|→|-)/i.test(str)) return false;
      return /^[A-Za-z0-9]/.test(str);
    };

    if (isShortItem(line) && i + 1 < lines.length && isShortItem(lines[i + 1])) {
      const items = [];
      while (i < lines.length && isShortItem(lines[i])) {
        items.push(lines[i]);
        i++;
      }
      if (items.length >= 2) {
        blocks.push(`<ul class="space-y-2 my-4 list-disc list-inside text-white/80">\n  ${items.map((it) => `<li>${formatInline(it)}</li>`).join("\n  ")}\n</ul>`);
        continue;
      }
    }

    // 16. Regular Paragraph
    const pLines = [];
    while (
      i < lines.length &&
      lines[i] &&
      !isMarkdownHeading(lines[i]) &&
      !isNumberedHeading(lines[i]) &&
      !isQuestionHeading(lines[i]) &&
      !isNamedHeading(lines[i]) &&
      !isSubHeadingOrLabel(lines[i], i) &&
      !isStandaloneTitle(lines[i], i) &&
      !/^[-*•–]\s+/.test(lines[i]) &&
      !/^(Weak title|Better title|Check both:)/i.test(lines[i]) &&
      !/^H[1-6]\s*(:|→|-)/i.test(lines[i]) &&
      !lines[i].startsWith("__WORKFLOW_CHAIN__:") &&
      !lines[i].startsWith("SEO Title:")
    ) {
      pLines.push(lines[i]);
      i++;
    }

    if (pLines.length > 0) {
      blocks.push(`<p>${formatInline(pLines.join(" "))}</p>`);
    }
  }

  return blocks.join("\n\n");
}

/**
 * Smart extractor for Title, Excerpt, and Slug if present in the pasted draft
 */
export function extractMetadataFromText(text) {
  if (!text || typeof text !== "string") return null;

  const result = {};

  const titleMatch =
    text.match(/SEO Title:\s*([^\n]+)/i) ||
    text.match(/^([A-Z0-9][A-Za-z0-9\s:,'"-]{15,90})\n/m);
  if (titleMatch) {
    result.title = titleMatch[1].trim();
  }

  const descMatch = text.match(/Meta Description:\s*([^\n]+)/i);
  if (descMatch) {
    result.excerpt = descMatch[1].trim();
  }

  const slugMatch = text.match(/URL Slug:\s*(?:\/blog\/)?([a-z0-9-]+)/i);
  if (slugMatch) {
    result.slug = slugMatch[1].trim();
  }

  const kwMatch = text.match(/Primary Keyword:\s*([^\n]+)/i);
  const secKwMatch = text.match(/Secondary Keywords:\s*([^\n]+)/i);
  const tags = [];
  if (kwMatch) tags.push(...kwMatch[1].split(",").map((k) => k.trim()).filter(Boolean));
  if (secKwMatch) tags.push(...secKwMatch[1].split(",").map((k) => k.trim()).filter(Boolean));
  if (tags.length > 0) {
    result.tags = tags;
  }

  return Object.keys(result).length > 0 ? result : null;
}

export function calculateReadingStats(htmlOrText) {
  if (!htmlOrText) return { words: 0, readTime: "1 min read" };
  const plainText = htmlOrText.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
  const words = plainText ? plainText.split(/\s+/).length : 0;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return {
    words,
    readTime: `${minutes} min read`,
  };
}
