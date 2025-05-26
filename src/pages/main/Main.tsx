import { useNavigate } from 'react-router-dom';
import Button from '../../components/button/Button';
import ProductCard from '../../components/product/ProductCard';
import { useEffect, useState } from 'react';
import { getProductsList } from '../../services/products.service';
import { Product } from '../../types/interfaces';
import toCardAdapter from '../../lib/utils/productDataAdapters/toCardAdapter';
import customer1 from '../../assets/customer-1.jpg';
import customer2 from '../../assets/customer-2.jpg';
import customer3 from '../../assets/customer-3.jpg';
import customer4 from '../../assets/customer-4.jpg';
import customer5 from '../../assets/customer-5.jpg';
import customer6 from '../../assets/customer-6.jpg';
import customer7 from '../../assets/customer-7.jpg';
import customer8 from '../../assets/customer-8.jpg';
import number1 from '../../assets/numbers-icons-1.svg';
import number2 from '../../assets/numbers-icons-2.svg';
import number3 from '../../assets/numbers-icons-3.svg';
import number4 from '../../assets/numbers-icons-4.svg';
import star from '../../assets/star.svg';
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

  const numbers = [
    {
      icon: <img src={number1} alt="icon" />,
      textIcon: 'Variety',
      number: '24+',
      text: 'Exquisite Flavors',
    },
    {
      icon: <img src={number2} alt="icon" />,
      textIcon: 'Heritage',
      number: '100%',
      text: 'Authentic French Recipe',
    },
    {
      icon: <img src={number3} alt="icon" />,
      textIcon: 'Quality',
      number: '7',
      text: 'Days Peak Freshness',
    },
    {
      icon: <img src={number4} alt="icon" />,
      textIcon: 'Delivered',
      number: '50K+',
      text: 'Macarons Shipped Annually',
    },
  ];

  const benefits = [
    {
      title: 'Authentic French Craftsmanship',
      description:
        'Each macaron is meticulously hand-piped by our expert pastry chefs, trained in the revered traditions of French patisserie. We honor the authentic French macaron recipe, ensuring a perfect balance of crunchy exterior and chewy interior',
    },
    {
      title: 'Superior Ingredients, Unforgettable Flavor',
      description:
        'We use only the finest, sustainably sourced almond flour, pure Madagascar vanilla, and premium cocoa. Our signature ganache fillings, made without butter, ensure a smoother taste that truly highlights each vibrant flavor and prevents melting during transit',
    },
    {
      title: 'Freshness, Delivered to Your Door',
      description:
        'Unlike others, we ship our macarons fresh, never frozen. Each order is carefully packaged with air cushions and insulated pouches to ensure your delicate treats arrive in pristine condition, ready to be savored',
    },
    {
      title: 'Gluten-Friendly Indulgence',
      description:
        'Crafted with almond flour, our macarons offer a naturally gluten-friendly option for those seeking a delightful treat without compromise',
    },
    {
      title: 'A Taste of Paris, Anywhere',
      description:
        'Experience the elegance and charm of a Parisian patisserie from the comfort of your home. Our classic Parisian-sized macarons are designed to transport you with every bite',
    },
  ];

  const reviews = [
    {
      review:
        'Absolutely divine! I ordered a custom box for my anniversary, and every single macaron was a work of art. The Pistachio was incredibly authentic, and the Raspberry burst with fresh flavor. They arrived perfectly packaged and fresh. Truly the best I’ve had outside of Paris!',
      author: 'Eleanor V.',
      image: customer5,
      rating: 5,
      city: 'New York, NY ',
    },
    {
      review:
        'I’m usually skeptical about ordering perishable food online, but exceeded all expectations. The shipping was incredibly fast, and the macarons were pristine. The Dark Chocolate is my new obsession — so rich and smooth. Highly recommend for any special occasion or just a treat for yourself!',
      author: 'Marcus L.',
      image: customer6,
      rating: 4,
      city: 'Austin, TX',
    },
    {
      review:
        'As a pastry chef myself, I appreciate true craftsmanship. These macarons are simply exquisite. The shells have that perfect delicate crisp, and the ganache fillings are incredibly balanced. The ’surprise assortment’ was a fantastic way to discover new favorites. You can taste the quality in every bite.',
      author: 'Isabella R.',
      image: customer7,
      rating: 5,
      city: 'Los Angeles, CA',
    },
    {
      review:
        'I sent a gift box to my sister, and she raved about them! She particularly loved the Classic Vanilla, saying it was ’pure comfort.’ The ordering process was seamless, and the customer service was fantastic when I had a question about delivery. A perfect gift solution!',
      author: 'David S.',
      image: customer8,
      rating: 5,
      city: 'Chicago, IL',
    },
  ];

  return (
    <div className="main-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="title">
            Premium <span className="title-highlight">French</span> Macarons
          </h1>
          <div className="subtitle-container">
            <p className="subtitle">
              Our handcrafted macarons are a symphony of delicate crispness, velvety ganache, and
              vibrant flavors, meticulously prepared to bring a touch of Parisian elegance directly
              to your door
            </p>
            <Button
              className="hero-button"
              onClick={() => {
                navigate('/catalog');
              }}
            >
              Order Now
            </Button>
          </div>
          <div className="customers-container">
            <div className="customer-card">
              <img src={customer1} alt="Customer 1" />
              <img src={customer2} alt="Customer 2" />
              <img src={customer3} alt="Customer 3" />
              <img src={customer4} alt="Customer 4" />
            </div>
            <p className="customers-text">Trusted by 10 000+ happy customers worldwide</p>
          </div>
        </div>
        <video
          src="src/assets/macarons-sweet-decorative-candy.mp4"
          autoPlay
          muted
          loop
          className="hero-video"
        />
      </section>

      <section className="section numbers">
        <div className="numbers-flex">
          {numbers.map((number, index) => (
            <div key={index} className="number-card">
              <div className="number-icon">
                {number.icon} {number.textIcon}
              </div>
              <div className="number-text">
                <div className="number-number">{number.number}</div>
                <div className="number-text">{number.text}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="section featured-products">
        <div className="section-title">
          <h2>Products</h2>
          <div className="view-all-container">
            <Button className="view-all-button" onClick={() => navigate('/catalog')}>
              View all products →
            </Button>
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
        <Button className="flavor-button">Order Now</Button>
      </section>

      <section className="section">
        <h2 className="section-title">The Perfect Gift</h2>
        <ul>
          <li>Celebrations and special occasions</li>
          <li>Romantic gestures and sweet surprises</li>
          <li>Corporate gifts that leave a lasting impression</li>
          <li>Everyday indulgence — just because</li>
        </ul>
      </section>

      <section className="section benefits">
        <h2 className="section-title">Why Choose Our Macarons? </h2>
        <div className="benefits-flex">
          {benefits.map((benefit, index) => (
            <div key={index} className="benefit-card">
              <div className="benefit-icon">
                <p>0{index + 1}</p>
              </div>
              <h3>{benefit.title}</h3>
              <p>{benefit.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section reviews">
        <h2 className="section-title">Customer Reviews</h2>
        <div className="reviews-flex">
          {reviews.map((review, index) => (
            <div key={index} className="review-card">
              <div className="review-text">
                <p>{review.review}</p>
              </div>
              <div className="review-author-container">
                <div className="review-author">
                  <img src={review.image} alt={review.author} />
                  <div className="review-author-info">
                    <h3>{review.author}</h3>
                    <p>{review.city}</p>
                  </div>
                </div>
                <div className="review-rating">
                  {Array.from({ length: review.rating }).map((_, index) => (
                    <img src={star} alt="star" key={index} />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Main;
