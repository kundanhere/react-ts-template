import * as React from "react";

import {
  AddCircleIcon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Link04Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface SocialLink {
  id: string;
  url: string;
}

export default function ProfileTab() {
  // State for form fields
  const [name, setName] = React.useState("Kundan Gupta");
  const [email, setEmail] = React.useState("kundan@example.com");
  const [bio, setBio] = React.useState(
    "Full-stack software engineer passionate about building high-performance agentic interfaces and secure dashboards."
  );
  const [pronouns, setPronouns] = React.useState("he/him");
  const [company, setCompany] = React.useState("Softdoc Inc");
  const [location, setLocation] = React.useState("San Francisco, CA");
  const [website, setWebsite] = React.useState("https://github.com/kundanhere");
  const [availableForHire, setAvailableForHire] = React.useState(true);
  const [showStatus, setShowStatus] = React.useState(true);

  // State for social accounts
  const [socials, setSocials] = React.useState<SocialLink[]>([
    { id: "1", url: "https://x.com/kundanhere" },
    { id: "2", url: "https://linkedin.com/in/kundanhere" },
  ]);
  const [newSocialUrl, setNewSocialUrl] = React.useState("");

  // Avatar state
  const [avatarUrl, setAvatarUrl] = React.useState<string>(
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&dpr=2&q=80"
  );
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Status message state
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const removeAvatar = () => {
    setAvatarUrl("");
  };

  const addSocial = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSocialUrl.trim()) {
      setSocials([
        ...socials,
        { id: Math.random().toString(), url: newSocialUrl.trim() },
      ]);
      setNewSocialUrl("");
    }
  };

  const removeSocial = (id: string) => {
    setSocials(socials.filter((s) => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("Your profile saved successfully.");
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => {
      setSuccessMessage(null);
    }, 5000);
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Alert Banner */}
      {successMessage && (
        <div className="flex items-center justify-between rounded-md border border-emerald-200 bg-emerald-50/70 p-3 text-xs text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-950/20 dark:text-emerald-400">
          <div className="flex items-center gap-2">
            <HugeiconsIcon
              icon={CheckmarkCircle02Icon}
              className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400"
            />
            <span>{successMessage}</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSuccessMessage(null)}
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          </Button>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">Your profile</h2>
        <p className="text-muted-foreground text-xs">
          Manage how other users view your profile details and social
          integrations.
        </p>
      </div>

      <div className="border-border/60 border-t" />

      {/* Profile Form & Avatar Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_240px]">
        {/* Left: Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name */}
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-semibold">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <p className="text-muted-foreground text-[11px] leading-normal">
              Your name may appear around the application where you contribute
              or are active.
            </p>
          </div>

          {/* Public Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">
              Public email
            </Label>
            <select
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border-input bg-input/20 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 dark:bg-input/30 w-full rounded-md border px-2 py-1 text-xs/relaxed outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="kundan@example.com">kundan@example.com</option>
              <option value="private-user@users.noreply.com">
                Private (noreply)
              </option>
            </select>
            <p className="text-muted-foreground text-[11px] leading-normal">
              This email will be displayed to other signed-in users on your
              profile.
            </p>
          </div>

          {/* Bio */}
          <div className="space-y-1.5">
            <Label htmlFor="bio" className="text-xs font-semibold">
              Bio
            </Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a little bit about yourself"
              rows={3}
              maxLength={160}
            />
            <div className="text-muted-foreground flex justify-between text-[11px]">
              <span>You can @mention other users and organizations.</span>
              <span>{160 - bio.length} remaining</span>
            </div>
          </div>

          {/* Pronouns */}
          <div className="space-y-1.5">
            <Label htmlFor="pronouns" className="text-xs font-semibold">
              Pronouns
            </Label>
            <select
              id="pronouns"
              value={pronouns}
              onChange={(e) => setPronouns(e.target.value)}
              className="border-input bg-input/20 placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/30 dark:bg-input/30 w-full rounded-md border px-2 py-1 text-xs/relaxed outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Don't specify</option>
              <option value="he/him">he/him</option>
              <option value="she/her">she/her</option>
              <option value="they/them">they/them</option>
              <option value="other">custom</option>
            </select>
          </div>

          {/* Company */}
          <div className="space-y-1.5">
            <Label htmlFor="company" className="text-xs font-semibold">
              Company
            </Label>
            <Input
              id="company"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Company or organization"
            />
          </div>

          {/* Location */}
          <div className="space-y-1.5">
            <Label htmlFor="location" className="text-xs font-semibold">
              Location
            </Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. San Francisco, CA"
            />
          </div>

          {/* Website */}
          <div className="space-y-1.5">
            <Label htmlFor="website" className="text-xs font-semibold">
              Website
            </Label>
            <Input
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="e.g. https://example.com"
            />
          </div>

          {/* Social Accounts */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold">Social accounts</Label>

            {/* Added social accounts list */}
            {socials.length > 0 && (
              <div className="space-y-2">
                {socials.map((social) => (
                  <div
                    key={social.id}
                    className="bg-muted/30 flex items-center justify-between rounded-md border px-3 py-1.5 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <HugeiconsIcon
                        icon={Link04Icon}
                        className="text-muted-foreground size-3.5"
                      />
                      <span className="text-muted-foreground truncate">
                        {social.url}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeSocial(social.id)}
                      className="text-muted-foreground hover:text-destructive p-0.5 transition-colors"
                    >
                      <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add social account form input */}
            <div className="flex gap-2">
              <Input
                placeholder="Link to social profile (X, LinkedIn, etc.)"
                value={newSocialUrl}
                onChange={(e) => setNewSocialUrl(e.target.value)}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addSocial}
                className="h-7 shrink-0 gap-1.5 px-3 py-0"
              >
                <HugeiconsIcon icon={AddCircleIcon} className="size-3.5" />
                Add
              </Button>
            </div>
          </div>

          {/* Checkboxes */}
          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="showStatus"
                checked={showStatus}
                onChange={(e) => setShowStatus(e.target.checked)}
                className="accent-primary focus:ring-primary mt-0.5 size-3.5 rounded border-gray-300"
              />
              <div className="grid gap-0.5">
                <Label
                  htmlFor="showStatus"
                  className="cursor-pointer text-xs font-semibold"
                >
                  Show status on profile
                </Label>
                <span className="text-muted-foreground text-[11px] leading-normal">
                  Show status updates and what you are working on.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <input
                type="checkbox"
                id="availableForHire"
                checked={availableForHire}
                onChange={(e) => setAvailableForHire(e.target.checked)}
                className="accent-primary focus:ring-primary mt-0.5 size-3.5 rounded border-gray-300"
              />
              <div className="grid gap-0.5">
                <Label
                  htmlFor="availableForHire"
                  className="cursor-pointer text-xs font-semibold"
                >
                  Available for hire
                </Label>
                <span className="text-muted-foreground text-[11px] leading-normal">
                  Add a green badge to your profile indicating that you are open
                  to new opportunities.
                </span>
              </div>
            </div>
          </div>

          <div className="border-border/60 border-t pt-4" />

          {/* Submit Button */}
          <Button
            type="submit"
            className="h-8 shrink-0 bg-emerald-600 px-4 text-xs font-medium text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500"
          >
            Update profile
          </Button>
        </form>

        {/* Right: Profile Picture */}
        <div className="order-first flex flex-col items-center gap-3 md:order-last md:items-start">
          <Label className="self-start text-xs font-semibold md:self-auto">
            Profile picture
          </Label>
          <div className="group relative">
            <Avatar className="border-border size-36 border">
              {avatarUrl ? (
                <AvatarImage
                  src={avatarUrl}
                  alt="Avatar Preview"
                  className="object-cover"
                />
              ) : (
                <AvatarFallback className="bg-muted text-muted-foreground">
                  <HugeiconsIcon icon={UserIcon} className="size-10" />
                </AvatarFallback>
              )}
            </Avatar>
          </div>

          <div className="flex w-full max-w-50 flex-col gap-1.5">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={triggerFileInput}
              className="h-7 w-full py-0 text-xs"
            >
              Upload a photo
            </Button>
            {avatarUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={removeAvatar}
                className="text-destructive hover:bg-destructive/10 hover:text-destructive h-7 w-full py-0 text-xs"
              >
                Remove photo
              </Button>
            )}
          </div>

          <p className="text-muted-foreground mt-2 text-center text-xs leading-normal md:text-left">
            Uploaded images are resized and cropped automatically. Supported
            formats: JPEG, PNG. Max size 1MB
          </p>
        </div>
      </div>
    </div>
  );
}
