import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2, Plus, Clock } from "lucide-react";
import { toast } from "react-toastify";

export interface Note {
  id: string;
  timestamp: number;
  text: string;
  createdAt: string;
}

interface PlayerNotesProps {
  currentTime: number;
  onSeek?: (timestamp: number) => void;
}

export const PlayerNotes: React.FC<PlayerNotesProps> = ({
  currentTime,
  onSeek,
}) => {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "note-1",
      timestamp: 45,
      text: "Remember to review Virtual DOM diffing algorithm details.",
      createdAt: "Just now",
    },
  ]);
  const [newNoteText, setNewNoteText] = useState("");

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const handleAddNote = () => {
    if (!newNoteText.trim()) {
      toast.error("Please enter a note content.");
      return;
    }

    const note: Note = {
      id: `note-${Date.now()}`,
      timestamp: Math.floor(currentTime),
      text: newNoteText.trim(),
      createdAt: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setNotes([note, ...notes]);
    setNewNoteText("");
    toast.success(`Note saved at ${formatTime(note.timestamp)}`);
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((n) => n.id !== id));
    toast.info("Note deleted.");
  };

  return (
    <div className="space-y-4 p-4 border rounded-xl bg-card shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-sky-600" />
          Personal Video Notes & Bookmarks
        </h3>
        <span className="text-xs text-muted-foreground font-mono">
          Current: {formatTime(currentTime)}
        </span>
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={newNoteText}
          onChange={(e) => setNewNoteText(e.target.value)}
          placeholder={`Add a note at ${formatTime(currentTime)}...`}
          onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
          className="flex-1 bg-background border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
        <Button size="sm" onClick={handleAddNote} className="gap-1 bg-sky-600 hover:bg-sky-700">
          <Plus className="h-4 w-4" />
          Add Note
        </Button>
      </div>

      <div className="space-y-2 max-h-60 overflow-y-auto pt-2">
        {notes.length === 0 ? (
          <p className="text-xs text-muted-foreground italic text-center py-4">
            No notes added yet. Add notes to bookmark key points in the video!
          </p>
        ) : (
          notes.map((note) => (
            <div
              key={note.id}
              className="flex items-start justify-between p-3 rounded-lg border bg-muted/30 hover:bg-muted/60 transition-colors text-sm group"
            >
              <div className="space-y-1">
                <button
                  onClick={() => onSeek?.(note.timestamp)}
                  className="flex items-center gap-1 text-xs font-semibold text-sky-600 hover:underline"
                >
                  <Clock className="h-3 w-3" />
                  {formatTime(note.timestamp)}
                </button>
                <p className="text-foreground text-xs leading-relaxed">{note.text}</p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteNote(note.id)}
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PlayerNotes;
