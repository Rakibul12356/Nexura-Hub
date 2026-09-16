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
import { useCreateCourseMutation } from "@/hooks/queries/useCoursesQuery";

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
  const createCourseMutation = useCreateCourseMutation();

  const form = useForm<AddCourseFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = (values: AddCourseFormValues) => {
    createCourseMutation.mutate(
      {
        title: values.title,
        description: values.description,
        category: "Web Development",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
        price: 3999,
        isPublished: false,
      },
      {
        onSuccess: (newCourse) => {
          navigate(`/dashboard/courses/${newCourse.id}`);
        },
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center h-full p-6">
      <div className="w-full">
        <h1 className="text-2xl font-bold">Name your course</h1>
        <p className="text-sm text-muted-foreground">
          What would you like to name your course? Don&apos;t worry, you can change this later.
        </p>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting || createCourseMutation.isPending}
                      placeholder="e.g. 'Advanced Web Development'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>What will you teach in this course?</FormDescription>
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
                      disabled={isSubmitting || createCourseMutation.isPending}
                      placeholder="e.g. 'This course will cover...'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2">
              <Link to="/dashboard/courses">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting || createCourseMutation.isPending}>
                {createCourseMutation.isPending ? "Creating..." : "Continue"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AddCoursePage;
