import React from "react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { useTheme } from "next-themes";

interface MarkDownEditorProps {
  type: string;
  content: string;
  components?: any;
}

export default function MarkDownEditor({
  type,
  content,
  components = {},
}: MarkDownEditorProps) {
  const { theme } = useTheme();
  const style = {
    backgroundColor: "transparent",
    color: theme === "light" ? (type === "dialog" ? "black" : "gray") : "",
  };
  return (
    <MarkdownPreview
      style={style}
      source={content}
      components={components}
    ></MarkdownPreview>
  );
}
