import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-white text-primary-text py-12 mt-12 border-t border-neutral-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-display font-semibold mb-4">HomeQuest</h3>
            <p className="text-muted font-ui">Your trusted real-estate platform</p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 font-ui">Quick Links</h4>
            <ul className="text-muted space-y-2 font-ui">
              <li><Link to="/home" className="hover:text-white">Home</Link></li>
              <li><Link to="/home" className="hover:text-white">Properties</Link></li>
              <li><Link to="/insights" className="hover:text-white">Insights</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 font-ui">Support</h4>
            <ul className="text-muted space-y-2 font-ui">
              <li><Link to="/contact" className="hover:text-white">Contact Us</Link></li>
              <li><Link to="/faq" className="hover:text-white">FAQ</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 font-ui">Legal</h4>
            <ul className="text-muted space-y-2 font-ui">
              <li><Link to="/privacy-terms" className="hover:text-white">Privacy & Terms</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-200 mt-8 pt-8 text-center text-muted font-ui">
          <p>&copy; 2025 HomeQuest. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
