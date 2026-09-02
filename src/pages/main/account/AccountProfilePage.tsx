import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { updateProfile } from "@/store/slices/authSlice";
import { toast } from "sonner";

export const AccountProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "Jenny",
    lastName: user?.lastName || "Jimenez",
    email: user?.email || "jennyhot@hotmail.com",
    occupation: user?.occupation || "Software Engineer",
    bio: user?.bio || "Passionate full-stack educator and software enthusiast.",
    phone: user?.phone || "+1 (555) 234-5678",
    website: user?.website || "https://jenny-portfolio.com",
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateProfile(formData));
    toast.success("Profile details updated successfully!");
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    toast.success("Password changed successfully!");
    setPasswordData({ oldPassword: "", newPassword: "", confirmPassword: "" });
  };

  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
        <h5 className="text-lg font-semibold mb-4 text-foreground">
          Personal Details
        </h5>
        <form onSubmit={handleProfileSubmit}>
          <div className="grid lg:grid-cols-2 grid-cols-1 gap-5">
            <div>
              <Label className="mb-2 block">
                First Name <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label className="mb-2 block">
                Last Name <span className="text-destructive">*</span>
              </Label>
              <Input
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label className="mb-2 block">
                Your Email <span className="text-destructive">*</span>
              </Label>
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
            <div>
              <Label className="mb-2 block">Occupation</Label>
              <Input
                type="text"
                value={formData.occupation}
                onChange={(e) =>
                  setFormData({ ...formData, occupation: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-5">
            <Label className="mb-2 block">Description / Bio</Label>
            <Textarea
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              rows={3}
            />
          </div>

          <Button className="mt-5" type="submit">
            Save Changes
          </Button>
        </form>
      </div>

      {/* Contact & Password Info */}
      <div className="p-6 rounded-xl border bg-card text-card-foreground shadow-sm">
        <div className="grid lg:grid-cols-2 grid-cols-1 gap-8">
          <div>
            <h5 className="text-lg font-semibold mb-4 text-foreground">
              Contact Info
            </h5>
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <div>
                <Label className="mb-2 block">Phone No.</Label>
                <Input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div>
                <Label className="mb-2 block">Website URL</Label>
                <Input
                  type="url"
                  value={formData.website}
                  onChange={(e) =>
                    setFormData({ ...formData, website: e.target.value })
                  }
                />
              </div>
              <Button type="submit">Update Contact</Button>
            </form>
          </div>

          <div>
            <h5 className="text-lg font-semibold mb-4 text-foreground">
              Change Password
            </h5>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label className="mb-2 block">Old password</Label>
                <Input
                  type="password"
                  placeholder="Old password"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label className="mb-2 block">New password</Label>
                <Input
                  type="password"
                  placeholder="New password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div>
                <Label className="mb-2 block">Re-type New password</Label>
                <Input
                  type="password"
                  placeholder="Re-type New password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <Button type="submit">Save Password</Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountProfilePage;
