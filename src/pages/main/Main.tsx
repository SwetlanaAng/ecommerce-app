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
        <video src="src/assets/macaron-video.mp4" autoPlay muted loop className="hero-video" />
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
        <h2 className="section-title">Products</h2>
        <div className="featured-products-grid">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} {...toCardAdapter(product)} />
          ))}
        </div>
        <div className="view-all-container">
          <Button onClick={() => navigate('/catalog')}>View all products</Button>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Our Flavors</h2>
        <p>
          From classic vanilla and rich chocolate to vibrant raspberry and earthy pistachio —
          discover flavors for every mood. Try our surprise assortment for something new!
        </p>
        <div className="flavor-grid">
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

      <section className="section">
        <h2 className="section-title">What Our Customers Say</h2>
        <blockquote className="quote">
          "I never knew macarons could taste this good! The texture is perfect, and the flavors are
          absolutely divine. Will definitely order again!"
          <br />
          <strong>— Anna, London</strong>
        </blockquote>
        <blockquote className="quote">
          "The packaging is beautiful, and the macarons arrived fresh and perfect. A wonderful gift
          that made my friend's day!"
          <br />
          <strong>— Michael, Manchester</strong>
        </blockquote>
      </section>
    </div>
  );
};

export default Main;
