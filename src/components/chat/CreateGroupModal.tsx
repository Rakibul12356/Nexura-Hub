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
import { useChatStore } from "@/store/useChatStore";
import { useCoursesQuery } from "@/hooks/queries/useCoursesQuery";
import { useCreateChatGroupMutation } from "@/hooks/queries/useAdminQuery";
import { toast } from "react-toastify";

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({ isOpen, onClose }) => {
  const createGroup = useCreateChatGroupMutation();
  const upsertConversation = useChatStore((state) => state.upsertConversation);
  const setActiveConversation = useChatStore((state) => state.setActiveConversation);
  const { data: courses = [] } = useCoursesQuery({ mine: true });

  const [groupName, setGroupName] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim() || !selectedCourseId) {
      toast.error("Please provide group name and select a course");
      return;
    }

    createGroup.mutate(
      { courseId: selectedCourseId, groupName: groupName.trim() },
      {
        onSuccess: (conv) => {
          upsertConversation(conv);
          setActiveConversation(conv.id);
          setGroupName("");
          setSelectedCourseId("");
          onClose();
        },
      }
    );
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
