import { useEffect, useRef, useState } from "react";
import { CheckCircle, Landmark, LoaderCircle } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { startBankConnection } from "@/data/api";

export function BankConnectionDialog() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "connected" | "error">("idle");
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  async function connect() {
    setStatus("loading");
    try {
      await startBankConnection();
      if (!mounted.current) return;
      setStatus("connected");
      toast.success("Connected (demo)");
      await new Promise<void>((resolve) => setTimeout(resolve, 700));
      if (mounted.current) setOpen(false);
    } catch { if (mounted.current) setStatus("error"); }
  }
  return <>
    <Button onClick={() => { setStatus("idle"); setOpen(true); }}><Landmark />Connect a bank</Button>
    <Dialog open={open} onOpenChange={(next) => { if (status !== "loading" && status !== "connected") setOpen(next); }}>
      <DialogContent className="bg-card">
        <DialogHeader><DialogTitle>Connect a bank</DialogTitle><DialogDescription>Securely link another bank to see all your accounts in one place. Demo mode uses test data only.</DialogDescription></DialogHeader>
        {status === "error" && <p role="alert" className="text-sm text-risk">Couldn't connect. Please try again.</p>}
        <Button onClick={() => void connect()} disabled={status === "loading" || status === "connected"}>{status === "loading" ? <><LoaderCircle className="animate-spin" />Connecting…</> : status === "connected" ? <><CheckCircle />Connected (demo)</> : "Continue"}</Button>
      </DialogContent>
    </Dialog>
  </>;
}