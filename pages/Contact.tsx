
import React from 'react';
import { useTranslation } from '../services/i18n';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

const Contact: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 py-20">
      <div className="text-center mb-20">
        <h1 className="text-5xl font-black text-brand-black tracking-tight mb-4">{t('contact_us')}</h1>
        <p className="text-gray-500 font-medium max-w-lg mx-auto">আমাদের সাথে যেকোনো প্রয়োজনে যোগাযোগ করুন। আমরা ২৪/৭ আপনার সেবায় নিয়োজিত।</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start space-x-6">
            <div className="p-4 bg-brand-orange/10 text-brand-orange rounded-2xl"><Phone size={24} /></div>
            <div>
              <h4 className="font-bold text-brand-black mb-1">সরাসরি কথা বলুন</h4>
              <p className="text-gray-500 font-bold">+৮৮০ ১৭১২-৩৪৫৬৭৮</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start space-x-6">
            <div className="p-4 bg-brand-black/5 text-brand-black rounded-2xl"><Mail size={24} /></div>
            <div>
              <h4 className="font-bold text-brand-black mb-1">ইমেইল করুন</h4>
              <p className="text-gray-500 font-bold">support@nisbimart.com</p>
            </div>
          </div>
          <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm flex items-start space-x-6">
            <div className="p-4 bg-brand-black text-white rounded-2xl"><MapPin size={24} /></div>
            <div>
              <h4 className="font-bold text-brand-black mb-1">অফিস ঠিকানা</h4>
              <p className="text-gray-500 font-bold text-sm">হাউজ #১২, রোড #০৫, ধানমন্ডি, ঢাকা - ১২০৯</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-gray-50">
          <form className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">নাম</label>
                <input className="w-full px-5 py-4 bg-brand-gray rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-brand-orange font-bold" placeholder="আপনার নাম" />
              </div>
              <div>
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">ফোন</label>
                <input className="w-full px-5 py-4 bg-brand-gray rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-brand-orange font-bold" placeholder="ফোন নম্বর" />
              </div>
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">বিষয়</label>
              <input className="w-full px-5 py-4 bg-brand-gray rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-brand-orange font-bold" placeholder="কি বিষয়ে জানতে চান?" />
            </div>
            <div>
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">বার্তা</label>
              <textarea rows={4} className="w-full px-5 py-4 bg-brand-gray rounded-2xl border border-gray-100 outline-none focus:ring-2 focus:ring-brand-orange font-bold resize-none" placeholder="আপনার বার্তা এখানে লিখুন..." />
            </div>
            <button className="w-full bg-brand-black text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-orange transition-all duration-300 shadow-lg shadow-brand-black/10 flex items-center justify-center space-x-3">
              <Send size={20} />
              <span>বার্তা পাঠান</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
