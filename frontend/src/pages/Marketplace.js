import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { marketplaceAPI } from '../api/client';
import styles from './Marketplace.module.css';

const Marketplace = () => {
  const [blueprints, setBlueprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    sortBy: 'newest',
  });

  useEffect(() => {
    fetchBlueprints();
  }, [filters]);

  const fetchBlueprints = async () => {
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
  };

  return (
    <div className={styles.container}>
      <h1>Marketplace</h1>

      <div className={styles.filters}>
        <input
          type="text"
          placeholder="Search blueprints..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
        />

        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="newest">Newest</option>
          <option value="price_low">Price: Low to High</option>
          <option value="price_high">Price: High to Low</option>
          <option value="rating">Top Rated</option>
        </select>
      </div>

      {loading ? (
        <p>Loading blueprints...</p>
      ) : blueprints.length === 0 ? (
        <p>No blueprints found</p>
      ) : (
        <div className={styles.grid}>
          {blueprints.map((blueprint) => (
            <Link
              key={blueprint._id}
              to={`/blueprint/${blueprint._id}`}
              className={styles.card}
            >
              <h3>{blueprint.title}</h3>
              <p>{blueprint.description}</p>
              <div className={styles.meta}>
                <span className={styles.category}>{blueprint.category}</span>
                <span className={styles.price}>${blueprint.pricing}</span>
              </div>
              <div className={styles.author}>
                By {blueprint.author?.firstName} {blueprint.author?.lastName}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Marketplace;
