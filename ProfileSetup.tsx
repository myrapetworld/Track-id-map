import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Camera, MapPin, Phone, User, Globe, Lock, Check, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const steps = ["Identity", "Contact", "Location", "Privacy"];

const ProfileSetup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    fullName: "",
    trackId: "",
    phone: "",
    homeAddress: "",
    officeAddress: "",
    isPublic: false,
    locationEnabled: true,
    avatar: null as string | null,
  });

  const handleAvatarClick = () => {
    setForm((f) => ({ ...f, avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=user" }));
    toast.success("Profile photo set!");
  };

  const handleNext = () => {
    if (step === 0) {
      if (!form.fullName || !form.trackId) {
        toast.error("Please fill in all fields");
        return;
      }
      if (form.trackId.length < 6) {
        toast.error("TrackID must be at least 6 characters");
        return;
      }
      if (!/[a-zA-Z]/.test(form.trackId) || !/[0-9]/.test(form.trackId)) {
        toast.error("TrackID must include both letters and numbers");
        return;
      }
    }
    if (step === 1 && !form.phone) {
      toast.error("Please enter your phone number");
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      toast.success("Profile setup complete!");
      navigate("/dashboard");
    }
  };

  const update = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg px-4"
      >
        <div className="text-center mb-6">
          <h1 className="text-2xl font-display font-bold">Complete Your Profile</h1>
          <p className="text-muted-foreground text-sm mt-1">Step {step + 1} of 4</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex-1 flex flex-col items-center gap-1">
              <div className={`h-1.5 w-full rounded-full transition-all duration-500 ${i <= step ? "gradient-primary" : "bg-secondary"}`} />
              <span className={`text-[10px] font-medium ${i <= step ? "text-primary" : "text-muted-foreground"}`}>
                {s}
              </span>
            </div>
          ))}
        </div>

        <div className="glass-card-elevated p-6">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <div className="space-y-5">
                <div className="flex justify-center">
                  <button
                    onClick={handleAvatarClick}
                    className="relative w-24 h-24 rounded-full bg-secondary border-2 border-dashed border-border hover:border-primary transition-colors flex items-center justify-center group overflow-hidden"
                  >
                    {form.avatar ? (
                      <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <Camera className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors" />
                    )}
                    <div className="absolute inset-0 bg-foreground/10 opacity-0 group-hover:opacity-100 rounded-full transition-opacity flex items-center justify-center">
                      <Camera className="w-5 h-5 text-accent-foreground" />
                    </div>
                  </button>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Shivam Pandey"
                      className="pl-10 bg-secondary/50"
                      value={form.fullName}
                      onChange={(e) => update("fullName", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Unique Track ID</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                    <Input
                      placeholder="shivampandey"
                      className="pl-8 bg-secondary/50"
                      value={form.trackId}
                      onChange={(e) => update("trackId", e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ""))}
                    />
                  </div>
                  {form.trackId && form.trackId.length >= 6 && /[a-zA-Z]/.test(form.trackId) && /[0-9]/.test(form.trackId) && (
                    <p className="text-xs text-primary flex items-center gap-1">
                      <Check className="w-3 h-3" /> @{form.trackId} is available
                    </p>
                  )}
                  <p className="text-[11px] text-muted-foreground">
                    Min 6 chars, must include letters & numbers (e.g., shivam123)
                  </p>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="+91 98765 43210"
                      className="pl-10 bg-secondary/50"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </div>
                </div>
                <div className="glass-card p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">OTP Verification</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      We'll send a verification code to your phone number for security.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Home Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter your home address"
                      className="pl-10 bg-secondary/50"
                      value={form.homeAddress}
                      onChange={(e) => update("homeAddress", e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Office Address</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter your office address"
                      className="pl-10 bg-secondary/50"
                      value={form.officeAddress}
                      onChange={(e) => update("officeAddress", e.target.value)}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-between glass-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                      <MapPin className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Enable Location</p>
                      <p className="text-xs text-muted-foreground">Share your live location</p>
                    </div>
                  </div>
                  <Switch
                    checked={form.locationEnabled}
                    onCheckedChange={(v) => update("locationEnabled", v)}
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between glass-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                      <Globe className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Public Account</p>
                      <p className="text-xs text-muted-foreground">Anyone can find you</p>
                    </div>
                  </div>
                  <Switch
                    checked={form.isPublic}
                    onCheckedChange={(v) => update("isPublic", v)}
                  />
                </div>
                <div className="flex items-center justify-between glass-card p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                      <Lock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Private Account</p>
                      <p className="text-xs text-muted-foreground">Only approved users can track</p>
                    </div>
                  </div>
                  <Switch
                    checked={!form.isPublic}
                    onCheckedChange={(v) => update("isPublic", !v)}
                  />
                </div>
                <div className="glass-card p-4 border-primary/20">
                  <p className="text-xs text-muted-foreground text-center">
                    You can always change privacy settings later.
                  </p>
                </div>
              </div>
            )}
          </motion.div>

          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1 h-11 border-border/50"
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              className="flex-1 h-11 gradient-primary text-primary-foreground font-semibold glow-primary"
            >
              {step === 3 ? "Complete Setup" : "Continue"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfileSetup;
