export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-brand-navy text-white border-t border-brand-navy/20 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Brand Section */}
          <div className="flex flex-col gap-3">
            <img src="/manus-storage/ChatGPTImageJul4,2026,02_27_01PM_4abfa799.png" alt="Pathways 360" className="h-8 w-auto" />
            <p className="text-sm text-white/80">
              Coordinate care. Improve outcomes. Transform lives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/resources" className="hover:text-white transition-colors">Find Resources</a></li>
              <li><a href="/community-events" className="hover:text-white transition-colors">Community Events</a></li>
            </ul>
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
