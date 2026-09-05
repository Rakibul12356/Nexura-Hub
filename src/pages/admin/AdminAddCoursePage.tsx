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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAppDispatch } from "@/store/hooks";
import { addAdminCourse } from "@/store/slices/adminSlice";
import { toast } from "react-toastify";
import { ArrowLeft, Sparkles, ShieldCheck, DollarSign } from "lucide-react";

const formSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters" }),
  subtitle: z.string().optional(),
  category: z.string().min(1, { message: "Category is required" }),
  price: z.coerce.number().min(0, { message: "Price must be greater than or equal to 0" }),
  discountPrice: z.coerce.number().optional(),
  description: z.string().min(10, { message: "Description must be at least 10 characters" }),
});

export const AdminAddCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      category: "Web Development",
      price: 49.99,
      discountPrice: 39.99,
      description: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    dispatch(
      addAdminCourse({
        title: values.title,
        subtitle: values.subtitle,
        category: values.category,
        price: values.price,
        discountPrice: values.discountPrice,
        description: values.description,
        isPublished: true,
      })
    );
    toast.success("Official Admin Course created with 100% Platform Revenue!");
    navigate("/admin/courses");
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link
        to="/admin/courses"
        className="flex items-center text-sm hover:opacity-75 transition text-muted-foreground w-fit gap-1"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Course Management
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-xl bg-purple-500/10 border border-purple-500/20">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Create Official Admin Course</h1>
            <ShieldCheck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Admin courses keep <strong>100% of all sales</strong> directly in the platform treasury.
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
          <DollarSign className="h-4 w-4" /> 100% Revenue Share
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 'Advanced AI Engineering & LLM Architecture'"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>What will students learn in this official course?</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subtitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subtitle / Catchline</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 'From neural network basics to deploying high-throughput AI agents'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Web Development">Web Development</SelectItem>
                        <SelectItem value="Full Stack">Full Stack</SelectItem>
                        <SelectItem value="Programming">Programming</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="DevOps">DevOps</SelectItem>
                        <SelectItem value="Artificial Intelligence">Artificial Intelligence</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Regular Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="discountPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discounted Price ($)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Course Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed overview of syllabus, prerequisites, and learning outcomes..."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center gap-x-2 pt-2">
              <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
                <Sparkles className="mr-2 h-4 w-4" /> Publish Admin Course
              </Button>
              <Button type="button" variant="outline" onClick={() => navigate("/admin/courses")}>
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default AdminAddCoursePage;
