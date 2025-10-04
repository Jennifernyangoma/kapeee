import { useState, useEffect } from 'react';
import * as LucideIcons from 'lucide-react';
import { io } from 'socket.io-client';

interface Feature {
  _id: string;
  title: string;
  description: string;
  icon: string;
  iconType: 'lucide' | 'image';
  active: boolean;
  order: number;
}

export default function Features() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatures();

    // Real-time updates via Socket.IO
    const socket = io('http://localhost:5000');
    
    socket.on('icon:created', (icon: Feature) => {
      if (icon.active) {
        setFeatures(prev => [...prev, icon].sort((a, b) => a.order - b.order));
      }
    });
    
    socket.on('icon:updated', (icon: Feature) => {
      if (icon.active) {
        setFeatures(prev => {
          const exists = prev.find(f => f._id === icon._id);
          if (exists) {
            return prev.map(f => f._id === icon._id ? icon : f).sort((a, b) => a.order - b.order);
          }
          return [...prev, icon].sort((a, b) => a.order - b.order);
        });
      } else {
        setFeatures(prev => prev.filter(f => f._id !== icon._id));
      }
    });
    
    socket.on('icon:deleted', ({ id }: { id: string }) => {
      setFeatures(prev => prev.filter(f => f._id !== id));
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const fetchFeatures = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/icons/active');
      const data = await response.json();
      console.log('Fetched features:', data);
      setFeatures(data);
    } catch (error) {
      console.error('Error fetching features:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderIcon = (feature: Feature) => {
    if (feature.iconType === 'image') {
      return (
        <img 
          src={feature.icon} 
          alt={feature.title} 
          className="w-12 h-12 object-contain"
        />
      );
    }
    
    // Render Lucide icon dynamically
    const IconComponent = (LucideIcons as any)[feature.icon];
    if (IconComponent) {
      return <IconComponent size={48} className="text-blue-600" />;
    }
    
    // Fallback if icon not found
    return <LucideIcons.Box size={48} className="text-gray-400" />;
  };

  if (loading) {
    return (
      <section className="container-max my-16">
        <div className="text-center">
          <p className="text-gray-400">Loading features...</p>
        </div>
      </section>
    );
  }

  if (features.length === 0) {
    return null;
  }

  return (
    <section className="container-max my-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
        <p className="text-gray-600">Discover the benefits of shopping with Kapee</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {features.map((feature) => (
          <div 
            key={feature._id} 
            className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition-shadow border"
          >
            <div className="flex justify-center mb-4">
              {renderIcon(feature)}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-sm text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

