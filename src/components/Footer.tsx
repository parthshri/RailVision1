import Link from "next/link";
import { Github, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="footer">
      <div>
        <div className="brand footer-brand">
          <span className="brand-mark">RV</span>
          <span>RailVision</span>
        </div>
        <p>
          Building safer railways and brighter STEM classrooms with AI-powered inspection
          systems and hands-on learning kits.
        </p>
      </div>
      <div>
        <h3>Explore</h3>
        <Link href="/railvision-pro">RailVision Pro</Link>
        <Link href="/railvision-junior">RailVision Junior</Link>
        <Link href="/shop">Shop</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/refund-policy">Refund Policy</Link>
      </div>
        <div className="social-links">
          <a
            href="https://x.com/railvisionpro"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Twitter />
          </a>

          <a
            href="https://instagram.com/railvisionpro"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram />
          </a>
        </div>


      
    </footer>
  );
}
