import React from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface EditorProps {
  onChange: (value: string) => void;
  value: string;
}

export const Editor: React.FC<EditorProps> = ({ onChange, value }) => {
  return (
    <div className="bg-white rounded-md overflow-hidden border">
      <ReactQuill theme="snow" value={value || ""} onChange={onChange} />
    </div>
  );
};

export default Editor;
