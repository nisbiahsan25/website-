
import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from '../services/i18n';
import { ShieldCheck, Truck, RefreshCw, Lock } from 'lucide-react';

const StaticPage: React.FC = () => {
  const { type } = useParams();
  const { t } = useTranslation();

  const getContent = () => {
    if (type === 'shipping') {
      return {
        title: t('shipping_policy'),
        icon: Truck,
        content: [
          { h: 'ঢাকার ভিতরে ডেলিভারি', p: 'ঢাকার ভিতরে আমরা ২৪-৪৮ ঘণ্টার মধ্যে ডেলিভারি নিশ্চিত করি। ডেলিভারি চার্জ ৬০ টাকা।' },
          { h: 'ঢাকার বাইরে ডেলিভারি', p: 'ঢাকার বাইরে কুরিয়ার সার্ভিসের মাধ্যমে ডেলিভারি দেওয়া হয়। সাধারণত ৩-৫ দিন সময় লাগে। চার্জ ১২০ টাকা।' },
          { h: 'ট্র্যাকিং', p: 'অর্ডার কনফার্ম হওয়ার পর আপনি একটি ট্র্যাকিং আইডি পাবেন যার মাধ্যমে পন্যের অবস্থান জানতে পারবেন।' }
        ]
      };
    }
    return {
      title: t('return_policy'),
      icon: RefreshCw,
      content: [
        { h: '৭ দিনের সহজ রিটার্ন', p: 'পণ্য হাতে পাওয়ার ৭ দিনের মধ্যে যেকোনো ত্রুটি থাকলে আপনি রিটার্ন করতে পারবেন।' },
        { h: 'শর্তাবলী', p: 'রিটার্ন করার সময় পণ্যের অরিজিনাল বক্স এবং প্যাকেট থাকা বাধ্যতামূলক।' },
        { h: 'রিফান্ড প্রসেস', p: 'রিটার্ন রিকোয়েস্ট একসেপ্ট হওয়ার ৩-৫ কার্যদিবসের মধ্যে রিফান্ড প্রদান করা হয়।' }
      ]
    };
  };

  const data = getContent();
  const Icon = data.icon;

  return (
    <div className="max-w-4xl mx-auto px-4 py-20">
      <div className="text-center mb-16">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-brand-orange/10 text-brand-orange rounded-[2rem] mb-6">
          <Icon size={40} />
        </div>
        <h1 className="text-4xl font-black text-brand-black tracking-tight">{data.title}</h1>
      </div>

      <div className="bg-white rounded-[3rem] p-8 md:p-12 shadow-sm border border-gray-100 space-y-12">
        {data.content.map((item, i) => (
          <div key={i} className="space-y-4">
            <h3 className="text-xl font-bold text-brand-black flex items-center space-x-3">
              <span className="w-8 h-8 bg-brand-black text-white rounded-xl flex items-center justify-center text-xs">{i+1}</span>
              <span>{item.h}</span>
            </h3>
            <p className="text-gray-600 leading-relaxed font-medium pl-11">
              {item.p}
            </p>
          </div>
        ))}

        <div className="pt-8 border-t border-gray-100 mt-12 flex items-center justify-center space-x-3 text-brand-orange">
          <ShieldCheck size={20} />
          <span className="text-xs font-black uppercase tracking-widest">Nisbimart Verified Trust Policy</span>
        </div>
      </div>
    </div>
  );
};

export default StaticPage;
