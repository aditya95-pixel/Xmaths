"use client"
import { useState } from 'react';
import { motion } from 'framer-motion';

export default function ResourceForm() {
    const [formData, setFormData] = useState({
        category: 'mathematics',
        topicName: '',
        description: '',
        links: [{ title: '', url: '', type: 'article' }],
        order: 0
    });
    const [loading, setLoading] = useState(false);

    const handleLinkChange = (index, field, value) => {
        const updatedLinks = [...formData.links];
        updatedLinks[index][field] = value;
        setFormData({ ...formData, links: updatedLinks });
    };

    const addLink = () => {
        setFormData({
            ...formData,
            links: [...formData.links, { title: '', url: '', type: 'article' }]
        });
    };

    const removeLink = (index) => {
        const updatedLinks = formData.links.filter((_, i) => i !== index);
        setFormData({ ...formData, links: updatedLinks });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/resources', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            if (res.ok) {
                alert("Resource added successfully!");
                setFormData({
                    category: 'mathematics',
                    topicName: '',
                    description: '',
                    links: [{ title: '', url: '', type: 'article' }],
                    order: 0
                });
            } else {
                const errorData = await res.json();
                alert(`Error: ${errorData.error}`);
            }
        } catch (err) {
            alert("Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    // Stagger definitions for form fields
    const formVariants = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    
    const inputVariants = {
        hidden: { opacity: 0, x: -20 },
        show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } }
    };

    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-50 dark:bg-[#0a0a0a] transition-colors duration-500 py-10 px-4">
            
            {/* Animated Ambient Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <motion.div 
                    animate={{ x: [0, -30, 30, 0], y: [0, 40, -40, 0] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
                    className="absolute top-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-200/50 dark:bg-indigo-600/10 blur-[120px]" 
                />
                <motion.div 
                    animate={{ x: [0, 40, -20, 0], y: [0, -50, 20, 0] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                    className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-pink-200/40 dark:bg-purple-600/10 blur-[120px]" 
                />
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative z-10 max-w-2xl mx-auto p-8 bg-white/70 dark:bg-[#0f0f0f]/80 backdrop-blur-2xl shadow-xl dark:shadow-2xl rounded-2xl border border-slate-200 dark:border-gray-800 text-slate-800 dark:text-gray-100 transition-colors duration-300"
            >
                <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-500">
                    Add New Resource
                </h2>
                
                <motion.form 
                    variants={formVariants}
                    initial="hidden"
                    animate="show"
                    onSubmit={handleSubmit} 
                    className="space-y-6"
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <motion.div variants={inputVariants}>
                            <label className="block text-sm font-medium text-slate-700 dark:text-gray-400 mb-2 transition-colors">Topic Name</label>
                            <input 
                                className="w-full p-3 bg-white/50 dark:bg-[#1a1a1a] border border-slate-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-slate-400 dark:placeholder-gray-600 text-slate-900 dark:text-white"
                                type="text" 
                                placeholder="e.g. Backpropagation" 
                                required
                                value={formData.topicName}
                                onChange={(e) => setFormData({...formData, topicName: e.target.value})} 
                            />
                        </motion.div>

                        <motion.div variants={inputVariants}>
                            <label className="block text-sm font-medium text-slate-700 dark:text-gray-400 mb-2 transition-colors">Category</label>
                            <select 
                                className="w-full p-3 bg-white/50 dark:bg-[#1a1a1a] border border-slate-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer text-slate-900 dark:text-gray-200"
                                value={formData.category} 
                                onChange={(e) => setFormData({...formData, category: e.target.value})}
                            >
                                <option value="mathematics" className="bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white">Mathematics</option>
                                <option value="data-structures" className="bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white">Data Structures</option>
                                <option value="algorithms" className="bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white">Algorithms</option>
                                <option value="machine-learning" className="bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white">Machine Learning</option>
                                <option value="deep-learning" className="bg-white dark:bg-[#1a1a1a] text-slate-900 dark:text-white">Deep Learning</option>
                            </select>
                        </motion.div>
                    </div>

                    <motion.div variants={inputVariants}>
                        <label className="block text-sm font-medium text-slate-700 dark:text-gray-400 mb-2 transition-colors">Description</label>
                        <textarea 
                            className="w-full p-3 bg-white/50 dark:bg-[#1a1a1a] border border-slate-300 dark:border-gray-700 rounded-lg h-28 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-slate-400 dark:placeholder-gray-600 resize-none text-slate-900 dark:text-white"
                            placeholder="Briefly explain what this topic covers..." 
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})} 
                        />
                    </motion.div>

                    <motion.div variants={inputVariants} className="pt-4 border-t border-slate-200 dark:border-gray-800 transition-colors">
                        <div className="flex justify-between items-center mb-4">
                            <label className="text-lg font-semibold text-slate-900 dark:text-gray-200 transition-colors">Resource Links</label>
                            <motion.button 
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="button" 
                                onClick={addLink}
                                className="text-xs font-medium bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/50 px-4 py-2 rounded-full hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-all"
                            >
                                + Add Link
                            </motion.button>
                        </div>

                        <div className="space-y-4">
                            {formData.links.map((link, index) => (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    key={index} 
                                    className="p-4 bg-slate-50/80 dark:bg-[#141414]/80 rounded-xl border border-slate-200 dark:border-gray-800 space-y-3 relative group transition-colors"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        <input 
                                            className="p-2.5 bg-white dark:bg-[#0a0a0a] border border-slate-300 dark:border-gray-700 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500"
                                            placeholder="Title"
                                            value={link.title}
                                            onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                                            required
                                        />
                                        <input 
                                            className="p-2.5 bg-white dark:bg-[#0a0a0a] border border-slate-300 dark:border-gray-700 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none md:col-span-1 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-gray-500"
                                            placeholder="URL"
                                            value={link.url}
                                            onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                            required
                                        />
                                        <select 
                                            className="p-2.5 bg-white dark:bg-[#0a0a0a] border border-slate-300 dark:border-gray-700 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none text-slate-900 dark:text-gray-300"
                                            value={link.type}
                                            onChange={(e) => handleLinkChange(index, 'type', e.target.value)}
                                        >
                                            <option value="video">Video</option>
                                            <option value="article">Article</option>
                                            <option value="documentation">Docs</option>
                                            <option value="pdf">PDF</option>
                                        </select>
                                    </div>
                                    {formData.links.length > 1 && (
                                        <button 
                                            type="button" 
                                            onClick={() => removeLink(index)}
                                            className="text-red-500 dark:text-red-400 text-xs hover:text-red-600 dark:hover:text-red-300 transition-colors flex items-center gap-1"
                                        >
                                            ✕ Remove this link
                                        </button>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.button 
                        variants={inputVariants}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        disabled={loading}
                        className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                            loading 
                            ? 'bg-slate-400 dark:bg-gray-700 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500'
                        }`}
                    >
                        {loading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Saving to Database...
                            </span>
                        ) : 'Submit Resource'}
                    </motion.button>
                </motion.form>
            </motion.div>
        </div>
    );
}