import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Radio } from "lucide-react";
import { useAppDispatch } from "@/store/hooks";
import { addLiveClass } from "@/store/slices/dashboardSlice";
import { toast } from "sonner";
import { LiveClass } from "@/types/dashboard";

export const AddLivePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    meetingLink: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a title");
      return;
    }

    const newLive: LiveClass = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      date: formData.date || "15 Nov 2024",
      time: formData.time || "07:00 PM",
      meetingLink: formData.meetingLink || "https://meet.google.com/new",
      isCompleted: false,
    };

    dispatch(addLiveClass(newLive));
    toast.success("Live class scheduled successfully!");
    navigate("/dashboard/lives");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          to="/dashboard/lives"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground gap-1.5 mb-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Live Classes
        </Link>
        <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
          <Radio className="h-6 w-6 text-rose-500" />
          Schedule a New Live Class
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Set up meeting link, date, time, and session agenda
        </p>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="mb-1 block">Live Class Topic *</Label>
            <Input
              placeholder="e.g. 'Live Career Roadmap Q&A'"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="mb-1 block">Date</Label>
              <Input
                type="text"
                placeholder="e.g. '15 Nov 2024'"
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="mb-1 block">Time</Label>
              <Input
                type="text"
                placeholder="e.g. '08:00 PM'"
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label className="mb-1 block">Meeting Link (Google Meet / Zoom)</Label>
            <Input
              type="url"
              placeholder="https://meet.google.com/..."
              value={formData.meetingLink}
              onChange={(e) =>
                setFormData({ ...formData, meetingLink: e.target.value })
              }
            />
          </div>

          <div>
            <Label className="mb-1 block">Session Agenda / Description</Label>
            <Textarea
              placeholder="What will be discussed during this session?"
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button asChild variant="outline">
              <Link to="/dashboard/lives">Cancel</Link>
            </Button>
            <Button type="submit" className="bg-sky-600 hover:bg-sky-700">
              Schedule Class
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLivePage;
