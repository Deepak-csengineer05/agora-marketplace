import React, { useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { productService } from '../services/productService';

const BackendTest = () => {
  const [status, setStatus] = useState('Testing...');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    testBackendConnection();
  }, []);

  const testBackendConnection = async () => {
    try {
      setStatus('Testing health check...');
      
      // Test health endpoint
      const response = await fetch('http://localhost:5000/api/health');
      if (!response.ok) throw new Error('Health check failed');
      
      setStatus('Health check passed. Testing products API...');
      
      // Test products API
      const productsData = await productService.getProducts();
      setProducts(productsData.data || []);
      
      setStatus(`✅ Backend connected successfully! Found ${productsData.count} products.`);
      
    } catch (error) {
      setStatus(`❌ Backend connection failed: ${error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', margin: '20px' }}>
      <h3>Backend Connection Test</h3>
      <p>{status}</p>
      {products.length > 0 && (
        <div>
          <h4>Sample Products:</h4>
          <ul>
            {products.slice(0, 3).map(product => (
              <li key={product._id}>{product.name} - ₹{product.price}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BackendTest;