import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { marketplaceAPI } from '../api/client';

const Marketplace = () => {
  const [blueprints, setBlueprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sortBy: 'newest',
  });

  const fetchBlueprints = useCallback(async () => {
    setLoading(true);
    try {
      const response = await marketplaceAPI.search({
        q: filters.search,
        category: filters.category,
        sortBy: filters.sortBy,
        limit: 20,
      });
      setBlueprints(response.data.blueprints);
    } catch (error) {
      console.error('Error fetching blueprints:', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchBlueprints();
  }, [fetchBlueprints]);

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12 border-b border-white/10 pb-8 flex flex-col md:flex-row justify-between items-end gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-2">
            Marketplace
          </h1>
          <p className="font-mono text-sm text-primary uppercase tracking-widest">
            Discover validating startup plans /
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <input
            type="text"
            placeholder="Command + K to search..."
            className="bg-[#0a0a0a] border border-white/20 p-3 text-white focus:border-primary focus:outline-none font-mono text-sm w-full sm:w-64"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
            className="bg-[#0a0a0a] border border-white/20 p-3 text-white focus:border-primary focus:outline-none font-mono text-sm appearance-none cursor-pointer w-full sm:w-48"
          >
            <option value="newest">Sort: Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <span className="font-mono text-primary animate-pulse tracking-widest">LOADING...</span>
        </div>
      ) : blueprints.length === 0 ? (
        <div className="py-20 text-center border border-white/10 bg-black/50">
          <p className="font-mono text-gray-500 uppercase tracking-widest">No blueprints found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blueprints.map((blueprint) => (
            <Link
              key={blueprint._id}
              to={`/blueprint/${blueprint._id}`}
              className="group glass-card flex flex-col h-full"
            >
              {/* Image Placeholder */}
              <div className="h-48 w-full bg-[#111] overflow-hidden relative border-b border-white/10 flex items-center justify-center p-6">
                 <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/10 to-transparent"></div>
                 <h3 className="text-2xl font-black uppercase text-center truncate group-hover:text-primary transition-colors text-white z-10">
                   {blueprint.title}
                 </h3>
              </div>
              
              {/* Card Body */}
              <div className="p-6 flex flex-col flex-grow">
                <p className="text-gray-400 text-sm mb-6 line-clamp-3 leading-relaxed">
                  {blueprint.description}
                </p>
                
                <div className="mt-auto">
                  <div className="flex justify-between items-center border-t border-white/10 pt-4 mb-3">
                    <span className="font-mono text-xs uppercase tracking-widest text-primary border border-primary/30 px-2 py-1 bg-primary/5">
                      {blueprint.category || 'General'}
                    </span>
                    <span className="font-mono font-bold text-white">
                      ${blueprint.pricing}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs font-mono text-gray-500 uppercase tracking-widest">
                    <span>By {blueprint.author?.username || 'Anonymous'}</span>
                    <span className="group-hover:text-white transition-colors">View →</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
