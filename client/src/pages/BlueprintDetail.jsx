import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { blueprintsAPI, commentsAPI, transactionsAPI, validationAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';

const BlueprintDetail = () => {
  const { id } = useParams();
  const { token } = useAuth();
  const [blueprint, setBlueprint] = useState(null);
  const [comments, setComments] = useState([]);
  const [validation, setValidation] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [bpResponse, commentsResponse] = await Promise.all([
        blueprintsAPI.getOne(id),
        commentsAPI.getByBlueprint(id),
      ]);

      setBlueprint(bpResponse.data);
      setComments(commentsResponse.data.comments);

      try {
        const validationResponse = await validationAPI.getValidation(id);
        setValidation(validationResponse.data);
      } catch (_err) {}
    } catch (error) {
      console.error('Error fetching blueprint:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!token) return alert('Please login to comment');

    try {
      const response = await commentsAPI.create({
        blueprintId: id,
        content: newComment,
      });
      setComments([response.data.comment, ...comments]);
      setNewComment('');
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  const handlePurchase = async () => {
    if (!token) return alert('Please login to purchase');

    setPurchasing(true);
    try {
      await transactionsAPI.create({
        blueprintId: id,
        paymentMethod: 'wallet',
      });
      alert('Blueprint purchased successfully!');
    } catch (error) {
      alert('Purchase failed: ' + (error.response?.data?.error || error.message));
    } finally {
      setPurchasing(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen pt-32 flex items-center justify-center">
      <span className="font-mono text-primary animate-pulse tracking-widest">LOADING BLUEPRINT...</span>
    </div>
  );
  
  if (!blueprint) return (
    <div className="min-h-screen pt-32 flex items-center justify-center">
      <h2 className="text-2xl font-mono text-white tracking-widest">404 / NOT FOUND</h2>
    </div>
  );

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto min-h-screen">
      
      {/* Header Section */}
      <div className="mb-12 border-b border-white/10 pb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-6">
          <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tight text-white max-w-3xl leading-none">
            {blueprint.title}
          </h1>
          <div className="text-right flex-shrink-0">
             <span className="block text-3xl font-black text-primary">${blueprint.pricing}</span>
             <span className="font-mono text-xs text-gray-500 uppercase tracking-widest">One-time purchase</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs uppercase tracking-widest text-primary border border-primary/30 px-3 py-1.5 bg-primary/5">
            {blueprint.category}
          </span>
          <span className="font-mono text-xs text-gray-400 uppercase tracking-widest">
            By {blueprint.author?.username || 'Anonymous'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          
          <p className="text-xl text-gray-300 leading-relaxed font-medium">
            {blueprint.description}
          </p>

          <section>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-4">Problem Statement</h2>
            <div className="p-6 bg-white/5 border border-white/10 text-gray-300 leading-relaxed">
              {blueprint.content?.problemStatement || 'Not provided.'}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-4">Target Audience</h2>
            <div className="grid gap-4">
              {blueprint.content?.targetAudience?.map((segment, idx) => (
                <div key={idx} className="p-6 bg-white/5 border border-white/10">
                  <h4 className="text-lg font-bold text-white mb-2">{segment.segment}</h4>
                  <p className="text-gray-400 mb-4">{segment.description}</p>
                  <div className="font-mono text-xs text-primary uppercase tracking-widest">
                    Market Size: {segment.size || 'Unknown'}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="grid md:grid-cols-2 gap-8">
            <section>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-4">Market</h2>
              <ul className="space-y-4 p-6 bg-white/5 border border-white/10">
                <li className="flex flex-col">
                  <span className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">Market Size</span>
                  <span className="text-white">{blueprint.content?.marketResearch?.marketSize || 'N/A'}</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">Competitors</span>
                  <span className="text-white">{blueprint.content?.marketResearch?.competitors?.join(', ') || 'None listed'}</span>
                </li>
              </ul>
            </section>
            
            <section>
              <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-4 border-l-2 border-primary pl-4">Monetization</h2>
              <ul className="space-y-4 p-6 bg-white/5 border border-white/10">
                <li className="flex flex-col">
                  <span className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">Model</span>
                  <span className="text-white">{blueprint.content?.monetizationStrategy?.model || 'N/A'}</span>
                </li>
                <li className="flex flex-col">
                  <span className="font-mono text-xs text-gray-500 uppercase tracking-widest mb-1">Pricing Tier</span>
                  <span className="text-white">{blueprint.content?.monetizationStrategy?.pricingTier || 'N/A'}</span>
                </li>
              </ul>
            </section>
          </div>

          {/* Comments Section */}
          <section className="pt-12 border-t border-white/10">
            <h2 className="text-2xl font-black text-white uppercase tracking-wider mb-8">Comments / Discussion</h2>
            
            {token ? (
              <form onSubmit={handleCommentSubmit} className="mb-10">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Analyze this blueprint..."
                  required
                  className="w-full bg-black border border-white/20 p-4 text-white placeholder-gray-600 focus:border-primary focus:outline-none font-mono text-sm resize-y min-h-[120px] mb-4"
                />
                <button type="submit" className="px-8 py-3 bg-white hover:bg-gray-200 text-black font-bold uppercase tracking-widest transition-colors text-sm">
                  Post Comment
                </button>
              </form>
            ) : (
              <div className="p-6 border border-white/10 bg-white/5 mb-10 text-center">
                <p className="font-mono text-sm text-gray-400">Please login to join the discussion.</p>
              </div>
            )}

            <div className="space-y-6">
              {comments.map((comment) => (
                <div key={comment._id} className="p-6 border border-white/10 bg-black">
                  <div className="flex justify-between items-center mb-4">
                    <strong className="text-primary font-mono text-sm uppercase tracking-wider">
                      {comment.author?.username || 'User'}
                    </strong>
                    <small className="text-gray-600 font-mono text-xs">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <p className="text-gray-300 leading-relaxed">{comment.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-28 p-6 bg-white/5 border border-white/10">
            <h3 className="text-xl font-black text-white uppercase tracking-wider mb-6 pb-4 border-b border-white/10">
              Acquisition Details
            </h3>
            
            <dl className="space-y-4 mb-8">
              <div className="flex justify-between">
                <dt className="font-mono text-xs text-gray-500 uppercase tracking-widest">Views</dt>
                <dd className="text-white font-mono">{blueprint.engagement?.viewCount || 0}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-mono text-xs text-gray-500 uppercase tracking-widest">Status</dt>
                <dd className="text-white font-mono uppercase text-xs border border-white/20 px-2 py-0.5">{blueprint.status || 'Active'}</dd>
              </div>
            </dl>

            {validation && (
              <div className="mb-8 p-4 bg-black border border-primary/30">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-mono text-xs text-primary uppercase tracking-widest">AI Validation Score</span>
                  <span className="text-2xl font-black text-white">{validation.overallScore}/100</span>
                </div>
                <div className="space-y-2 text-xs font-mono text-gray-400">
                   <div className="flex justify-between"><span>Demand</span> <span className="text-white">{validation.scores?.marketDemand}/10</span></div>
                   <div className="flex justify-between"><span>Feasibility</span> <span className="text-white">{validation.scores?.technicalFeasibility}/10</span></div>
                   <div className="flex justify-between"><span>Monetization</span> <span className="text-white">{validation.scores?.monetization}/10</span></div>
                </div>
              </div>
            )}

            <button
              className="w-full py-4 bg-primary hover:bg-white text-black font-bold uppercase tracking-widest transition-colors shadow-glow disabled:opacity-50"
              onClick={handlePurchase}
              disabled={purchasing}
            >
              {purchasing ? 'VERIFYING...' : 'PURCHASE BLUEPRINT'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlueprintDetail;
