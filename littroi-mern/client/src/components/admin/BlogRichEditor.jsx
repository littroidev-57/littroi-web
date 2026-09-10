import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  Heading2,
  Heading3,
  Pilcrow,
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Link2,
  Minus,
  Sparkles,
  Code,
  Eye,
  Type,
  RotateCcw,
  Check,
  Clock,
  FileText,
  Sliders
} from "lucide-react";
import { autoFormatTextToHtml, calculateReadingStats, extractMetadataFromText } from "../../utils/blogFormatter";

export function BlogRichEditor({
  value = "",
  onChange,
  onAutoSyncReadTime,
  onAutoFillMetadata,
  placeholder = "Write or paste article content here..."
}) {
  const [activeTab, setActiveTab] = useState("visual"); // 'visual' | 'code' | 'preview'
  const editorRef = useRef(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [detectedMeta, setDetectedMeta] = useState(null);

  // Sync internal visual editor with value
  useEffect(() => {
    if (editorRef.current && activeTab === "visual") {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || "";
      }
    }
  }, [value, activeTab]);

  // Compute words & reading stats
  const stats = useMemo(() => calculateReadingStats(value), [value]);

  // Check for metadata in value
  useEffect(() => {
    if (value && typeof value === "string") {
      const meta = extractMetadataFromText(value);
      if (meta && (meta.title || meta.excerpt || meta.slug)) {
        setDetectedMeta(meta);
      } else {
        setDetectedMeta(null);
      }
    }
  }, [value]);

  // Handle manual typing in visual editor
  const handleEditorInput = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    if (onChange) onChange(html);
  };

  // Smart Paste Handler: intercepts paste and auto-converts into clean H2, H3, P, Lists
  const handlePaste = (e) => {
    e.preventDefault();

    const plainText = e.clipboardData.getData("text/plain");
    const htmlData = e.clipboardData.getData("text/html");

    // Prefer plainText for structured parsing of drafts, or htmlData if it has rich formatting
    const rawContent = plainText || htmlData || "";
    if (!rawContent.trim()) return;

    // Run the smart auto-formatter
    const formattedHtml = autoFormatTextToHtml(rawContent);

    // Check if the pasted text has SEO title/excerpt/slug
    const meta = extractMetadataFromText(rawContent);
    if (meta) {
      setDetectedMeta(meta);
    }

    if (editorRef.current) {
      // If editor was empty or mostly empty, replace completely
      const currentText = editorRef.current.innerText.trim();
      if (!currentText || currentText.length < 5) {
        editorRef.current.innerHTML = formattedHtml;
      } else {
        // Insert at cursor position if possible
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
          const range = sel.getRangeAt(0);
          range.deleteContents();
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = formattedHtml;
          const frag = document.createDocumentFragment();
          let node;
          while ((node = tempDiv.firstChild)) {
            frag.appendChild(node);
          }
          range.insertNode(frag);
        } else {
          editorRef.current.innerHTML += "\n" + formattedHtml;
        }
      }

      if (onChange) onChange(editorRef.current.innerHTML);
    } else if (onChange) {
      onChange(formattedHtml);
    }

    setStatusMessage("✨ Pasted & auto-formatted with H2, H3, Lists & P!");
    setTimeout(() => setStatusMessage(""), 3500);
  };

  // Formatting Toolbar commands
  const executeCommand = (command, val = null) => {
    if (activeTab !== "visual") return;
    if (editorRef.current) editorRef.current.focus();

    if (command === "formatBlock") {
      document.execCommand("formatBlock", false, val);
    } else if (command === "createLink") {
      const url = prompt("Enter link URL (e.g. https://example.com):");
      if (url) {
        document.execCommand("createLink", false, url);
      }
    } else {
      document.execCommand(command, false, val);
    }

    if (editorRef.current && onChange) {
      onChange(editorRef.current.innerHTML);
    }
  };

  // Trigger Automatic H2 & P Formatting on entire current content
  const handleAutoFormatEntireContent = () => {
    const raw = value || (editorRef.current ? editorRef.current.innerHTML : "");
    if (!raw.trim()) return;

    const formatted = autoFormatTextToHtml(raw);
    if (onChange) onChange(formatted);

    if (editorRef.current) {
      editorRef.current.innerHTML = formatted;
    }

    setStatusMessage("✨ Automatically formatted into <h2> and <p>!");
    setTimeout(() => setStatusMessage(""), 3000);
  };

  const handleApplyDetectedMeta = () => {
    if (detectedMeta && onAutoFillMetadata) {
      onAutoFillMetadata(detectedMeta);
      setStatusMessage("✅ Auto-filled Title, Excerpt & Slug from article specs!");
      setTimeout(() => setStatusMessage(""), 3500);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-[#121212] overflow-hidden flex flex-col shadow-xl">
      {/* Top Notification Banner if SEO info detected in draft */}
      {detectedMeta && (detectedMeta.title || detectedMeta.excerpt) && (
        <div className="bg-[#B3FFC9]/10 border-b border-[#B3FFC9]/30 px-4 py-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-white/90 font-mono">
            <Sparkles size={14} className="text-[#B3FFC9] shrink-0" />
            <span>
              Detected Article Specs:{" "}
              <strong className="text-white">
                {detectedMeta.title ? `"${detectedMeta.title.slice(0, 45)}..."` : "SEO info found"}
              </strong>
            </span>
          </div>
          {onAutoFillMetadata && (
            <button
              type="button"
              onClick={handleApplyDetectedMeta}
              className="px-3 py-1 rounded-full bg-[#B3FFC9] text-black font-bold text-[11px] uppercase tracking-wider hover:bg-[#9effba] transition-all cursor-pointer shadow-sm active:scale-95"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Auto-Fill Title, Excerpt &amp; Slug
            </button>
          )}
        </div>
      )}

      {/* Top Header: Mode Tabs & Auto-Format Magic Button */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2.5 bg-[#171717] border-b border-white/10">
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-[#0c0c0c] p-1 rounded-xl border border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("visual")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "visual"
                ? "bg-[#B3FFC9] text-black shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <Type size={13} />
            <span>Visual Editor</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "code"
                ? "bg-[#B3FFC9] text-black shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <Code size={13} />
            <span>HTML Source</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === "preview"
                ? "bg-[#B3FFC9] text-black shadow-sm"
                : "text-white/60 hover:text-white"
            }`}
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <Eye size={13} />
            <span>Live Preview</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {statusMessage && (
            <span className="text-xs text-[#B3FFC9] font-mono hidden md:inline animate-fadeIn">
              {statusMessage}
            </span>
          )}

          {/* Magic One-Click Auto-Format Button */}
          <button
            type="button"
            onClick={handleAutoFormatEntireContent}
            title="Analyze pasted content and automatically convert headings to <h2> and body text to <p>"
            className="px-3.5 py-1.5 rounded-xl bg-[#B3FFC9]/10 hover:bg-[#B3FFC9]/25 border border-[#B3FFC9]/40 text-[#B3FFC9] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            <Sparkles size={14} className="text-[#B3FFC9] animate-pulse" />
            <span>Auto-Format H2 &amp; P</span>
          </button>
        </div>
      </div>

      {/* Formatting Action Bar (Active in Visual Mode) */}
      {activeTab === "visual" && (
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 px-3 py-2 bg-[#141414] border-b border-white/5 text-white/70 select-none">
          {/* Headings */}
          <div className="flex items-center gap-1 pr-2 border-r border-white/10">
            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<h2>")}
              title="Heading 2 (Main Section)"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg hover:bg-white/10 text-xs font-bold hover:text-[#B3FFC9] transition-colors flex items-center gap-1 cursor-pointer"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <Heading2 size={15} />
              <span className="hidden sm:inline">H2</span>
            </button>

            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<h3>")}
              title="Heading 3 (Subsection)"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-lg hover:bg-white/10 text-xs font-bold hover:text-[#B3FFC9] transition-colors flex items-center gap-1 cursor-pointer"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <Heading3 size={15} />
              <span className="hidden sm:inline">H3</span>
            </button>

            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<p>")}
              title="Regular Paragraph"
              className="p-1.5 sm:px-2 sm:py-1 rounded-lg hover:bg-white/10 text-xs font-bold hover:text-white transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Pilcrow size={14} />
              <span className="hidden sm:inline">P</span>
            </button>
          </div>

          {/* Inline Styles */}
          <div className="flex items-center gap-1 px-2 border-r border-white/10">
            <button
              type="button"
              onClick={() => executeCommand("bold")}
              title="Bold (Ctrl+B)"
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <Bold size={14} />
            </button>

            <button
              type="button"
              onClick={() => executeCommand("italic")}
              title="Italic (Ctrl+I)"
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <Italic size={14} />
            </button>

            <button
              type="button"
              onClick={() => executeCommand("createLink")}
              title="Insert Link"
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-[#B3FFC9] transition-colors cursor-pointer"
            >
              <Link2 size={14} />
            </button>
          </div>

          {/* Lists & Quotes */}
          <div className="flex items-center gap-1 px-2 border-r border-white/10">
            <button
              type="button"
              onClick={() => executeCommand("insertUnorderedList")}
              title="Bullet List"
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <List size={14} />
            </button>

            <button
              type="button"
              onClick={() => executeCommand("insertOrderedList")}
              title="Numbered List"
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <ListOrdered size={14} />
            </button>

            <button
              type="button"
              onClick={() => executeCommand("formatBlock", "<blockquote>")}
              title="Quote Block"
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-[#B3FFC9] transition-colors cursor-pointer"
            >
              <Quote size={14} />
            </button>

            <button
              type="button"
              onClick={() => executeCommand("insertHorizontalRule")}
              title="Divider Line"
              className="p-1.5 rounded-lg hover:bg-white/10 hover:text-white transition-colors cursor-pointer"
            >
              <Minus size={14} />
            </button>
          </div>

          {/* Reset Format */}
          <button
            type="button"
            onClick={() => executeCommand("removeFormat")}
            title="Clear Formatting"
            className="p-1.5 rounded-lg hover:bg-white/10 hover:text-red-400 transition-colors ml-auto cursor-pointer"
          >
            <RotateCcw size={13} />
          </button>
        </div>
      )}

      {/* Editor Body */}
      <div className="relative min-h-[340px] max-h-[540px] overflow-y-auto bg-[#0a0a0a]">
        {/* 1. Visual Mode (contentEditable) */}
        {activeTab === "visual" && (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleEditorInput}
            onPaste={handlePaste}
            className="blog-rich-content min-h-[340px] p-4 sm:p-6 text-white/90 text-sm leading-relaxed focus:outline-none space-y-4"
            style={{ minHeight: "340px" }}
            data-placeholder={placeholder}
          />
        )}

        {/* 2. HTML Source Code Mode */}
        {activeTab === "code" && (
          <textarea
            value={value}
            onChange={(e) => onChange && onChange(e.target.value)}
            rows={16}
            placeholder="<p>Enter or paste raw HTML here...</p>"
            className="w-full h-full min-h-[340px] p-4 sm:p-6 bg-transparent text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none resize-y"
          />
        )}

        {/* 3. Live Preview Mode */}
        {activeTab === "preview" && (
          <div className="p-4 sm:p-6 bg-[#060606] min-h-[340px]">
            <div className="text-xs font-mono text-white/40 mb-4 pb-2 border-b border-white/10 flex items-center justify-between">
              <span>PREVIEW AS LIVE ARTICLE</span>
              <span className="text-[#B3FFC9]">Exact Blog Post Rendering</span>
            </div>
            {value ? (
              <div
                className="blog-rich-content text-white/85 text-base leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: autoFormatTextToHtml(value) }}
              />
            ) : (
              <div className="text-white/30 text-xs font-mono italic py-12 text-center">
                No content entered yet. Switch to Visual Editor to paste or write.
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Status Bar: Word Count & Auto-Sync Read Time */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#141414] border-t border-white/10 text-xs text-white/50 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <FileText size={12} className="text-[#B3FFC9]" />
            <strong className="text-white font-bold">{stats.words}</strong> words
          </span>
          <span className="flex items-center gap-1.5">
            <Clock size={12} className="text-[#B3FFC9]" />
            <strong className="text-white font-bold">{stats.readTime}</strong>
          </span>
        </div>

        {onAutoSyncReadTime && (
          <button
            type="button"
            onClick={() => onAutoSyncReadTime(stats.readTime)}
            className="text-[11px] text-[#B3FFC9] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Check size={12} />
            <span>Apply "{stats.readTime}" to Read Time</span>
          </button>
        )}
      </div>
    </div>
  );
}
