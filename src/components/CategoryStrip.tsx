import { Link } from "react-router-dom";

const cats = [
  { 
    title: "Men", 
    src: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    link: "/mens-fashion"
  },
  { 
    title: "Women", 
    src: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    link: "/womens-fashion"
  },
  { 
    title: "Shoes", 
    src: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    link: "/shop"
  },
  { 
    title: "Bags & Back...", 
    src: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    link: "/shop"
  },
  { 
    title: "Watches", 
    src: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    link: "/shop"
  },
  { 
    title: "Jewellery", 
    src: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    link: "/shop"
  },
  { 
    title: "Accessories", 
    src: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    link: "/shop"
  },
  { 
    title: "Dresses", 
    src: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    link: "/womens-fashion"
  },
  { 
    title: "Tops", 
    src: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    link: "/womens-fashion"
  },
  { 
    title: "Lingerie & Ni...", 
    src: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    link: "/womens-fashion"
  },
];

export default function CategoryStrip() {
  return (
    <section className="container-max mt-8">
      <div className="flex gap-6 overflow-x-auto pb-4">
        {cats.map((c) => (
          <Link
            key={c.title}
            to={c.link}
            className="flex flex-col items-center gap-3 hover:opacity-80 transition-opacity min-w-[80px]"
          >
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 hover:border-brand transition-colors">
              <img
                src={c.src}
                alt={c.title}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-sm font-medium text-gray-700 text-center">{c.title}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
