import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { getHeroContent } from '../utils/api';
import { io } from 'socket.io-client';

interface HeroContent {
  _id: string;
  title: string;
  subtitle?: string;
  image?: string;
  active?: boolean;
  order?: number;
  createdAt: string;
  updatedAt: string;
}

export default function Hero() {
  const [heroContent, setHeroContent] = useState<HeroContent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeroContent();
    
    // Set up real-time updates
    const socket = io('http://localhost:5000');
    
    socket.on('hero:updated', (hero) => {
      setHeroContent(prev => {
        const existing = prev.find(h => h._id === hero._id);
        if (existing) {
          return prev.map(h => h._id === hero._id ? hero : h);
        } else {
          return [...prev, hero].sort((a, b) => (a.order || 0) - (b.order || 0));
        }
      });
    });

    return () => socket.disconnect();
  }, []);

  const fetchHeroContent = async () => {
    try {
      setLoading(true);
      const content = await getHeroContent();
      setHeroContent(content);
    } catch (error) {
      console.error('Error fetching hero content:', error);
      // Fallback to static content if API fails
      setHeroContent([
        {
          _id: 'fallback-1',
          title: 'SUMMER SALE',
          subtitle: 'NEW ARRIVALS',
          image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          active: true,
          order: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'fallback-2',
          title: 'WHITE SNEAKERS',
          subtitle: 'MIN. 30% OFF',
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          active: true,
          order: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          _id: 'fallback-3',
          title: 'WOMEN\'S FASHION',
          subtitle: 'UP TO 65% OFF',
          image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80',
          active: true,
          order: 2,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="container-max mt-6 flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </section>
    );
  }

  const mainBanner = heroContent.find(banner => banner.order === 0) || heroContent[0];
  const sideBanners = heroContent.filter(banner => banner.order !== 0).sort((a, b) => (a.order || 0) - (b.order || 0));

  return (
    <section className="container-max mt-6 grid gap-6 md:grid-cols-3">
      {/* Main Summer Sale Banner */}
      {mainBanner && (
        <Link
          to="/shop"
          className="relative col-span-2 overflow-hidden group bg-white rounded-lg"
        >
          <img
            src={mainBanner.image || 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
            alt={mainBanner.title}
            className="h-80 w-full object-cover md:h-[500px] transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 text-gray-800">
            {mainBanner.subtitle && <p className="text-sm font-medium mb-2 text-white">{mainBanner.subtitle}</p>}
            <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white" style={{ fontFamily: 'serif' }}>
              {mainBanner.title}
            </h2>
            <div className="flex items-center gap-4 mb-6">
              
            </div>
            <button className="border-2 border-brand  text-brand px-6 py-3 font-semibold hover:bg-brand hover:text-white transition-colors">
              SHOP NOW
            </button>
          </div>
        </Link>
      )}

      {/* Right side stacked banners */}
      <div className="grid gap-6">
        {sideBanners.slice(0, 2).map((banner) => (
          <Link
            key={banner._id}
            to="/shop"
            className="relative overflow-hidden group bg-white rounded-lg h-48"
          >
            <img
              src={banner.image || 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'}
              alt={banner.title}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute left-4 bottom-4 text-gray-800">
              {banner.subtitle && <p className="text-brand font-semibold text-sm text-white">{banner.subtitle}</p>}
              <h3 className="font-bold text-2xl mb-1 text-white">{banner.title}</h3>
              <button className="bg-brand text-white px-4 py-2 text-sm font-semibold hover:bg-brand-dark transition-colors">
                SHOP NOW
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}