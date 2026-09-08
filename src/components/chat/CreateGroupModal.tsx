import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { createCourseGroup } from "@/store/slices/chatSlice";
import { toast } from "react-toastify";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { courses } = useAppSelector((state) => state.courses);

  const [groupName, setGroupName] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !selectedCourseId) {
      toast.error("Please provide group name and select a course");
      return;
    }

    const selectedCourse = courses.find((c) => String(c.id) === selectedCourseId);
    if (!selectedCourse) return;

    dispatch(
      createCourseGroup({
        courseId: selectedCourse.id,
        courseTitle: selectedCourse.title,
        groupName: groupName.trim(),
        instructor: {
          id: user?.id || 101,
          name: `${user?.firstName || "Instructor"} ${user?.lastName || ""}`.trim(),
          avatar: user?.avatar || "https://github.com/shadcn.png",
          role: "instructor",
        },
      })
    );

    toast.success(`Group "${groupName}" created successfully!`);
    setGroupName("");
    setSelectedCourseId("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Course Discussion Group</DialogTitle>
          <DialogDescription>
            Create a community chat group for your enrolled students.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreate} className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label htmlFor="course">Select Course</Label>
            <Select value={selectedCourseId} onValueChange={setSelectedCourseId}>
              <SelectTrigger id="course">
                <SelectValue placeholder="Choose a course..." />
              </SelectTrigger>
              <SelectContent>
                {courses.map((course) => (
                  <SelectItem key={course.id} value={String(course.id)}>
                    {course.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="groupName">Group Channel Name</Label>
            <Input
              id="groupName"
              placeholder="e.g. React Accelerator - Batch 1"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="bg-sky-600 hover:bg-sky-700 text-white">
              Create Group
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGroupModal;
