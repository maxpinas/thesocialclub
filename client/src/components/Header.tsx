import { Link } from "wouter";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BRANDS } from "@/types/data";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [brandsOpen, setBrandsOpen] = useState(false);
  const [sentimentOpen, setSentimentOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <a className="flex items-center space-x-3">
            <img src="/tsh-logo.png" alt="The Social Hub" className="h-10 w-10" />
            <span className="font-bold text-lg hidden sm:inline">TSH Research</span>
          </a>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className="text-sm font-medium hover:text-[#76a9f9] transition-colors">
              Landing
            </a>
          </Link>
          
          <Link href="/summary">
            <a className="text-sm font-medium hover:text-[#76a9f9] transition-colors">
              Summary
            </a>
          </Link>

          {/* Brands Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setBrandsOpen(true)}
            onMouseLeave={() => setBrandsOpen(false)}
          >
            <button className="text-sm font-medium hover:text-[#76a9f9] transition-colors py-2">
              Brands ▼
            </button>
            {brandsOpen && (
              <div className="absolute top-full left-0 -mt-1 pt-3 w-56 z-50">
                <div className="bg-background border border-border rounded-lg shadow-lg py-2">
                  <Link href="/brands">
                    <a className="block px-4 py-2 text-sm hover:bg-muted">
                      Overview
                    </a>
                  </Link>
                  <div className="border-t border-border my-2"></div>
                  {BRANDS.map((brand) => (
                    <Link key={brand.id} href={`/brands/${brand.id}`}>
                      <a className="block px-4 py-2 text-sm hover:bg-muted">
                        {brand.name}
                      </a>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Link href="/personas">
            <a className="text-sm font-medium hover:text-[#76a9f9] transition-colors">
              Personas
            </a>
          </Link>

          {/* Sentiment Dropdown */}
          <div 
            className="relative"
            onMouseEnter={() => setSentimentOpen(true)}
            onMouseLeave={() => setSentimentOpen(false)}
          >
            <button className="text-sm font-medium hover:text-[#76a9f9] transition-colors py-2">
              Sentiment ▼
            </button>
            {sentimentOpen && (
              <div className="absolute top-full left-0 -mt-1 pt-3 w-56 z-50">
                <div className="bg-background border border-border rounded-lg shadow-lg py-2">
                  <Link href="/sentiment">
                    <a className="block px-4 py-2 text-sm hover:bg-muted">
                      Overview
                    </a>
                  </Link>
                  <div className="border-t border-border my-2"></div>
                  {BRANDS.map((brand) => (
                    <Link key={brand.id} href={`/sentiment/${brand.id}`}>
                      <a className="block px-4 py-2 text-sm hover:bg-muted">
                        {brand.name}
                      </a>
                    </Link>
                  ))}
                  <div className="border-t border-border my-2"></div>
                  <Link href="/sentiment/dis-loyalty">
                    <a className="block px-4 py-2 text-sm hover:bg-muted">
                      Dis-loyalty Program
                    </a>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border">
          <nav className="container py-4 flex flex-col space-y-3">
            <Link href="/">
              <a className="text-sm font-medium hover:text-[#76a9f9]" onClick={() => setMobileMenuOpen(false)}>
                Landing
              </a>
            </Link>
            <Link href="/summary">
              <a className="text-sm font-medium hover:text-[#76a9f9]" onClick={() => setMobileMenuOpen(false)}>
                Summary
              </a>
            </Link>
            <Link href="/brands">
              <a className="text-sm font-medium hover:text-[#76a9f9]" onClick={() => setMobileMenuOpen(false)}>
                Brands
              </a>
            </Link>
            <Link href="/personas">
              <a className="text-sm font-medium hover:text-[#76a9f9]" onClick={() => setMobileMenuOpen(false)}>
                Personas
              </a>
            </Link>
            <Link href="/sentiment">
              <a className="text-sm font-medium hover:text-[#76a9f9]" onClick={() => setMobileMenuOpen(false)}>
                Sentiment
              </a>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

