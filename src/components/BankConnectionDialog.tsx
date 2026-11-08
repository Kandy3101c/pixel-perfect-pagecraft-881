import { useEffect, useRef, useState } from "react";
import { CheckCircle, Plus, LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { connectBank, useInstitutions } from "@/data/api";

export function BankConnectionDialog() {
  const institutions = useInstitutions();
  const allConnected = institutions.some((bank) => bank.id === "inst_platypus" && bank.status === "synced");
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "connected" | "error">("idle");
  const mounted = useRef(true);
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; }; }, []);
  async function connect() {
    setStatus("loading");
    try {
      await connectBank();
      if (!mounted.current) return;
      setStatus("connected");
      await new Promise<void>((resolve) => setTimeout(resolve, 700));
      if (mounted.current) setOpen(false);
    } catch { if (mounted.current) setStatus("error"); }
  }
  return <>
    <Button variant="outline" className="h-auto min-h-16 border-dashed bg-card px-4 py-3" onClick={() => { setStatus("idle"); setOpen(true); }}><Plus />Connect a bank</Button>
    <Dialog open={open} onOpenChange={(next) => { if (status !== "loading" && status !== "connected") setOpen(next); }}>
      <DialogContent className="bg-card">
        <DialogHeader><DialogTitle>Connect a bank</DialogTitle><DialogDescription>{allConnected ? "All demo banks are connected." : "Connect First Platypus Bank via Plaid. This is a simulated connection using demo accounts only."}</DialogDescription></DialogHeader>
        {status === "error" && <p role="alert" className="text-sm text-risk">Couldn't connect. Please try again.</p>}
        {!allConnected && <Button onClick={() => void connect()} disabled={status === "loading" || status === "connected" || institutions.some((bank) => bank.id === "inst_platypus" && bank.status === "syncing")}>{status === "loading" ? <><LoaderCircle className="motion-safe:animate-spin" />Connecting…</> : status === "connected" ? <><CheckCircle />Connected (demo)</> : "Continue"}</Button>}
      </DialogContent>
    </Dialog>
  </>;
}