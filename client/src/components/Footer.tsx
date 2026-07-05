import { Mail, Linkedin, Twitter, Facebook } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "sonner";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
      return;
    }
    setIsSubscribing(true);
    try {
      // TODO: Implement newsletter subscription API call
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success("Thanks for subscribing!");
      setEmail("");
    } catch (error) {
      toast.error("Failed to subscribe. Please try again.");
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-brand-navy text-white border-t border-brand-navy/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Section */}
          <div className="flex flex-col gap-3">
            <img src="/manus-storage/ChatGPTImageJul4,2026,02_27_01PM_4abfa799.png" alt="Pathways 360" className="h-10 w-auto object-contain" />
            <p className="text-sm text-white/80">
              Coordinate care. Improve outcomes. Transform lives.
            </p>
            {/* Social Media Links */}
            <div className="flex gap-3 mt-2">
              <a href="#" className="text-white/60 hover:text-white transition-colors" title="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors" title="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-white/60 hover:text-white transition-colors" title="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/resources" className="hover:text-white transition-colors">Find Resources</a></li>
              <li><a href="/community-events" className="hover:text-white transition-colors">Community Events</a></li>
            </ul>
          </div>

          {/* Newsletter Signup */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Stay Updated</h3>
            <p className="text-sm text-white/70 mb-3">Subscribe to our newsletter for updates and resources.</p>
            <form onSubmit={handleNewsletterSignup} className="flex flex-col gap-2">
              <div className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 text-sm"
                  disabled={isSubscribing}
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-brand-teal hover:bg-brand-teal/90 text-white"
                  disabled={isSubscribing}
                >
                  <Mail className="w-4 h-4" />
                </Button>
              </div>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <p className="text-sm text-white/60 text-center">
            © {currentYear} Pathways 360. All rights reserved. | You don't have to walk alone.
          </p>
        </div>
      </div>
    </footer>
  );
}
