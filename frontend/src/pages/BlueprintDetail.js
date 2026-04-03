import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { blueprintsAPI, commentsAPI, transactionsAPI, validationAPI } = '../api/client';
import { useAuth } from '../context/AuthContext';
import styles from './BlueprintDetail.module.css';

const BlueprintDetail = () => {
  const { id } = useParams();
  const { user, token } = useAuth();
  const [blueprint, setBlueprint] = useState(null);
  const [comments, setComments] = useState([]);
  const [validation, setValidation] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bpResponse, commentsResponse] = await Promise.all([
        blueprintsAPI.getOne(id),
        commentsAPI.getByBlueprint(id),
      ]);

      setBlueprint(bpResponse.data);
      setComments(commentsResponse.data.comments);

      // Fetch validation if available
      try {
        const validationResponse = await validationAPI.getValidation(id);
        setValidation(validationResponse.data);
      } catch (error) {
        // Validation might not exist yet
      }
    } catch (error) {
      console.error('Error fetching blueprint:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      alert('Please login to comment');
      return;
    }

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
    if (!token) {
      alert('Please login to purchase');
      return;
    }

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

  if (loading) return <div className={styles.container}>Loading...</div>;
  if (!blueprint) return <div className={styles.container}>Blueprint not found</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>{blueprint.title}</h1>
        <div className={styles.meta}>
          <span className={styles.category}>{blueprint.category}</span>
          <span className={styles.price}>${blueprint.pricing}</span>
        </div>
        <p className={styles.description}>{blueprint.description}</p>
      </div>

      <div className={styles.content}>
        <div className={styles.main}>
          <section className={styles.section}>
            <h2>Problem Statement</h2>
            <p>{blueprint.content?.problemStatement}</p>
          </section>

          <section className={styles.section}>
            <h2>Target Audience</h2>
            {blueprint.content?.targetAudience?.map((segment, idx) => (
              <div key={idx} className={styles.segment}>
                <h4>{segment.segment}</h4>
                <p>{segment.description}</p>
                <small>Market Size: {segment.size}</small>
              </div>
            ))}
          </section>

          <section className={styles.section}>
            <h2>Market Research</h2>
            <p><strong>Market Size:</strong> {blueprint.content?.marketResearch?.marketSize}</p>
            <p><strong>Competitors:</strong> {blueprint.content?.marketResearch?.competitors?.join(', ')}</p>
          </section>

          <section className={styles.section}>
            <h2>Monetization Strategy</h2>
            <p><strong>Model:</strong> {blueprint.content?.monetizationStrategy?.model}</p>
            <p><strong>Pricing:</strong> {blueprint.content?.monetizationStrategy?.pricingTier}</p>
          </section>

          {validation && (
            <section className={styles.section}>
              <h2>AI Validation Score</h2>
              <div className={styles.validationScore}>
                <div className={styles.scoreCircle}>{validation.overallScore}</div>
                <div className={styles.scoreDetails}>
                  <p>Market Demand: {validation.scores?.marketDemand}/10</p>
                  <p>Technical Feasibility: {validation.scores?.technicalFeasibility}/10</p>
                  <p>Monetization: {validation.scores?.monetization}/10</p>
                </div>
              </div>
            </section>
          )}

          <section className={styles.section}>
            <h2>Comments ({comments.length})</h2>
            {token && (
              <form onSubmit={handleCommentSubmit} className={styles.commentForm}>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  required
                />
                <button type="submit">Post Comment</button>
              </form>
            )}

            <div className={styles.commentsList}>
              {comments.map((comment) => (
                <div key={comment._id} className={styles.comment}>
                  <div className={styles.commentHeader}>
                    <strong>{comment.author?.firstName} {comment.author?.lastName}</strong>
                    <small>{new Date(comment.createdAt).toLocaleDateString()}</small>
                  </div>
                  <p>{comment.content}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <aside className={styles.sidebar}>
          <div className={styles.card}>
            <h3>Blueprint Details</h3>
            <p><strong>Author:</strong> {blueprint.author?.firstName} {blueprint.author?.lastName}</p>
            <p><strong>Category:</strong> {blueprint.category}</p>
            <p><strong>Price:</strong> ${blueprint.pricing}</p>
            <p><strong>Views:</strong> {blueprint.engagement?.viewCount}</p>
            <p><strong>Status:</strong> {blueprint.status}</p>
            <button
              className={styles.purchaseBtn}
              onClick={handlePurchase}
              disabled={purchasing}
            >
              {purchasing ? 'Purchasing...' : 'Purchase Blueprint'}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlueprintDetail;
