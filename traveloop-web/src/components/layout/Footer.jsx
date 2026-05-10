import { Link } from 'react-router-dom';
import { Plane, MessageCircle, Camera, Users, Video, Mail, MapPin, Phone } from 'lucide-react';

const footerLinks = {
  Product: [
    { label: 'Features', to: '/#features' },
    { label: 'Pricing', to: '/#pricing' },
    { label: 'Roadmap', to: '/#roadmap' },
    { label: 'Changelog', to: '/#changelog' },
  ],
  Company: [
    { label: 'About Us', to: '/about' },
    { label: 'Blog', to: '/blog' },
    { label: 'Careers', to: '/careers' },
    { label: 'Press', to: '/press' },
  ],
  Support: [
    { label: 'Help Center', to: '/help' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Contact Us', to: '/contact' },
  ],
};

const socials = [
  { icon: MessageCircle, href: '#', label: 'Twitter' },
  { icon: Camera, href: '#', label: 'Instagram' },
  { icon: Users, href: '#', label: 'Facebook' },
  { icon: Video, href: '#', label: 'YouTube' },
];

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center shadow-primary">
                <Plane size={18} className="text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Travel<span className="gradient-text">oop</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              The ultimate travel planning companion. Plan, organize, and experience your dream trips with intelligent tools.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-primary flex-shrink-0" />
                <span>San Francisco, CA 94105</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-primary flex-shrink-0" />
                <a href="mailto:hello@traveloop.com" className="hover:text-white transition-colors">hello@traveloop.com</a>
              </div>
              <div className="flex items-center gap-2">
                <Phone size={14} className="text-primary flex-shrink-0" />
                <span>+1 (800) TRAVEL-00</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-white font-semibold text-sm mb-4">{category}</h4>
              <ul className="space-y-3">
                {links.map(({ label, to }) => (
                  <li key={label}>
                    <Link
                      to={to}
                      className="text-sm hover:text-white transition-colors hover:translate-x-1 inline-block transition-transform"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs">
            © {new Date().getFullYear()} Traveloop, Inc. All rights reserved. Built with ❤️ for travelers.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="w-8 h-8 bg-white/5 hover:bg-primary/20 hover:text-primary rounded-lg flex items-center justify-center transition-all duration-200"
              >
                <Icon size={15} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
