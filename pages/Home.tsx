import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import { Product, CMSPage, BlockType } from '../types';
import { ArrowRight, ShoppingBag, ChevronLeft, ChevronRight, Zap, ShieldCheck, Globe, Star } from 'lucide-react';
import { db } from '../services/db';
import { Link } from 'react-router-dom';
import { useTranslation } from '../services/i18n';

interface Props {
  addToCart: (p: Product) => void;
}

const Home: React.FC<Props> = ({ addToCart }) => {
  const { t } = useTranslation();
  const [pageData, setPageData] = useState<CMSPage | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      const homePage = await db.getPageBySlug('home');
      setPageData(homePage || null);
      
      const products = await db.getProducts();
      setAllProducts(Array.isArray(products) ? products : []);
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (!pageData || allProducts.length === 0) return;
    const heroSection = pageData.sections.find(s => s.type === BlockType.HERO && s.isActive);
    if (!heroSection) return;

    const featuredProducts = allProducts.filter(p => p.isPopular);
    const slidesCount = (heroSection.config.source === 'featured' && featuredProducts.length > 0) 
      ? featuredProducts.length 
      : 1;

    if (slidesCount > 1) {
      const timer = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slidesCount);
      }, 7000);
      return () => clearInterval(timer);
    }
  }, [pageData, allProducts]);

  if (!pageData) return (
    <div className="flex items-center justify-center min-h-screen">
       <div className="w-12 h-12 border-4 border-brand-orange border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="space-y-0 pb-0 bg-white">
      {pageData.sections.filter(s => s.isActive).map((section) => {
        switch (section.type) {
          case BlockType.HERO:
            const featuredProducts = allProducts.filter(p => p.isPopular);
            const isDynamic = section.config.source === 'featured' && featuredProducts.length > 0;
            const slides = isDynamic ? featuredProducts : [section.config];
            const slideIdx = slides.length > 0 ? currentSlide % slides.length : 0;
            const currentItem = slides.length > 0 ? slides[slideIdx] : null;

            if (!currentItem) return null;

            return (
              <section key={section.id} className="relative h-[85vh] flex items-center overflow-hidden bg-brand-black group">
                {/* Background Layer */}
                <div className="absolute inset-0 transition-all duration-1000 ease-in-out">
                  <img 
                    src={isDynamic ? currentItem.images[0] : currentItem.image} 
                    className="w-full h-full object-cover animate-in fade-in zoom-in-110 duration-[20000ms] opacity-60" 
                    alt="Hero Banner" 
                    key={slideIdx}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/50 to-transparent"></div>
                </div>
                
                {/* Content Layer */}
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
                  <div className="max-w-4xl" key={slideIdx}>
                    <div className="flex items-center space-x-4 mb-8 animate-in slide-in-from-left duration-700">
                        <div className="h-[3px] w-16 bg-brand-orange"></div>
                        <span className="text-brand-orange font-black tracking-[0.3em] text-xs uppercase">
                            {isDynamic ? (currentItem.brand || t('featured')) : section.config.subtitle}
                        </span>
                    </div>
                    
                    <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.85] mb-8 tracking-tighter animate-in slide-in-from-bottom-12 duration-1000">
                      {isDynamic ? (
                        <>
                          {currentItem.name.split(' ').slice(0, 2).join(' ')} <br/>
                          <span className="text-brand-orange drop-shadow-2xl">
                            {currentItem.name.split(' ').slice(2).join(' ')}
                          </span>
                        </>
                      ) : (
                        <>
                          {section.config.title.split(' ').slice(0, -1).join(' ')} <br/> 
                          <span className="text-brand-orange">
                            {section.config.title.split(' ').pop()}
                          </span>
                        </>
                      )}
                    </h1>

                    <div className="flex items-center space-x-6 mb-12 animate-in slide-in-from-bottom-10 duration-1000 delay-200">
                       <p className="text-xl text-gray-300 max-w-lg leading-relaxed font-medium">
                         {isDynamic ? currentItem.shortDescription : section.config.description}
                       </p>
                       {isDynamic && (
                         <div className="hidden md:flex flex-col border-l border-white/20 pl-6">
                            <span className="text-white font-black text-2xl tracking-tighter">৳{currentItem.price}</span>
                            <div className="flex text-brand-orange mt-1">
                               {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}
                            </div>
                         </div>
                       )}
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 animate-in slide-in-from-bottom-10 duration-1000 delay-500">
                      {isDynamic ? (
                        <Link 
                          to={`/product/${currentItem.id}`}
                          className="bg-brand-orange text-white px-12 py-6 rounded-[2rem] font-black text-xl flex items-center justify-center space-x-3 hover:bg-white hover:text-brand-black transition-all duration-500 transform hover:-translate-y-2 shadow-2xl shadow-brand-orange/40 active:scale-95"
                        >
                          <span>{t('buy_now')}</span>
                          <ArrowRight size={24} />
                        </Link>
                      ) : (
                        <a 
                          href={section.config.buttonUrl || '#shop'}
                          className="bg-brand-orange text-white px-12 py-6 rounded-[2rem] font-black text-xl flex items-center justify-center space-x-3 hover:bg-white hover:text-brand-black transition-all duration-500 transform hover:-translate-y-2 shadow-2xl shadow-brand-orange/40 active:scale-95"
                        >
                          <span>{section.config.buttonText}</span>
                          <ArrowRight size={24} />
                        </a>
                      )}
                      
                      <button className="bg-white/10 backdrop-blur-xl text-white border border-white/20 px-10 py-6 rounded-[2rem] font-black text-lg hover:bg-white/20 transition-all duration-300">
                         View Collection
                      </button>
                    </div>
                  </div>
                </div>

                {/* Indicators */}
                {slides.length > 1 && (
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex space-x-4 z-20">
                    {slides.map((_, i) => (
                      <button 
                        key={i} 
                        onClick={() => setCurrentSlide(i)}
                        className={`transition-all duration-700 rounded-full h-1 ${slideIdx === i ? 'w-16 bg-brand-orange shadow-[0_0_15px_rgba(242,113,65,0.8)]' : 'w-6 bg-white/30'}`}
                      />
                    ))}
                  </div>
                )}

                {/* Side Navigation for Carousel */}
                {slides.length > 1 && (
                   <div className="hidden lg:flex absolute right-12 top-1/2 -translate-y-1/2 flex-col space-y-6 z-20">
                      <button 
                        onClick={() => setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)}
                        className="w-14 h-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-orange hover:border-brand-orange transition-all duration-300"
                      >
                         <ChevronLeft size={24} />
                      </button>
                      <button 
                        onClick={() => setCurrentSlide(prev => (prev + 1) % slides.length)}
                        className="w-14 h-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center text-white hover:bg-brand-orange hover:border-brand-orange transition-all duration-300"
                      >
                         <ChevronRight size={24} />
                      </button>
                   </div>
                )}
              </section>
            );

          case BlockType.PRODUCT_GRID:
            const filtered = section.config.category === 'all' 
              ? allProducts 
              : allProducts.filter(p => p.category === section.config.category);
            
            return (
              <section key={section.id} id="shop" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                <div className="flex flex-col md:flex-row justify-between items-end mb-20 space-y-8 md:space-y-0">
                  <div className="max-w-xl">
                    <h2 className="text-6xl font-black text-brand-black tracking-tighter mb-6 leading-none">
                        {section.config.title}
                        <span className="text-brand-orange">.</span>
                    </h2>
                    <p className="text-gray-500 text-xl font-medium leading-relaxed">
                        Explore our world-class collection of tech and lifestyle gear, handpicked for quality and performance.
                    </p>
                  </div>
                  {section.config.category === 'all' && (
                    <div className="flex bg-brand-gray p-2 rounded-[2.5rem] shadow-inner border border-gray-100">
                      {['all', 'electronics', 'lifestyle'].map(cat => (
                        <button
                          key={cat}
                          onClick={() => setActiveCategory(cat)}
                          className={`px-10 py-4 rounded-[2rem] text-[10px] font-black transition-all duration-500 uppercase tracking-widest ${
                            activeCategory === cat ? 'bg-brand-black text-white shadow-2xl shadow-brand-black/20' : 'text-gray-400 hover:text-brand-orange'
                          }`}
                        >
                          {t(cat as any)}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
                  {(section.config.category === 'all' ? allProducts.filter(p => activeCategory === 'all' || p.category === activeCategory) : filtered)
                    .slice(0, section.config.limit || 8)
                    .map(product => (
                      <ProductCard key={product.id} product={product} onAddToCart={addToCart} />
                    ))}
                </div>
              </section>
            );

          default:
            return null;
        }
      })}

      {/* Trust & Features Section */}
      <section className="bg-brand-black py-32 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
           <Zap className="absolute -top-20 -left-20 text-white" size={400} />
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
             {[
               { title: 'Global Fast Shipping', icon: Globe, desc: 'Express worldwide delivery protocols enabled.' },
               { title: 'Secure Transactions', icon: ShieldCheck, desc: 'Enterprise grade AES-256 encryption.' },
               { title: '24/7 Premium Support', icon: Zap, desc: 'Always ready to scale your support needs.' }
             ].map((feature, i) => (
               <div key={i} className="flex flex-col items-center text-center group">
                 <div className="w-24 h-24 bg-white/5 rounded-[2.5rem] border border-white/10 flex items-center justify-center text-brand-orange mb-10 group-hover:bg-brand-orange group-hover:text-white group-hover:scale-110 transition-all duration-500 shadow-2xl">
                    <feature.icon size={36} strokeWidth={2} />
                 </div>
                 <h3 className="text-white font-black text-2xl mb-4 tracking-tight">{feature.title}</h3>
                 <p className="text-gray-500 text-lg font-medium max-w-xs">{feature.desc}</p>
               </div>
             ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;