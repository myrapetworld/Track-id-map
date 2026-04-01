import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { MapPin, Mail, Lock, Eye, EyeOff, Chrome, AlertCircle, Info, Phone, User, Globe, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useUser } from "@/lib/user-context";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupName, setSignupName] = useState("");
  const [signupTrackId, setSignupTrackId] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [accountType, setAccountType] = useState<"public" | "private">("private");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateTrackId = (id: string): string | null => {
    if (id.length < 6) return "TrackID must be at least 6 characters";
    if (!/[a-zA-Z]/.test(id)) return "TrackID must include letters";
    if (!/[0-9]/.test(id)) return "TrackID must include numbers";
    if (!/^[a-zA-Z0-9._]+$/.test(id)) return "Only letters, numbers, dots and underscores allowed";
    return null;
  };

  const validatePassword = (pw: string): string | null => {
    if (pw.length < 8) return "Password must be at least 8 characters";
    if (!/[A-Z]/.test(pw)) return "Must include an uppercase letter";
    if (!/[0-9]/.test(pw)) return "Must include a number";
    return null;
  };

  const validatePhone = (ph: string): string | null => {
    const digits = ph.replace(/\D/g, "");
    if (digits.length < 10) return "Phone number must be at least 10 digits";
    return null;
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const saved = localStorage.getItem("trackid_user");
    if (saved) {
      const u = JSON.parse(saved);
      setUser(u);
    }
    toast.success("Logged in successfully!");
    navigate("/dashboard");
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    if (!signupName) newErrors.signupName = "Name is required";
    if (!signupEmail) newErrors.signupEmail = "Email is required";

    const phoneError = validatePhone(signupPhone);
    if (!signupPhone) newErrors.signupPhone = "Phone number is required";
    else if (phoneError) newErrors.signupPhone = phoneError;

    const trackIdError = validateTrackId(signupTrackId);
    if (!signupTrackId) newErrors.signupTrackId = "TrackID is required";
    else if (trackIdError) newErrors.signupTrackId = trackIdError;

    const pwError = validatePassword(signupPassword);
    if (!signupPassword) newErrors.signupPassword = "Password is required";
    else if (pwError) newErrors.signupPassword = pwError;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const profile = {
      fullName: signupName,
      email: signupEmail,
      phone: signupPhone,
      trackId: signupTrackId,
      accountType,
      avatar: `https://api.dicebear.com/9.x/avataaars/svg?seed=${signupTrackId}`,
      homeAddress: "",
      officeAddress: "",
      locationEnabled: true,
    };
    setUser(profile);
    toast.success("Account created! Welcome to TrackID Map.");
    navigate("/dashboard");
  };

  const handleGoogleLogin = () => {
    setUser({
      fullName: "Google User",
      email: "user@gmail.com",
      phone: "",
      trackId: "googleuser1",
      accountType: "public",
      avatar: "https://api.dicebear.com/9.x/avataaars/svg?seed=google",
      homeAddress: "",
      officeAddress: "",
      locationEnabled: true,
    });
    toast.success("Google login successful!");
    navigate("/dashboard");
  };

  const FieldError = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="text-xs text-destructive flex items-center gap-1 mt-1">
        <AlertCircle className="w-3 h-3" /> {errors[field]}
      </p>
    ) : null;

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 rounded-full bg-primary/10 blur-3xl animate-float" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent/10 blur-3xl animate-float" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/5 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4 glow-primary"
          >
            <MapPin className="w-8 h-8 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-display font-bold tracking-tight">
            Track<span className="gradient-text">ID</span> Map
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Secure location sharing with short, memorable IDs
          </p>
        </div>

        <div className="glass-card-elevated p-6">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 bg-secondary">
              <TabsTrigger value="login" className="data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="data-[state=active]:bg-card data-[state=active]:shadow-sm font-medium">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="email" type="email" placeholder="you@example.com" className="pl-10 bg-secondary/50 border-border/50 focus:border-primary" value={email} onChange={(e) => { setEmail(e.target.value); setErrors(er => ({ ...er, email: "" })); }} />
                  </div>
                  <FieldError field="email" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input id="password" type={showPassword ? "text" : "password"} placeholder="••••••••" className="pl-10 pr-10 bg-secondary/50 border-border/50 focus:border-primary" value={password} onChange={(e) => { setPassword(e.target.value); setErrors(er => ({ ...er, password: "" })); }} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <FieldError field="password" />
                </div>
                <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-11 glow-primary">Sign In</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={handleSignup} className="space-y-3">
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Your full name" className="pl-10 bg-secondary/50 border-border/50" value={signupName} onChange={(e) => { setSignupName(e.target.value); setErrors(er => ({ ...er, signupName: "" })); }} />
                  </div>
                  <FieldError field="signupName" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type="email" placeholder="you@example.com" className="pl-10 bg-secondary/50 border-border/50" value={signupEmail} onChange={(e) => { setSignupEmail(e.target.value); setErrors(er => ({ ...er, signupEmail: "" })); }} />
                  </div>
                  <FieldError field="signupEmail" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="9876543210" className="pl-10 bg-secondary/50 border-border/50" value={signupPhone} onChange={(e) => { setSignupPhone(e.target.value.replace(/[^0-9+\s-]/g, "")); setErrors(er => ({ ...er, signupPhone: "" })); }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Info className="w-3 h-3" /> Must be at least 10 digits</p>
                  <FieldError field="signupPhone" />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Unique TrackID</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">@</span>
                    <Input placeholder="shivam123" className="pl-8 bg-secondary/50 border-border/50" value={signupTrackId} onChange={(e) => { const val = e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ""); setSignupTrackId(val); setErrors(er => ({ ...er, signupTrackId: "" })); }} />
                  </div>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Info className="w-3 h-3" /> Min 6 chars, letters + numbers (e.g., shivam123)</p>
                  <FieldError field="signupTrackId" />
                </div>

                {/* Account Type Toggle */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Account Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setAccountType("public")}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all border ${accountType === "public" ? "gradient-primary text-primary-foreground border-transparent shadow-sm" : "bg-secondary/50 text-muted-foreground border-border/50 hover:bg-secondary"}`}>
                      <Globe className="w-3.5 h-3.5" /> Public
                    </button>
                    <button type="button" onClick={() => setAccountType("private")}
                      className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-semibold transition-all border ${accountType === "private" ? "gradient-primary text-primary-foreground border-transparent shadow-sm" : "bg-secondary/50 text-muted-foreground border-border/50 hover:bg-secondary"}`}>
                      <ShieldCheck className="w-3.5 h-3.5" /> Private
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input type={showSignupPassword ? "text" : "password"} placeholder="Min 8 characters" className="pl-10 pr-10 bg-secondary/50 border-border/50" value={signupPassword} onChange={(e) => { setSignupPassword(e.target.value); setErrors(er => ({ ...er, signupPassword: "" })); }} />
                    <button type="button" onClick={() => setShowSignupPassword(!showSignupPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                      {showSignupPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Info className="w-3 h-3" /> Min 8 chars, 1 uppercase, 1 number</p>
                  <FieldError field="signupPassword" />
                </div>
                <Button type="submit" className="w-full gradient-primary text-primary-foreground font-semibold h-11 glow-primary">Create Account</Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
            </div>
            <Button variant="outline" className="w-full mt-4 h-11 border-border/50 hover:bg-secondary/50" onClick={handleGoogleLogin}>
              <Chrome className="w-4 h-4 mr-2" /> Google
            </Button>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          By continuing, you agree to our Terms of Service & Privacy Policy
        </p>
      </motion.div>
    </div>
  );
};

export default LoginPage;
