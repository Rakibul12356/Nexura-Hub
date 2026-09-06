import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch } from "@/store/hooks";
import { addCourse } from "@/store/slices/dashboardSlice";
import { toast } from "react-toastify";
import { Course } from "@/types/course";

const formSchema = z.object({
  title: z.string().min(1, {
    message: "Title is required!",
  }),
  description: z.string().min(1, {
    message: "Description is required!",
  }),
});

type AddCourseFormValues = z.infer<typeof formSchema>;

export const AddCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<AddCourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: AddCourseFormValues) => {
    try {
      const newCourseId = Date.now();
      const newCourse: Course = {
        id: newCourseId,
        slug: values.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        title: values.title,
        description: values.description,
        subtitle: values.description,
        category: "Development",
        thumbnail: "/assets/images/courses/course_1.png",
        price: 49,
        isPublished: false,
        totalChapters: 0,
        progress: 0,
        modules: [],
      };

      dispatch(addCourse(newCourse));
      toast.success("Course created! Customize details now.");
      navigate(`/dashboard/courses/${newCourseId}`);
    } catch {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center flex-1 p-6">
      <div className="max-w-full w-[536px] bg-card p-8 rounded-2xl border shadow-sm">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Name Your Course</h1>
          <p className="text-sm text-muted-foreground mt-1">
            What would you like to name your course? Don&apos;t worry, you can change this later.
          </p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="e.g. 'Advanced React & Next.js Masterclass'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Write a brief overview of what students will achieve..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Write a concise overview of your course objectives
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-3 pt-2">
              <Button asChild variant="outline" type="button">
                <Link to="/dashboard/courses">Cancel</Link>
              </Button>
              <Button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="bg-sky-600 hover:bg-sky-700"
              >
                Continue to Course Setup
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddCoursePage;
