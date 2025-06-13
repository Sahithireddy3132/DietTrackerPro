import { Link } from 'wouter';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Features',
      links: [
        { label: 'AI Diet Plans', href: '#nutrition' },
        { label: 'Workout Tutorials', href: '#workouts' },
        { label: 'Progress Tracking', href: '#progress' },
        { label: 'AI Chatbot', href: '#ai-chat' },
        { label: 'Gym Locator', href: '#gym-locator' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { label: 'Help Center', href: '#' },
        { label: 'Getting Started', href: '#' },
        { label: 'Workout Library', href: '#workouts' },
        { label: 'Nutrition Guide', href: '#nutrition' },
        { label: 'Success Stories', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About Us', href: '#' },
        { label: 'Careers', href: '#' },
        { label: 'Press', href: '#' },
        { label: 'Blog', href: '#' },
        { label: 'Partners', href: '#' },
      ],
    },
    {
      title: 'Support',
      links: [
        { label: 'Contact Us', href: '#' },
        { label: 'Privacy Policy', href: '#' },
        { label: 'Terms of Service', href: '#' },
        { label: 'Cookie Policy', href: '#' },
        { label: 'FAQ', href: '#' },
      ],
    },
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      href: '#',
      icon: 'fab fa-facebook-f',
    },
    {
      name: 'Twitter',
      href: '#',
      icon: 'fab fa-twitter',
    },
    {
      name: 'Instagram',
      href: '#',
      icon: 'fab fa-instagram',
    },
    {
      name: 'YouTube',
      href: '#',
      icon: 'fab fa-youtube',
    },
    {
      name: 'LinkedIn',
      href: '#',
      icon: 'fab fa-linkedin-in',
    },
  ];

  const handleLinkClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <footer className="bg-gradient-to-t from-gray-900 to-dark-bg py-12 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-electric to-neon-green rounded-full animate-pulse-electric"></div>
              <span className="text-xl font-bold gradient-text">FitZone Pro</span>
            </Link>
            <p className="text-gray-400 text-sm mb-4">
              Transform your fitness journey with AI-powered personalization and expert guidance.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-electric hover:text-dark-bg transition-all duration-300 group"
                  aria-label={social.name}
                >
                  <i className={`${social.icon} text-sm group-hover:scale-110 transition-transform`}></i>
                </a>
              ))}
            </div>
          </div>
          
          {/* Footer Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold mb-4 text-white">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith('#') ? (
                      <button
                        onClick={() => handleLinkClick(link.href)}
                        className="text-sm text-gray-400 hover:text-electric transition-colors cursor-pointer"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <a
                        href={link.href}
                        className="text-sm text-gray-400 hover:text-electric transition-colors"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        {/* Newsletter Signup */}
        <div className="border-t border-gray-800 pt-8 mb-8">
          <div className="max-w-md mx-auto text-center">
            <h3 className="text-lg font-semibold mb-2">Stay Motivated</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get weekly fitness tips, workout plans, and motivation delivered to your inbox.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-electric focus:border-transparent text-sm"
              />
              <button className="bg-gradient-to-r from-electric to-neon-green text-dark-bg px-6 py-2 rounded-lg hover:shadow-lg hover:shadow-electric/30 transition-all text-sm font-medium">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                &copy; {currentYear} FitZone Pro. All rights reserved.
              </p>
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <a href="#" className="hover:text-electric transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-electric transition-colors">
                Terms of Service
              </a>
              <a href="#" className="hover:text-electric transition-colors">
                Cookie Settings
              </a>
            </div>
          </div>
          
          {/* Attribution */}
          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Powered by AI • Built with ❤️ for fitness enthusiasts
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
