import React, { useState, useEffect, useCallback } from 'react';
import { blueprintsAPI, walletAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [myBlueprints, setMyBlueprints] = useState([]);
  const [wallet, setWallet] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [blueprintsResponse, walletResponse] = await Promise.all([
        blueprintsAPI.getByAuthor(user._id),
        walletAPI.getWallet(user._id),
      ]);

      setMyBlueprints(blueprintsResponse.data.blueprints);
      setWallet(walletResponse.data.wallet);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user, fetchData]);

  if (loading) return (
    <div className="min-h-screen pt-32 flex items-center justify-center">
      <span className="font-mono text-primary animate-pulse tracking-widest">LOADING DASHBOARD...</span>
    </div>
  );

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      <div className="mb-12 border-b border-white/10 pb-8 rounded-none">
         <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white mb-2">
            Dashboard
         </h1>
         <p className="font-mono text-sm text-primary uppercase tracking-widest">
            Manage your assets and metrics /
         </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="p-8 border border-white/10 bg-[#050505]">
          <h3 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-6">Wallet Balance</h3>
          <div className="text-5xl font-black text-white mb-6">${wallet?.balance.toFixed(2) || '0.00'}</div>
          <div className="flex flex-col gap-2 font-mono text-sm text-gray-400">
             <div className="flex justify-between">
                <span>TOTAL EARNINGS</span>
                <span className="text-white">${wallet?.totalEarnings.toFixed(2) || '0.00'}</span>
             </div>
             <div className="flex justify-between">
                <span>TOTAL SPENT</span>
                <span className="text-white">${wallet?.totalSpent.toFixed(2) || '0.00'}</span>
             </div>
          </div>
        </div>

        <div className="p-8 border border-white/10 bg-[#050505]">
          <h3 className="font-mono text-xs uppercase tracking-widest text-gray-500 mb-6">Your Metrics</h3>
          <div className="grid grid-cols-2 gap-6">
             <div>
                <div className="text-3xl font-black text-white mb-1">{user?.metrics?.blueprintsCreated || 0}</div>
                <div className="font-mono text-xs uppercase text-gray-500 tracking-widest">Created</div>
             </div>
             <div>
                <div className="text-3xl font-black text-white mb-1">{user?.metrics?.blueprintsPurchased || 0}</div>
                <div className="font-mono text-xs uppercase text-gray-500 tracking-widest">Purchased</div>
             </div>
             <div className="col-span-2">
                <div className="text-3xl font-black text-primary mb-1">⭐ {user?.metrics?.rating || 5}/5</div>
                <div className="font-mono text-xs uppercase text-gray-500 tracking-widest">Global Rating</div>
             </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-8">Your Blueprints ({myBlueprints.length})</h2>
        {myBlueprints.length === 0 ? (
          <div className="py-20 text-center border border-white/10 bg-black/50">
            <p className="font-mono text-gray-500 uppercase tracking-widest">You haven't created any blueprints yet.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {myBlueprints.map((blueprint) => (
              <div key={blueprint._id} className="p-6 border border-white/10 bg-white/5 hover:border-white/30 transition-colors flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h4 className="text-xl font-bold text-white uppercase mb-2">{blueprint.title}</h4>
                  <p className="text-gray-400 text-sm line-clamp-2 max-w-2xl">{blueprint.description}</p>
                </div>
                <div className="flex items-center gap-6 font-mono text-sm">
                  <div className="flex flex-col items-end">
                    <span className="text-gray-500 text-xs tracking-widest uppercase">Status</span>
                    <span className={`uppercase font-bold ${blueprint.status === 'active' ? 'text-primary' : 'text-gray-400'}`}>{blueprint.status}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-500 text-xs tracking-widest uppercase">Price</span>
                    <span className="text-white">${blueprint.pricing}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-gray-500 text-xs tracking-widest uppercase">Sales</span>
                    <span className="text-white">{blueprint.sales?.purchaseCount || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
