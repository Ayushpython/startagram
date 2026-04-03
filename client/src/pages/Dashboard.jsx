import React, { useState, useEffect, useCallback } from 'react';
import { blueprintsAPI, walletAPI } from '../api/client';
import { useAuth } from '../context/AuthContext';
import styles from './Dashboard.module.css';

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

  if (loading) return <div className={styles.container}>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1>Dashboard</h1>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h3>Wallet Balance</h3>
          <div className={styles.balance}>${wallet?.balance.toFixed(2) || '0.00'}</div>
          <p>Total Earnings: ${wallet?.totalEarnings.toFixed(2) || '0.00'}</p>
          <p>Total Spent: ${wallet?.totalSpent.toFixed(2) || '0.00'}</p>
        </div>

        <div className={styles.card}>
          <h3>Your Metrics</h3>
          <p>Blueprints Created: {user?.metrics?.blueprintsCreated || 0}</p>
          <p>Blueprints Purchased: {user?.metrics?.blueprintsPurchased || 0}</p>
          <p>Rating: ⭐ {user?.metrics?.rating || 5}/5</p>
        </div>
      </div>

      <section className={styles.section}>
        <h2>Your Blueprints ({myBlueprints.length})</h2>
        {myBlueprints.length === 0 ? (
          <p>You haven't created any blueprints yet.</p>
        ) : (
          <div className={styles.blueprintsList}>
            {myBlueprints.map((blueprint) => (
              <div key={blueprint._id} className={styles.blueprintItem}>
                <h4>{blueprint.title}</h4>
                <p>{blueprint.description}</p>
                <div className={styles.itemMeta}>
                  <span className={styles.status}>{blueprint.status}</span>
                  <span className={styles.price}>${blueprint.pricing}</span>
                  <span className={styles.sales}>Sales: {blueprint.sales?.purchaseCount || 0}</span>
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
