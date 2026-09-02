import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Radio, Trash2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateLiveClass, deleteLiveClass } from "@/store/slices/dashboardSlice";
import { toast } from "sonner";

export const EditLivePage: React.FC = () => {
  const { liveId } = useParams();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { liveClasses } = useAppSelector((state) => state.dashboard);

  const live =
    liveClasses.find((l) => String(l.id) === String(liveId)) || liveClasses[0];

  const [formData, setFormData] = useState({
    title: live?.title || "",
    description: live?.description || "",
    date: live?.date || "",
    time: live?.time || "",
    meetingLink: live?.meetingLink || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!live) return;

    dispatch(
      updateLiveClass({
        ...live,
        ...formData,
      })
    );
    toast.success("Live class updated successfully!");
    navigate("/dashboard/lives");
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this live class?")) {
      dispatch(deleteLiveClass(live.id));
      toast.success("Live class deleted");
      navigate("/dashboard/lives");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
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
            Edit Live Class
          </h1>
        </div>

        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          className="gap-1.5"
        >
          <Trash2 className="h-4 w-4" />
          Delete
        </Button>
      </div>

      <div className="bg-card border rounded-2xl p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label className="mb-1 block">Live Class Topic *</Label>
            <Input
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
                value={formData.date}
                onChange={(e) =>
                  setFormData({ ...formData, date: e.target.value })
                }
              />
            </div>
            <div>
              <Label className="mb-1 block">Time</Label>
              <Input
                value={formData.time}
                onChange={(e) =>
                  setFormData({ ...formData, time: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <Label className="mb-1 block">Meeting Link</Label>
            <Input
              type="url"
              value={formData.meetingLink}
              onChange={(e) =>
                setFormData({ ...formData, meetingLink: e.target.value })
              }
            />
          </div>

          <div>
            <Label className="mb-1 block">Agenda / Notes</Label>
            <Textarea
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
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLivePage;
