import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, MapPin, Phone, Lock, Globe, Eye, Moon, Sun, Save, Mail, X, EyeOff, AlertCircle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import AppSidebar from "@/components/AppSidebar";
import { useTheme } from "@/lib/theme-context";
import { toast } from "sonner";

const SettingsPage = () => {
  const { theme, toggleTheme } = useTheme();
  const [form, setForm] = useState({
    name: "Shivam Pandey",
    trackId: "shivampandey",
    email: "shivam@gmail.com",
    phone: "+91 98765 43210",
    homeAddress: "Goregaon West, Mumbai",
    officeAddress: "Andheri East, Mumbai",
    isPublic: false,
    locationEnabled: true,
  });
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pwForm, setPwForm] = useState({ old: "", new: "", confirm: "" });
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({});

  const update = (key: string, value: unknown) => setForm((f) => ({ ...f, [key]: value }));

  const handleSave = () => {
    if (!form.name || !form.email) {
      toast.error("Name and email are required");
      return;
    }
    toast.success("Settings saved successfully!");
  };

  const handlePasswordChange = () => {
    const errors: Record<string, string> = {};
    if (!pwForm.old) errors.old = "Enter current password";
    if (pwForm.new.length < 8) errors.new = "Min 8 characters required";
    if (pwForm.new !== pwForm.confirm) errors.confirm = "Passwords don't match";
    setPwErrors(errors);
    if (Object.keys(errors).length > 0) return;
    
    toast.success("Password changed successfully!");
    setShowPasswordModal(false);
    setPwForm({ old: "", new: "", confirm: "" });
    setPwErrors({});
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AppSidebar />
      <div className="flex-1 overflow-y-auto p-6 lg:p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto space-y-6"
        >
          <h1 className="text-2xl font-display font-bold">Settings</h1>

          {/* Profile */}
          <div className="glass-card-elevated p-6">
            <h2 className="text-sm font-semibold mb-4">Profile</h2>
            <div className="flex items-center gap-4 mb-5">
              <div className="relative">
                <img
                  src="https://api.dicebear.com/9.x/avataaars/svg?seed=shivam"
                  alt="Avatar"
                  className="w-16 h-16 rounded-full border-2 border-border"
                />
                <button className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full gradient-primary flex items-center justify-center border-2 border-card">
                  <Camera className="w-3 h-3 text-primary-foreground" />
                </button>
              </div>
              <div>
                <p className="font-medium">{form.name}</p>
                <p className="text-sm text-muted-foreground">@{form.trackId}</p>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Full Name</Label>
                <Input value={form.name} onChange={(e) => update("name", e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={form.email} onChange={(e) => update("email", e.target.value)} className="bg-secondary/50 pl-10" type="email" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="bg-secondary/50 pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">TrackID</Label>
                <Input value={`@${form.trackId}`} disabled className="bg-secondary/50 text-muted-foreground" />
              </div>
            </div>
          </div>

          {/* Addresses */}
          <div className="glass-card-elevated p-6">
            <h2 className="text-sm font-semibold mb-4">Addresses</h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Home Address
                </Label>
                <Input value={form.homeAddress} onChange={(e) => update("homeAddress", e.target.value)} className="bg-secondary/50" />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> Office Address
                </Label>
                <Input value={form.officeAddress} onChange={(e) => update("officeAddress", e.target.value)} className="bg-secondary/50" />
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="glass-card-elevated p-6 space-y-4">
            <h2 className="text-sm font-semibold mb-2">Privacy & Location</h2>
            <SettingToggle icon={<Globe className="w-4 h-4" />} title="Public Account" desc="Anyone can find and request to track you" checked={form.isPublic} onChange={(v) => update("isPublic", v)} />
            <SettingToggle icon={<MapPin className="w-4 h-4" />} title="Live Location" desc="Share your current location with approved users" checked={form.locationEnabled} onChange={(v) => update("locationEnabled", v)} />
          </div>

          {/* Appearance */}
          <div className="glass-card-elevated p-6">
            <h2 className="text-sm font-semibold mb-4">Appearance</h2>
            <SettingToggle
              icon={theme === "dark" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              title={theme === "dark" ? "Dark Mode" : "Light Mode"}
              desc="Toggle between light and dark themes"
              checked={theme === "dark"}
              onChange={toggleTheme}
            />
          </div>

          {/* Security */}
          <div className="glass-card-elevated p-6">
            <h2 className="text-sm font-semibold mb-4">Security</h2>
            <Button variant="outline" className="w-full justify-start gap-2 border-border/50" onClick={() => setShowPasswordModal(true)}>
              <Lock className="w-4 h-4" /> Change Password
            </Button>
          </div>

          <Button onClick={handleSave} className="w-full h-11 gradient-primary text-primary-foreground font-semibold glow-primary">
            <Save className="w-4 h-4 mr-2" /> Save Changes
          </Button>
        </motion.div>
      </div>

      {/* Password Change Modal */}
      <AnimatePresence>
        {showPasswordModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setShowPasswordModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card border border-border/50 rounded-2xl p-6 w-full max-w-sm mx-4 shadow-2xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-lg">Change Password</h3>
                <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => setShowPasswordModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">Current Password</Label>
                  <div className="relative">
                    <Input
                      type={showOld ? "text" : "password"}
                      value={pwForm.old}
                      onChange={(e) => { setPwForm(f => ({ ...f, old: e.target.value })); setPwErrors(er => ({ ...er, old: "" })); }}
                      className="bg-secondary/50 pr-10"
                    />
                    <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {pwErrors.old && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {pwErrors.old}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">New Password</Label>
                  <div className="relative">
                    <Input
                      type={showNew ? "text" : "password"}
                      value={pwForm.new}
                      onChange={(e) => { setPwForm(f => ({ ...f, new: e.target.value })); setPwErrors(er => ({ ...er, new: "" })); }}
                      className="bg-secondary/50 pr-10"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {pwErrors.new && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {pwErrors.new}</p>}
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">Confirm New Password</Label>
                  <Input
                    type="password"
                    value={pwForm.confirm}
                    onChange={(e) => { setPwForm(f => ({ ...f, confirm: e.target.value })); setPwErrors(er => ({ ...er, confirm: "" })); }}
                    className="bg-secondary/50"
                  />
                  {pwErrors.confirm && <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {pwErrors.confirm}</p>}
                </div>
              </div>
              <div className="flex gap-3 mt-6">
                <Button variant="outline" className="flex-1" onClick={() => setShowPasswordModal(false)}>Cancel</Button>
                <Button className="flex-1 gradient-primary text-primary-foreground" onClick={handlePasswordChange}>
                  <Check className="w-4 h-4 mr-1" /> Update Password
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

function SettingToggle({
  icon, title, desc, checked, onChange,
}: {
  icon: React.ReactNode; title: string; desc: string; checked: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl bg-secondary/30">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground">{icon}</div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export default SettingsPage;
