import * as React from "react";

import {
  Cancel01Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/components/ui/toast";

export default function AccountTab() {
  const [language, setLanguage] = React.useState("en-IN");
  const [region, setRegion] = React.useState("India");
  const [timezone, setTimezone] = React.useState("Asia/Kolkata");
  const [dateFormat, setDateFormat] = React.useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = React.useState("12h");
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage("Account preferences updated successfully.");
    toast.success("Account settings updated");
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
            className="size-6 p-0 hover:bg-emerald-100/50 dark:hover:bg-emerald-900/30"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
          </Button>
        </div>
      )}

      {/* Header */}
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Account Settings
        </h2>
        <p className="text-muted-foreground text-xs">
          Manage your account language, region, timezone, and localized format
          preferences.
        </p>
      </div>

      <div className="border-border/60 border-t" />

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Language & Region */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Language & Region</h3>

          {/* Language Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="language" className="text-xs font-semibold">
              Language
            </Label>
            <Select
              value={language}
              onValueChange={(val) => val && setLanguage(val)}
            >
              <SelectTrigger id="language" className="bg-card w-full max-w-xl">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en-US">English (United States)</SelectItem>
                <SelectItem value="en-GB">English (United Kingdom)</SelectItem>
                <SelectItem value="es">Español (Spanish)</SelectItem>
                <SelectItem value="fr">Français (French)</SelectItem>
                <SelectItem value="de">Deutsch (German)</SelectItem>
                <SelectItem value="ja">日本語 (Japanese)</SelectItem>
                <SelectItem value="zh">中文 (Chinese)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-[11px] leading-normal">
              Select your preferred language for the user interface.
            </p>
          </div>

          {/* Region Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="region" className="text-xs font-semibold">
              Region
            </Label>
            <Select
              value={region}
              onValueChange={(val) => val && setRegion(val)}
            >
              <SelectTrigger id="region" className="bg-card w-full max-w-xl">
                <SelectValue placeholder="Select region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="US">United States</SelectItem>
                <SelectItem value="GB">United Kingdom</SelectItem>
                <SelectItem value="CA">Canada</SelectItem>
                <SelectItem value="DE">Germany</SelectItem>
                <SelectItem value="FR">France</SelectItem>
                <SelectItem value="JP">Japan</SelectItem>
                <SelectItem value="IN">India</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-[11px] leading-normal">
              Select your country or region to format currencies and numbers.
            </p>
          </div>
        </div>

        <div className="border-border/60 border-t" />

        {/* Date & Time */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold">Date & Time</h3>

          {/* Timezone Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="timezone" className="text-xs font-semibold">
              Timezone
            </Label>
            <Select
              value={timezone}
              onValueChange={(val) => val && setTimezone(val)}
            >
              <SelectTrigger id="timezone" className="bg-card w-full max-w-xl">
                <SelectValue placeholder="Select timezone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UTC">
                  UTC / GMT (Coordinated Universal Time)
                </SelectItem>
                <SelectItem value="America/New_York">
                  America/New_York (EST/EDT)
                </SelectItem>
                <SelectItem value="America/Los_Angeles">
                  America/Los_Angeles (PST/PDT)
                </SelectItem>
                <SelectItem value="Europe/London">
                  Europe/London (GMT/BST)
                </SelectItem>
                <SelectItem value="Europe/Paris">
                  Europe/Paris (CET/CEST)
                </SelectItem>
                <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                <SelectItem value="Asia/Tokyo">Asia/Tokyo (JST)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-[11px] leading-normal">
              All timestamps in system logs, activity feeds, and reports will
              align to this timezone.
            </p>
          </div>

          {/* Date Format Selector */}
          <div className="space-y-1.5">
            <Label htmlFor="date-format" className="text-xs font-semibold">
              Date Format
            </Label>
            <Select
              value={dateFormat}
              onValueChange={(val) => val && setDateFormat(val)}
            >
              <SelectTrigger
                id="date-format"
                className="bg-card w-full max-w-xl"
              >
                <SelectValue placeholder="Select date format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="YYYY-MM-DD">
                  YYYY-MM-DD (e.g. 2026-08-28)
                </SelectItem>
                <SelectItem value="DD/MM/YYYY">
                  DD/MM/YYYY (e.g. 28/08/2026)
                </SelectItem>
                <SelectItem value="MM/DD/YYYY">
                  MM/DD/YYYY (e.g. 08/28/2026)
                </SelectItem>
                <SelectItem value="MMM DD, YYYY">
                  MMM DD, YYYY (e.g. Aug 28, 2026)
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-muted-foreground text-[11px] leading-normal">
              Select your preferred date display format.
            </p>
          </div>

          {/* Time Format Selector */}
          <div className="space-y-2 pt-1">
            <Label className="text-xs font-semibold">Time Format</Label>

            <RadioGroup
              value={timeFormat}
              onValueChange={setTimeFormat}
              className="flex w-fit gap-4"
            >
              <div className="flex items-center gap-3">
                <RadioGroupItem
                  id="r1"
                  value="12h"
                  className="cursor-pointer"
                />
                <Label htmlFor="r1">12-hour clock (e.g. 1:30 PM)</Label>
              </div>

              <div className="flex items-center gap-3">
                <RadioGroupItem
                  id="r2"
                  value="24h"
                  className="cursor-pointer"
                />
                <Label htmlFor="r2">24-hour clock (e.g. 13:30)</Label>
              </div>
            </RadioGroup>
          </div>
        </div>

        <div className="border-border/60 border-t pt-4" />

        {/* Save Button */}
        <Button
          type="submit"
          className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 shrink-0 px-4 text-xs font-medium"
        >
          Save preferences
        </Button>
      </form>
    </div>
  );
}
