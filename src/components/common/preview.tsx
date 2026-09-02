import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.bubble.css";

interface PreviewProps {
  value: string;
}

export const Preview: React.FC<PreviewProps> = ({ value }) => {
  return (
    <div className="prose dark:prose-invert max-w-none">
      <ReactQuill theme="bubble" readOnly value={value || ""} />
    </div>
  );
};

export default Preview;
