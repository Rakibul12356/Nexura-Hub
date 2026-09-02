import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Module } from "@/types/course";

interface ModuleListProps {
  items: Module[];
  onReorder: (updateData: { id: string | number; position: number }[]) => void;
  onEdit: (id: string | number) => void;
}

export const ModuleList: React.FC<ModuleListProps> = ({
  items,
  onReorder,
  onEdit,
}) => {
  const [isMounted, setIsMounted] = useState(false);
  const [modules, setModules] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setModules(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const currentItems = Array.from(modules);
    const [reorderedItem] = currentItems.splice(result.source.index, 1);
    currentItems.splice(result.destination.index, 0, reorderedItem);

    setModules(currentItems);

    const bulkUpdateData = currentItems.map((module, index) => ({
      id: module.id,
      position: index + 1,
    }));

    onReorder(bulkUpdateData);
  };

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="modules">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
            {modules.map((module, index) => (
              <Draggable key={String(module.id)} draggableId={String(module.id)} index={index}>
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-muted/60 border text-foreground rounded-lg text-sm transition-all overflow-hidden",
                      module.isPublished && "bg-sky-50 dark:bg-sky-950/40 border-sky-200 dark:border-sky-900"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-3 py-3 border-r border-border hover:bg-muted rounded-l-lg transition-colors cursor-grab active:cursor-grabbing",
                        module.isPublished && "border-r-sky-200 dark:border-r-sky-900"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip className="h-4 w-4 text-muted-foreground" />
                    </div>

                    <span className="font-medium px-2 py-1 flex-1 line-clamp-1">
                      {module.title}
                    </span>

                    <div className="ml-auto pr-3 flex items-center gap-x-2">
                      <Badge variant={module.isPublished ? "success" : "secondary"}>
                        {module.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <button
                        type="button"
                        onClick={() => onEdit(module.id)}
                        className="p-1 hover:text-sky-600 transition-colors"
                        title="Edit Module"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default ModuleList;
