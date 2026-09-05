import * as React from "react";

import { CheckmarkCircle02Icon, Copy01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/toast";

interface IAuthenticatorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=ZPFIY52GITG7WOWJ44`;

export function AuthenticatorModal({
  open,
  onOpenChange,
  onConfirm,
}: IAuthenticatorModalProps) {
  const secretKey = "ZPFIY52GITG7WOWJ44";
  const [isCopied, setIsCopied] = React.useState(false);
  const [otp, setOtp] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setOtp("");
      setIsCopied(false);
    }
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(secretKey);
      setIsCopied(true);
      toast.success("Secret key copied to clipboard");
      setTimeout(() => setIsCopied(false), 2000);
    } catch {
      toast.error("Failed to copy secret key");
    }
  };

  const handleConfirm = () => {
    if (otp.length < 6) {
      toast.error("Please enter the full 6-digit verification code.");
      return;
    }
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-120 overflow-hidden p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>Setup Authenticator App</DialogTitle>
          <DialogDescription>
            Each time you log in, in addition to your password, you'll use an
            authenticator app to generate a one-time code.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 px-6 pb-6">
          {/* Step 1 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="border-primary/20 bg-primary/5 text-primary inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-[0.625rem] font-medium">
                Step 1
              </span>
              <h4 className="text-foreground text-xs font-semibold">
                Scan QR code
              </h4>
            </div>
            <p className="text-muted-foreground text-xs leading-normal">
              Scan the QR code below or manually enter the secret key into your
              authenticator app.
            </p>

            {/* QR block */}
            <div className="border-border/80 bg-muted/20 flex gap-4 rounded-xl border p-4">
              <div className="border-border/80 flex size-28 shrink-0 items-center justify-center rounded-lg border bg-white p-2">
                <img src={qrUrl} alt="QR Code" width={300} height={300} />
              </div>
              <div className="flex flex-col justify-between py-0.5">
                <div className="space-y-1">
                  <h5 className="text-foreground text-[0.6875rem] font-semibold">
                    Can't scan QR code?
                  </h5>
                  <p className="text-muted-foreground text-[0.625rem]">
                    Enter this secret instead:
                  </p>
                </div>

                <div className="mt-2 space-y-2">
                  <div className="border-border/60 bg-muted/65 text-foreground w-fit rounded-md border px-2 py-1 font-mono text-[0.6875rem] font-semibold tracking-wider uppercase select-all">
                    {secretKey}
                  </div>

                  <Button
                    variant="outline"
                    className="inline-flex h-8 items-center gap-1.5 px-3 text-xs font-medium"
                    onClick={handleCopy}
                  >
                    <HugeiconsIcon
                      icon={isCopied ? CheckmarkCircle02Icon : Copy01Icon}
                      className={`size-3.5 transition-colors ${
                        isCopied
                          ? "text-emerald-600 dark:text-emerald-400"
                          : "text-muted-foreground"
                      }`}
                    />
                    {isCopied ? "Copied!" : "Copy code"}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="border-primary/20 bg-primary/5 text-primary inline-flex items-center justify-center rounded-full border px-2.5 py-0.5 text-[0.625rem] font-medium">
                Step 2
              </span>
              <h4 className="text-foreground text-xs font-semibold">
                Get verification Code
              </h4>
            </div>
            <p className="text-muted-foreground text-xs leading-normal">
              Enter the 6-digit code you see in your authenticator app.
            </p>

            <div className="space-y-2 pt-1.5">
              <Label className="text-foreground text-[0.6875rem] font-semibold">
                Enter verification code
              </Label>

              <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                <InputOTPGroup className="gap-2">
                  {Array.from({ length: 6 }, () => crypto.randomUUID()).map(
                    (id, i) => (
                      <InputOTPSlot
                        key={id}
                        index={i}
                        placeholder="0"
                        className="border-input bg-card data-[active=true]:border-ring data-[active=true]:ring-ring/30 size-9 rounded-lg border border-l text-center font-mono text-sm font-semibold first:rounded-lg last:rounded-lg data-[active=true]:ring-2"
                      />
                    )
                  )}
                </InputOTPGroup>
              </InputOTP>
            </div>
          </div>
        </div>

        <DialogFooter className="bg-muted/20 border-border/60 border-t px-6 py-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-card h-8 px-4 text-xs font-medium"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleConfirm}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-8 px-4 text-xs font-medium"
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
