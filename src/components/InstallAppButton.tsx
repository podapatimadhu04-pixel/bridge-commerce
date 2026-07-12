import { useEffect, useState } from "react";
import { Download, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function InstallAppButton({ className }: { className?: string }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    if (window.matchMedia?.("(display-mode: standalone)").matches) setInstalled(true);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed) return null;

  const handleInstall = async () => {
    if (deferred) {
      await deferred.prompt();
      await deferred.userChoice;
      setDeferred(null);
    } else {
      setOpen(true);
    }
  };

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleInstall}
        className={className}
        aria-label="Download app"
      >
        <Download className="h-4 w-4" />
        <span className="ml-1.5 hidden sm:inline">Get app</span>
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Smartphone className="h-5 w-5" /> Install OrbitMarket
            </DialogTitle>
            <DialogDescription>
              Add OrbitMarket to your home screen for a faster, app-like experience.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div>
              <p className="font-semibold">iPhone / iPad (Safari)</p>
              <ol className="ml-5 list-decimal text-muted-foreground">
                <li>Tap the Share icon</li>
                <li>Choose “Add to Home Screen”</li>
                <li>Tap “Add”</li>
              </ol>
            </div>
            <div>
              <p className="font-semibold">Android (Chrome)</p>
              <ol className="ml-5 list-decimal text-muted-foreground">
                <li>Open the browser menu (⋮)</li>
                <li>Tap “Install app” or “Add to Home screen”</li>
              </ol>
            </div>
            <div>
              <p className="font-semibold">Desktop (Chrome / Edge)</p>
              <ol className="ml-5 list-decimal text-muted-foreground">
                <li>Click the install icon in the address bar</li>
                <li>Confirm “Install”</li>
              </ol>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
