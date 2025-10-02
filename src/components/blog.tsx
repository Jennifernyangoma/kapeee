import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";

interface Post {
    id: string;
    title: string;
    excerpt: string;
    image: string;
    category: string;
    createdAt: string;
}

export default function BlogPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("All");

    // Fetch posts from API
    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await fetch("http://localhost:5000/api/posts"); // Replace with your API
            const data = await res.json();
            setPosts(data);
            setFilteredPosts(data);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // Filter posts by search & category
    useEffect(() => {
        let filtered = posts;

        if (categoryFilter !== "All") {
            filtered = filtered.filter((post) => post.category === categoryFilter);
        }

        if (search.trim() !== "") {
            filtered = filtered.filter((post) =>
                post.title.toLowerCase().includes(search.toLowerCase())
            );
        }

        setFilteredPosts(filtered);
    }, [search, categoryFilter, posts]);

    const categories = ["All", "Technology", "Design", "Business", "Lifestyle"];

    return (
        <div className="container-max mx-auto p-6 grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Main content */}
            <div className="md:col-span-3">
                <h1 className="text-3xl font-bold mb-6">Our Blog</h1>

                {/* Search & Category Filter */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="border p-2 rounded w-full sm:w-1/2"
                    />
                    <select
                        className="border p-2 rounded w-full sm:w-1/4"
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                    >
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>
                                {cat}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Posts Grid */}
                {loading ? (
                    <p>Loading posts...</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
                        {filteredPosts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-white rounded-lg shadow hover:shadow-lg transition p-4 flex flex-col"
                            >
                                <img
                                    src={post.image}
                                    alt={post.title}
                                    className="h-48 w-full object-cover rounded-t-lg mb-4"
                                />
                                <span className="text-sm text-gray-500 mb-2">{post.category}</span>
                                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                                    {post.title}
                                </h2>
                                <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                                <Link
                                    to={`/blog/${post.id}`}
                                    className="mt-auto inline-block text-blue-500 hover:underline"
                                >
                                    Read more
                                </Link>

                                {/* Social sharing */}
                                <div className="flex mt-4 space-x-3">
                                    <a
                                        href={`https://twitter.com/share?url=/blog/${post.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FaTwitter className="text-blue-400 hover:text-blue-600" />
                                    </a>
                                    <a
                                        href={`https://www.facebook.com/sharer/sharer.php?u=/blog/${post.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FaFacebook className="text-blue-600 hover:text-blue-800" />
                                    </a>
                                    <a
                                        href={`https://www.linkedin.com/shareArticle?url=/blog/${post.id}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <FaLinkedin className="text-blue-500 hover:text-blue-700" />
                                    </a>
                                </div>
                            </div>
                        ))}

                        {filteredPosts.length === 0 && (
                            <p className="text-gray-500 col-span-full">
                                No posts found for your search.
                            </p>
                        )}
                    </div>
                )}
            </div>

            {/* Sidebar */}
            <div className="md:col-span-1 sticky top-6 space-y-6">
                <div className="bg-white rounded-lg p-4 shadow">
                    <h3 className="text-xl font-semibold mb-4">Categories</h3>
                    <ul className="space-y-2">
                        {categories.map((cat) => (
                            <li key={cat}>
                                <button
                                    onClick={() => setCategoryFilter(cat)}
                                    className={`${categoryFilter === cat ? "text-yellow-500 font-bold" : "text-gray-700"
                                        } hover:text-yellow-400`}
                                >
                                    {cat}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white rounded-lg p-4 shadow">
                    <h3 className="text-xl font-semibold mb-4">Recent Posts</h3>
                    <ul className="space-y-2">
                        {posts.slice(0, 5).map((post) => (
                            <li key={post.id}>
                                <Link
                                    to={`/blog/${post.id}`}
                                    className="text-gray-700 hover:text-yellow-500"
                                >
                                    {post.title}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
