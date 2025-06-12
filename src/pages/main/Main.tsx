import { useNavigate } from 'react-router-dom';
import Button from '../../components/button/Button';
import ProductCard from '../../components/product/ProductCard';
import PromoCodeBanner from '../../components/PromoCodeBanner/PromoCodeBanner';
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
import gift1 from '../../assets/gift1.jpg';
import gift2 from '../../assets/gift2.jpg';
import gift3 from '../../assets/gift3.jpg';
import gift4 from '../../assets/gift4.jpg';
import macaronsSweetDecorativeCandy from '../../assets/macarons-sweet-decorative-candy.mp4';
import './Main.css';

const Main = () => {
  const navigate = useNavigate();
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

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

  const reviews = [
    {
      review:
        "Absolutely divine! I ordered a custom box for my anniversary, and every single macaron was a work of art. The Pistachio was incredibly authentic, and the Raspberry burst with fresh flavor. They arrived perfectly packaged and fresh. Truly the best I've had outside of Paris!",
      author: 'Eleanor V.',
      image: customer5,
      rating: 5,
      city: 'New York, NY ',
    },
    {
      review:
        "I'm usually skeptical about ordering perishable food online, but exceeded all expectations. The shipping was incredibly fast, and the macarons were pristine. The Dark Chocolate is my new obsession — so rich and smooth. Highly recommend for any special occasion or just a treat for yourself!",
      author: 'Marcus L.',
      image: customer6,
      rating: 4,
      city: 'Austin, TX',
    },
    {
      review:
        "As a pastry chef myself, I appreciate true craftsmanship. These macarons are simply exquisite. The shells have that perfect delicate crisp, and the ganache fillings are incredibly balanced. The 'surprise assortment' was a fantastic way to discover new favorites. You can taste the quality in every bite.",
      author: 'Isabella R.',
      image: customer7,
      rating: 5,
      city: 'Los Angeles, CA',
    },
    {
      review:
        "I sent a gift box to my sister, and she raved about them! She particularly loved the Classic Vanilla, saying it was 'pure comfort.' The ordering process was seamless, and the customer service was fantastic when I had a question about delivery. A perfect gift solution!",
      author: 'David S.',
      image: customer8,
      rating: 5,
      city: 'Chicago, IL',
    },
  ];

  const faqData = [
    {
      category: 'Ordering & Delivery',
      question: 'How are your macarons packaged to ensure freshness during shipping?',
      answer:
        'We meticulously package our macarons in insulated pouches with air cushions to protect them from temperature fluctuations and physical damage during transit. We ship them fresh, never frozen, so they arrive in perfect condition, ready to enjoy.',
    },
    {
      category: 'Ordering & Delivery',
      question: 'What are your shipping times and costs?',
      answer:
        'We offer various shipping options, including standard and expedited delivery. Standard shipping typically takes [X-Y] business days, and expedited options are available for faster delivery. Shipping costs are calculated at checkout based on your location and chosen speed. You can see an estimate before finalizing your purchase.',
    },
    {
      category: 'Ordering & Delivery',
      question: 'Can I track my order?',
      answer:
        "Yes! Once your order ships, you will receive a confirmation email with a tracking number. You can use this number to monitor your package's journey directly to your door",
    },
    {
      category: 'Product Information & Care',
      question: 'How long do your macarons stay fresh, and how should I store them?',
      answer:
        'For optimal freshness, we recommend consuming your macarons within 5-7 days of arrival. Store them in an airtight container in the refrigerator. For best taste, allow them to come to room temperature for about 15-20 minutes before enjoying.',
    },
    {
      category: 'Product Information & Care',
      question: 'Are your macarons gluten-free?',
      answer:
        "Yes! All of our macarons are naturally gluten-free as they're made with almond flour instead of wheat flour. However, they are produced in a facility that also processes gluten-containing ingredients.",
    },
    {
      category: 'Product Information & Care',
      question: 'What ingredients do you use in your macarons?',
      answer:
        'We use only premium ingredients: almond flour, powdered sugar, egg whites, and natural flavorings. Our ganache fillings contain butter, cream, chocolate, and natural fruit purees or extracts depending on the flavor.',
    },
    {
      category: 'Custom Orders & Events',
      question: 'Do you offer custom macaron orders for events or corporate gifting?',
      answer:
        'Absolutely! We specialize in custom orders for weddings, corporate events, and special occasions. We can create custom colors, flavors, and packaging. Please contact us at least 2 weeks in advance for custom orders.',
    },
  ];

  const toggleFAQ = (index: number) => {
    setExpandedFAQ(expandedFAQ === index ? null : index);
  };

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
        <video src={macaronsSweetDecorativeCandy} autoPlay muted loop className="hero-video" />
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

      <section className="section promo-code">
        <PromoCodeBanner />
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

      <section className="section gift">
        <h2 className="section-title">The Perfect Gift</h2>
        <ul>
          <li>
            <div className="gift-icon">
              <div className="gift-number">01</div>
              <img src={gift1} alt="gift" />
            </div>
            <h3>Celebrations and special occasions</h3>
            <p>
              Mark life's big moments with elegance. Our macarons add an unforgettable touch of joy
              to any celebration
            </p>
          </li>
          <li>
            <div className="gift-icon">
              <div className="gift-number">02</div>
              <img src={gift2} alt="gift" />
            </div>
            <h3>Romantic gestures and sweet surprises</h3>
            <p>
              Express your affection with a delicate treat. A thoughtful way to show you care,
              perfect for any sweet surprise
            </p>
          </li>
          <li>
            <div className="gift-icon">
              <div className="gift-number">03</div>
              <img src={gift3} alt="gift" />
            </div>
            <h3>Corporate gifts for lasting impression</h3>
            <p>
              Elevate your business gifting. Impress clients and reward employees with a unique,
              memorable taste of quality
            </p>
          </li>
          <li>
            <div className="gift-icon">
              <div className="gift-number">04</div>
              <img src={gift4} alt="gift" />
            </div>
            <h3>A Little Everyday Indulgence</h3>
            <p>
              Some days simply call for luxury. Treat yourself or someone special to a moment of
              delicious bliss, just because
            </p>
          </li>
        </ul>
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

      <section className="section faq">
        <div className="faq-wrapper">
          <h2 className="section-title">Your Questions, Answered</h2>
          <div className="faq-subtitle">
            <p>Have questions? We've got answers.</p>
            <p>
              For everything else email us on <b>info@macarons-shop.com</b>
            </p>
          </div>
        </div>
        <div className="faq-container">
          {faqData.map((faq, index) => (
            <div key={index} className={`faq-item ${expandedFAQ === index ? 'expanded' : ''}`}>
              <div className="faq-question" onClick={() => toggleFAQ(index)}>
                <div className="faq-category">{faq.category}</div>
                <div className="faq-question-content">
                  <h3>{faq.question}</h3>
                  <span className="faq-toggle">{expandedFAQ === index ? '−' : '+'}</span>
                </div>
              </div>
              {expandedFAQ === index && (
                <div className="faq-answer">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="section banner">
        <div className="banner-title">
          <h2>Indulge in Elegance</h2>
        </div>
        <div className="banner-content">
          <p>
            Don't just dream of exquisite French macarons — experience them. Our handcrafted
            delights are perfect for any occasion, or simply to treat yourself
          </p>
          <Button onClick={() => navigate('/catalog')}>Order Now</Button>
        </div>
      </section>
    </div>
  );
};

export default Main;
