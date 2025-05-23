import { useNavigate } from 'react-router-dom';
import Button from '../../components/button/Button';
import ProductCard from '../../components/product/ProductCard';
import { useEffect, useState } from 'react';
import { getProductsList } from '../../services/products.service';
import { Product } from '../../types/interfaces';
import toCardAdapter from '../../lib/utils/productDataAdapters/toCardAdapter';
import './Main.css';

const Main = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const products = await getProductsList(4);
        if (products) {
          setFeaturedProducts(products);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const flavors = [
    { name: 'Classic Vanilla', description: 'Delicate and timeless, our signature flavor' },
    { name: 'Rich Chocolate', description: 'Intense cocoa with a smooth finish' },
    { name: 'Vibrant Raspberry', description: 'Fresh and fruity with a tangy twist' },
    { name: 'Earthy Pistachio', description: 'Nutty and sophisticated' },
  ];

  return (
    <div className="main-container">
      <section className="hero-section">
        <video
          src="src/assets/macarons-sweet-decorative-candy.mp4"
          autoPlay
          muted
          loop
          className="hero-video"
        />
        <h1 className="title">Premium French Macarons</h1>
        <p className="subtitle">
          Step into a world of indulgence — handcrafted, gluten-free, and full of flavor
        </p>
        <Button
          className="hero-button"
          onClick={() => {
            navigate('/catalog');
          }}
        >
          Order now
        </Button>
      </section>

      <section className="section featured-products">
        <div className="section-title">
          <h2>Products</h2>
          <div className="view-all-container">
            <Button onClick={() => navigate('/catalog')}>View all products</Button>
          </div>
        </div>
        <div className="featured-products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} {...toCardAdapter(product)} />
          ))}
        </div>
      </section>

      <section className="section flavors">
        <h2 className="section-title">Try our surprise assortment for something new!</h2>
        <div className="flavor-flex">
          {flavors.map((flavor, index) => (
            <div key={index} className="flavor-card">
              <h3>{flavor.name}</h3>
              <p>{flavor.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">The Perfect Gift</h2>
        <ul>
          <li>Celebrations and special occasions</li>
          <li>Romantic gestures and sweet surprises</li>
          <li>Corporate gifts that leave a lasting impression</li>
          <li>Everyday indulgence — just because</li>
        </ul>
        <p>
          Naturally gluten-free and elegantly packaged, our macarons are made to delight. Each box
          is carefully crafted to ensure your gift arrives in perfect condition.
        </p>
      </section>
    </div>
  );
};

export default Main;
