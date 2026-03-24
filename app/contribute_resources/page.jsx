"use client"
import { useState } from 'react';

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

    return (
        <div className="max-w-2xl mx-auto p-8 bg-[#0f0f0f] shadow-2xl rounded-2xl border border-gray-800 mt-10 text-gray-100">
            <h2 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Add New Resource
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Topic Name</label>
                        <input 
                            className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-600"
                            type="text" 
                            placeholder="e.g. Backpropagation" 
                            required
                            value={formData.topicName}
                            onChange={(e) => setFormData({...formData, topicName: e.target.value})} 
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
                        <select 
                            className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all cursor-pointer text-gray-200"
                            value={formData.category} 
                            onChange={(e) => setFormData({...formData, category: e.target.value})}
                        >
                            <option value="mathematics" className="bg-[#1a1a1a]">Mathematics</option>
                            <option value="data-structures" className="bg-[#1a1a1a]">Data Structures</option>
                            <option value="algorithms" className="bg-[#1a1a1a]">Algorithms</option>
                            <option value="machine-learning" className="bg-[#1a1a1a]">Machine Learning</option>
                            <option value="deep-learning" className="bg-[#1a1a1a]">Deep Learning</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
                    <textarea 
                        className="w-full p-3 bg-[#1a1a1a] border border-gray-700 rounded-lg h-28 focus:ring-2 focus:ring-blue-500 outline-none transition-all placeholder-gray-600 resize-none"
                        placeholder="Briefly explain what this topic covers..." 
                        value={formData.description}
                        onChange={(e) => setFormData({...formData, description: e.target.value})} 
                    />
                </div>

                <div className="pt-4 border-t border-gray-800">
                    <div className="flex justify-between items-center mb-4">
                        <label className="text-lg font-semibold text-gray-200">Resource Links</label>
                        <button 
                            type="button" 
                            onClick={addLink}
                            className="text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800/50 px-4 py-2 rounded-full hover:bg-blue-800/40 transition-all"
                        >
                            + Add Link
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.links.map((link, index) => (
                            <div key={index} className="p-4 bg-[#141414] rounded-xl border border-gray-800 space-y-3 relative group">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <input 
                                        className="p-2.5 bg-[#0a0a0a] border border-gray-700 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                                        placeholder="Title"
                                        value={link.title}
                                        onChange={(e) => handleLinkChange(index, 'title', e.target.value)}
                                        required
                                    />
                                    <input 
                                        className="p-2.5 bg-[#0a0a0a] border border-gray-700 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none md:col-span-1"
                                        placeholder="URL"
                                        value={link.url}
                                        onChange={(e) => handleLinkChange(index, 'url', e.target.value)}
                                        required
                                    />
                                    <select 
                                        className="p-2.5 bg-[#0a0a0a] border border-gray-700 rounded-md text-sm focus:ring-1 focus:ring-blue-500 outline-none text-gray-300"
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
                                        className="text-red-400 text-xs hover:text-red-300 transition-colors flex items-center gap-1"
                                    >
                                        ✕ Remove this link
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-lg ${
                        loading 
                        ? 'bg-gray-700 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-[0.98]'
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
                </button>
            </form>
        </div>
    );
}