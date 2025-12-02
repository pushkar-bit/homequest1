import React from 'react';
import { Mail, Phone, MapPin, User } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen py-12 bg-neutral-50 dark:bg-slate-900">
      <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-slate-800 rounded-lg shadow">
        <h1 className="text-2xl font-semibold mb-4" style={{ color: '#DC143C' }}>Contact Us</h1>

        <p className="text-sm text-gray-700 dark:text-gray-300 mb-6">We're here to help — whether you have a question about listings, want to partner, or need support.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-50 rounded-md">
              <Mail className="w-5 h-5 text-hm-red" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Email</div>
              <div className="font-medium">support@homequest.com</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-50 rounded-md">
              <Phone className="w-5 h-5 text-hm-red" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Phone</div>
              <div className="font-medium">+91-XXXXXXXXXX</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 bg-red-50 rounded-md">
              <MapPin className="w-5 h-5 text-hm-red" />
            </div>
            <div>
              <div className="text-sm text-gray-500">Location</div>
              <div className="font-medium">Mumbai, India</div>
            </div>
          </div>
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-3">Founder</h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-100 dark:border-slate-600">
              <img 
                src="/founder.jpg" 
                alt="Pushkar Jain" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-medium">Pushkar Jain</div>
              <div className="text-sm text-gray-500">Founder, HomeQuest</div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-2">Have a question?</h3>
          <p className="text-sm text-gray-600">Send us a message at <span className="font-medium">support@homequest.com</span> and we'll get back to you within 1 business day.</p>
        </div>
      </div>
    </div>
  );
}
