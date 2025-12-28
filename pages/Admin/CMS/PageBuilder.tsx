import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Settings, 
  Eye, 
  Trash2, 
  MoveUp, 
  MoveDown, 
  Save, 
  X, 
  Layout, 
  Type, 
  Package, 
  Clock, 
  Megaphone,
  CheckCircle2,
  ExternalLink,
  Search,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { CMSPage, Section, BlockType } from '../../../types';
import { db } from '../../../services/db';

const PageBuilder: React.FC = () => {
  const [pages, setPages] = useState<CMSPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<CMSPage | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    const data = await db.getPages();
    setPages(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleCreatePage = () => {
    const newPage: CMSPage = {
      id: `p-${Date.now()}`,
      title: 'Untitled Page',
      slug: `new-page-${Math.floor(Math.random()*1000)}`,
      status: 'Draft',
      type: 'Landing',
      seo: { title: '', description: '' },
      tracking: {},
      sections: [],
      createdAt: new Date().toISOString()
    };
    const updated = [...pages, newPage];
    setPages(updated);
    db.savePages(updated);
    setSelectedPage(newPage);
    setIsEditorOpen(true);
  };

  const handleAddSection = (type: BlockType) => {
    if (!selectedPage) return;
    const newSection: Section = {
      id: `s-${Date.now()}`,
      type,
      order: selectedPage.sections.length,
      isActive: true,
      config: getDefaultConfig(type)
    };
    const updatedPage = { ...selectedPage, sections: [...selectedPage.sections, newSection] };
    saveCurrentPage(updatedPage);
  };

  const saveCurrentPage = (updatedPage: CMSPage) => {
    setSelectedPage(updatedPage);
    const updatedPages = pages.map(p => p.id === updatedPage.id ? updatedPage : p);
    setPages(updatedPages);
    db.savePages(updatedPages);
  };

  const getDefaultConfig = (type: BlockType) => {
    switch (type) {
      case BlockType.HERO: return { 
        source: 'manual', 
        title: 'New Hero Block', 
        subtitle: 'Special Collection',
        description: 'Explore our latest arrivals.',
        image: 'https://picsum.photos/seed/tech/1200/800', 
        buttonText: 'Buy Now' 
      };
      case BlockType.PRODUCT_GRID: return { title: 'Flash Deals', category: 'all', limit: 4 };
      case BlockType.COUNTDOWN: return { title: 'Offer Ends In:', endTime: new Date(Date.now() + 86400000).toISOString() };
      default: return {};
    }
  };

  const inputClasses = "w-full px-4 py-3 rounded-2xl bg-gray-50 border border-gray-200 text-gray-900 font-bold placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition duration-200";
  const labelClasses = "block text-[10px] font-bold text-gray-400 uppercase mb-2 ml-1 tracking-widest";

  const filteredPages = pages.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()) || p.slug.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">Page Builder</h1>
          <p className="text-gray-500 font-medium">Visual CMS for high-conversion funnels</p>
        </div>
        <div className="flex items-center space-x-4">
          <button onClick={loadPages} className="p-4 text-brand-orange hover:bg-brand-orange/5 rounded-2xl transition">
            <RefreshCw size={24} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={handleCreatePage}
            className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-black text-lg flex items-center space-x-2 hover:bg-indigo-700 transition shadow-lg shadow-indigo-600/20 active:scale-95"
          >
            <Plus size={24} />
            <span>Create Page</span>
          </button>
        </div>
      </header>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden mb-10">
        <div className="p-8 border-b border-gray-50 flex justify-between items-center">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
              type="text" 
              placeholder="Search by title or slug..." 
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-xl bg-gray-50 border border-gray-100 outline-none w-80 text-sm font-medium focus:ring-2 focus:ring-indigo-600"
            />
          </div>
        </div>
        <table className="w-full text-left">
          <thead className="bg-gray-50/50">
            <tr>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Page Info</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Type</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
              <th className="px-8 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredPages.map(page => (
              <tr key={page.id} className="hover:bg-gray-50/50 transition">
                <td className="px-8 py-5">
                  <p className="font-bold text-gray-900">{page.title}</p>
                  <p className="text-xs text-indigo-500 font-medium italic">/{page.slug}</p>
                </td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-wider">{page.type}</span>
                </td>
                <td className="px-8 py-5">
                   <div className="flex items-center space-x-2">
                     <div className={`w-2 h-2 rounded-full ${page.status === 'Published' ? 'bg-emerald-500' : 'bg-orange-500'}`}></div>
                     <span className="text-sm font-bold text-gray-700">{page.status}</span>
                   </div>
                </td>
                <td className="px-8 py-5 text-right space-x-2">
                   <button onClick={() => { setSelectedPage(page); setIsEditorOpen(true); }} className="p-2 text-gray-400 hover:text-indigo-600 transition"><Settings size={18} /></button>
                   <a href={`/#/${page.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-indigo-600 transition inline-block"><ExternalLink size={18} /></a>
                   <button className="p-2 text-gray-400 hover:text-red-500 transition"><Trash2 size={18} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Visual Editor Modal */}
      {isEditorOpen && selectedPage && (
        <div className="fixed inset-0 z-50 flex bg-gray-100 animate-in fade-in duration-300">
          {/* Left Sidebar: Settings & Meta */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto no-scrollbar">
            <div className="p-6 border-b border-gray-200 flex justify-between items-center">
               <h2 className="text-xl font-black text-gray-900">Page Config</h2>
               <button onClick={() => setIsEditorOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label className={labelClasses}>Internal Title</label>
                <input value={selectedPage.title} onChange={e => saveCurrentPage({...selectedPage, title: e.target.value})} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>URL Slug</label>
                <input value={selectedPage.slug} onChange={e => saveCurrentPage({...selectedPage, slug: e.target.value})} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Status</label>
                <select value={selectedPage.status} onChange={e => saveCurrentPage({...selectedPage, status: e.target.value as any})} className={inputClasses}>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                </select>
              </div>
              <div className="pt-4 border-t border-gray-100">
                 <h3 className="text-sm font-black text-gray-900 mb-4">Add Content Block</h3>
                 <div className="grid grid-cols-2 gap-2">
                    {[
                      { type: BlockType.HERO, label: 'Hero', icon: Layout },
                      { type: BlockType.PRODUCT_GRID, label: 'Grid', icon: Package },
                      { type: BlockType.COUNTDOWN, label: 'Timer', icon: Clock },
                      { type: BlockType.NEWSLETTER, label: 'Lead', icon: Megaphone }
                    ].map(block => (
                      <button 
                        key={block.type}
                        onClick={() => handleAddSection(block.type)}
                        className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-100 rounded-2xl hover:border-indigo-600 hover:text-indigo-600 transition group"
                      >
                        <block.icon className="mb-2 text-gray-400 group-hover:text-indigo-600" size={24} />
                        <span className="text-[10px] font-black uppercase tracking-widest">{block.label}</span>
                      </button>
                    ))}
                 </div>
              </div>
            </div>
          </div>

          {/* Main Content: Section List */}
          <div className="flex-grow p-12 overflow-y-auto no-scrollbar bg-gray-50">
             <div className="max-w-2xl mx-auto space-y-4">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-2xl font-black text-gray-900">Layout Stack</h3>
                   <span className="text-xs font-bold text-gray-400 uppercase">{selectedPage.sections.length} Active Blocks</span>
                </div>
                {selectedPage.sections.map((section, i) => (
                  <div key={section.id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between hover:border-indigo-600 transition cursor-pointer group">
                    <div className="flex items-center space-x-6">
                       <div className="flex flex-col space-y-1">
                          <button onClick={(e) => { e.stopPropagation(); /* Logic to move up */ }} className="text-gray-300 hover:text-indigo-600 transition"><MoveUp size={16} /></button>
                          <button onClick={(e) => { e.stopPropagation(); /* Logic to move down */ }} className="text-gray-300 hover:text-indigo-600 transition"><MoveDown size={16} /></button>
                       </div>
                       <div>
                          <p className="text-sm font-black text-indigo-600 uppercase tracking-widest mb-1">{section.type}</p>
                          <h4 className="font-bold text-gray-900">{section.config.title || 'Untitled Block'}</h4>
                       </div>
                    </div>
                    <div className="flex items-center space-x-2">
                       <button onClick={() => setEditingSection(section)} className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition">
                          <Settings size={20} />
                       </button>
                       <button className="p-3 text-gray-300 hover:text-red-500 transition">
                          <Trash2 size={20} />
                       </button>
                    </div>
                  </div>
                ))}
                {selectedPage.sections.length === 0 && (
                   <div className="p-20 text-center border-2 border-dashed border-gray-200 rounded-[3rem] flex flex-col items-center justify-center text-gray-400">
                      <Layout size={48} className="mb-4 opacity-20" />
                      <p className="font-bold">Your page is a blank canvas.</p>
                      <p className="text-sm">Add your first block from the sidebar.</p>
                   </div>
                )}
             </div>
          </div>

          {/* Right Sidebar: Block Config */}
          {editingSection && (
            <div className="w-96 bg-white border-l border-gray-200 shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col h-full overflow-y-auto no-scrollbar">
               <div className="p-8 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
                  <div>
                    <h2 className="text-xl font-black text-gray-900">Configure</h2>
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{editingSection.type}</p>
                  </div>
                  <button onClick={() => setEditingSection(null)} className="p-2 hover:bg-gray-100 rounded-full transition"><X size={20} /></button>
               </div>
               <div className="p-8 space-y-6">
                  {editingSection.type === BlockType.HERO && (
                    <>
                      <div>
                        <label className={labelClasses}>Content Source</label>
                        <select value={editingSection.config.source} onChange={e => {
                          const updated = { ...editingSection, config: { ...editingSection.config, source: e.target.value }};
                          setEditingSection(updated);
                          saveCurrentPage({ ...selectedPage, sections: selectedPage.sections.map(s => s.id === updated.id ? updated : s)});
                        }} className={inputClasses}>
                          <option value="manual">Manual Entry</option>
                          <option value="featured">Best Sellers (Dynamic Slider)</option>
                        </select>
                      </div>

                      {editingSection.config.source === 'manual' ? (
                        <div className="space-y-6 animate-in fade-in duration-300">
                          <div>
                            <label className={labelClasses}>Main Heading</label>
                            <input value={editingSection.config.title} onChange={e => {
                              const updated = { ...editingSection, config: { ...editingSection.config, title: e.target.value }};
                              setEditingSection(updated);
                              saveCurrentPage({ ...selectedPage, sections: selectedPage.sections.map(s => s.id === updated.id ? updated : s)});
                            }} className={inputClasses} />
                          </div>
                          <div>
                            <label className={labelClasses}>Image URL</label>
                            <input value={editingSection.config.image} onChange={e => {
                              const updated = { ...editingSection, config: { ...editingSection.config, image: e.target.value }};
                              setEditingSection(updated);
                              saveCurrentPage({ ...selectedPage, sections: selectedPage.sections.map(s => s.id === updated.id ? updated : s)});
                            }} className={inputClasses} />
                          </div>
                          <div>
                            <label className={labelClasses}>CTA Button Text</label>
                            <input value={editingSection.config.buttonText} onChange={e => {
                              const updated = { ...editingSection, config: { ...editingSection.config, buttonText: e.target.value }};
                              setEditingSection(updated);
                              saveCurrentPage({ ...selectedPage, sections: selectedPage.sections.map(s => s.id === updated.id ? updated : s)});
                            }} className={inputClasses} />
                          </div>
                        </div>
                      ) : (
                        <div className="p-6 bg-indigo-50 border border-indigo-100 rounded-3xl animate-in fade-in duration-300">
                           <div className="flex items-center space-x-3 mb-4">
                              <Sparkles className="text-indigo-600" size={20} />
                              <h4 className="font-black text-indigo-900 text-sm">Dynamic Mode Active</h4>
                           </div>
                           <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                              This block will automatically pull all products marked as <strong>'Best Seller'</strong> and display them in a sliding carousel on the frontend.
                           </p>
                        </div>
                      )}
                    </>
                  )}
                  {editingSection.type === BlockType.PRODUCT_GRID && (
                    <>
                      <div>
                        <label className={labelClasses}>Grid Title</label>
                        <input value={editingSection.config.title} onChange={e => {
                          const updated = { ...editingSection, config: { ...editingSection.config, title: e.target.value }};
                          setEditingSection(updated);
                          saveCurrentPage({ ...selectedPage, sections: selectedPage.sections.map(s => s.id === updated.id ? updated : s)});
                        }} className={inputClasses} />
                      </div>
                      <div>
                        <label className={labelClasses}>Source Category</label>
                        <select value={editingSection.config.category} onChange={e => {
                          const updated = { ...editingSection, config: { ...editingSection.config, category: e.target.value }};
                          setEditingSection(updated);
                          saveCurrentPage({ ...selectedPage, sections: selectedPage.sections.map(s => s.id === updated.id ? updated : s)});
                        }} className={inputClasses}>
                          <option value="all">All Products</option>
                          <option value="electronics">Electronics</option>
                          <option value="lifestyle">Lifestyle</option>
                        </select>
                      </div>
                    </>
                  )}
                  <button 
                    onClick={() => setEditingSection(null)}
                    className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg hover:bg-indigo-600 transition flex items-center justify-center space-x-2"
                  >
                    <CheckCircle2 size={20} />
                    <span>Apply Changes</span>
                  </button>
               </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PageBuilder;