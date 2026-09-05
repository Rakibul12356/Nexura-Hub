import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { loginStart, loginSuccess, loginFailure } from "@/store/slices/authSlice";
import { authService } from "@/services/authService";
import { toast } from "react-toastify";
import { GraduationCap, ShieldCheck, UserCheck, Sparkles } from "lucide-react";

const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAppSelector((state) => state.auth);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "instructor@nexurahub.com",
      password: "password123",
    },
  });

  const handleLogin = async (credentials: { email: string; password: string }) => {
    try {
      dispatch(loginStart());
      const data = await authService.login(credentials);
      dispatch(loginSuccess(data));
      toast.success(`Welcome back, ${data.user.firstName}! Logged in as ${data.user.role}.`);
      
      if (data.user.role === "admin") {
        navigate("/admin");
      } else if (data.user.role === "instructor") {
        navigate("/dashboard");
      } else {
        navigate("/account/enrolled-courses");
      }
    } catch (err: any) {
      dispatch(loginFailure(err.message || "Failed to login"));
      toast.error("Invalid credentials. Please try again.");
    }
  };

  const onSubmit = async (values: LoginFormValues) => {
    await handleLogin({
      email: values.email,
      password: values.password,
    });
  };

  // Quick 1-click Demo Logins
  const handleDemoAdminLogin = () => {
    form.setValue("email", "admin@nexurahub.com");
    form.setValue("password", "password123");
    handleLogin({
      email: "admin@nexurahub.com",
      password: "password123",
    });
  };

  const handleDemoInstructorLogin = () => {
    form.setValue("email", "instructor@nexurahub.com");
    form.setValue("password", "password123");
    handleLogin({
      email: "instructor@nexurahub.com",
      password: "password123",
    });
  };

  const handleDemoStudentLogin = () => {
    form.setValue("email", "student@nexurahub.com");
    form.setValue("password", "password123");
    handleLogin({
      email: "student@nexurahub.com",
      password: "password123",
    });
  };

  return (
    <Card className="w-full shadow-xl border bg-card/95 backdrop-blur">
      <CardHeader className="space-y-1 text-center pb-4">
        <CardTitle className="text-2xl font-bold">Sign In to Nexura Hub</CardTitle>
        <CardDescription>
          Enter your credentials or choose a quick demo account below
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-5">
        {/* Quick 1-Click Demo Login Buttons */}
        <div className="space-y-2.5 p-3.5 rounded-xl bg-muted/50 border">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            <Sparkles className="h-3.5 w-3.5 text-purple-500" />
            <span>Instant Demo Accounts</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {/* SuperAdmin Demo */}
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoAdminLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-between p-2.5 h-auto hover:border-purple-500 hover:bg-purple-50/50 dark:hover:bg-purple-950/40 text-left transition-all border-purple-500/30 bg-purple-500/5"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">SuperAdmin</div>
                  <div className="text-[10px] text-muted-foreground">5% Cut & Users</div>
                </div>
              </div>
            </Button>

            {/* Instructor Demo */}
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoInstructorLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-between p-2.5 h-auto hover:border-sky-500 hover:bg-sky-50/50 dark:hover:bg-sky-950/40 text-left transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-100 dark:bg-sky-950 text-sky-600">
                  <UserCheck className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Instructor</div>
                  <div className="text-[10px] text-muted-foreground">Teaching Studio</div>
                </div>
              </div>
            </Button>

            {/* Student Demo */}
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoStudentLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-between p-2.5 h-auto hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 text-left transition-all"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600">
                  <GraduationCap className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-foreground">Student</div>
                  <div className="text-[10px] text-muted-foreground">Learning Portal</div>
                </div>
              </div>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground font-medium">
              Or sign in with email
            </span>
          </div>
        </div>

        {/* Form Login */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input placeholder="m@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-sky-600 hover:bg-sky-700 font-semibold"
              disabled={isLoading}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>
        </Form>

        <div className="text-center text-sm text-muted-foreground pt-1">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-primary underline underline-offset-4"
          >
            Create account
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
