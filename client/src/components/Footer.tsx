import { Link } from "wouter";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-background mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About Section */}
          <div>
            <h3 className="font-bold text-sm mb-3">About This Research</h3>
            <p className="text-sm text-muted-foreground">
              Complete research package for The Social Hub's 4-star transformation and membership model strategy.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Research completed:</strong> October 18, 2025
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-sm mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/data-sources">
                  <a className="text-muted-foreground hover:text-[#76a9f9] transition-colors">
                    Data Sources
                  </a>
                </Link>
              </li>
              <li>
                <Link href="/personas">
                  <a className="text-muted-foreground hover:text-[#76a9f9] transition-colors">
                    Methodology
                  </a>
                </Link>
              </li>
              <li>
                <a 
                  href="https://www.thesocialhub.co/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-[#76a9f9] transition-colors"
                >
                  The Social Hub Website
                </a>
              </li>
            </ul>
          </div>

          {/* Research Stats */}
          <div>
            <h3 className="font-bold text-sm mb-3">Research Coverage</h3>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>8 hospitality brands analyzed</li>
              <li>8 platforms per brand</li>
              <li>55+ successful research subtasks</li>
              <li>10,000+ reviews analyzed</li>
              <li>Europe-wide focus (8 countries)</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground">
          <p>
            TSH Research Platform © 2025 | Last Updated: October 18, 2025
          </p>
        </div>
      </div>
    </footer>
  );
}

