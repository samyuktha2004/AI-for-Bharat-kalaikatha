import { motion } from 'motion/react';
import { ArrowLeft, Plus, Edit, Eye, ToggleLeft, ToggleRight, IndianRupee, Package, Search, Trash2, ExternalLink } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import natarajaProductImage from 'figma:asset/852ca5c1ac40dbd85cdb673b76a77225c11846b5.png';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  createdAt: string;
  active: boolean;
  views?: number;
  stock?: number;
}

interface MyShopProps {
  onBack: () => void;
  onNavigate?: (view: string) => void;
}

export function MyShop({ onBack, onNavigate }: MyShopProps) {
  const [showDetailedText] = useState(
    localStorage.getItem('artisan_detailed_text') === 'true'
  );
  const [listings, setListings] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'inactive'>('all');

  // Load products from localStorage
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    try {
      const vaultItems = localStorage.getItem('kalaikatha_vault_items');
      const savedProducts = localStorage.getItem('kalaikatha_products');
      
      let products: Product[] = [];
      
      // Load from products storage first
      if (savedProducts) {
        products = JSON.parse(savedProducts);
      }
      
      // If no products but vault exists, add sample from vault
      if (products.length === 0 && vaultItems) {
        const vault = JSON.parse(vaultItems);
        products = vault
          .filter((item: any) => item.name?.includes('Product'))
          .map((item: any, index: number) => ({
            id: item.id || `product-${Date.now()}-${index}`,
            name: item.name || 'Untitled Product',
            description: item.description || '',
            price: item.price || 0,
            image: item.image || natarajaProductImage,
            createdAt: item.createdAt || new Date().toISOString(),
            active: true,
            views: Math.floor(Math.random() * 500),
            stock: Math.floor(Math.random() * 10) + 1,
          }));
      }

      // Add demo product if no real products
      if (products.length === 0) {
        products = [
          {
            id: 'demo-1',
            name: 'Hand-Chiselled Bronze Nataraja (12")',
            description: 'A beautiful handcrafted bronze sculpture featuring the cosmic dancer Lord Nataraja',
            price: 18500,
            image: natarajaProductImage,
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            active: true,
            views: 342,
            stock: 2,
          },
        ];
      }

      setListings(products);
    } catch (error) {
      console.error('Error loading products:', error);
      toast.error('Failed to load products');
    }
  };

  const handleEditProduct = (productId: string) => {
    const product = listings.find(l => l.id === productId);
    console.log('✏️ Editing product:', productId);
    toast.info(`Edit "${product?.name}" - Feature coming soon!`);
  };

  const handleToggleActive = (productId: string) => {
    setListings(prevListings =>
      prevListings.map(listing =>
        listing.id === productId
          ? { ...listing, active: !listing.active }
          : listing
      )
    );
    const product = listings.find(l => l.id === productId);
    const newStatus = !product?.active;
    
    // Save to localStorage
    const savedProducts = JSON.parse(localStorage.getItem('kalaikatha_products') || '[]');
    const updated = savedProducts.map((p: Product) =>
      p.id === productId ? { ...p, active: newStatus } : p
    );
    localStorage.setItem('kalaikatha_products', JSON.stringify(updated));
    
    console.log(`🔄 Toggled product #${productId} to ${newStatus ? 'active' : 'paused'}`);
    toast.success(newStatus ? '✅ Product is now live!' : '⏸️ Product paused');
  };

  const handleDeleteProduct = (productId: string) => {
    const product = listings.find(l => l.id === productId);
    setListings(listings.filter(l => l.id !== productId));
    
    // Save to localStorage
    const savedProducts = JSON.parse(localStorage.getItem('kalaikatha_products') || '[]');
    const updated = savedProducts.filter((p: Product) => p.id !== productId);
    localStorage.setItem('kalaikatha_products', JSON.stringify(updated));
    
    toast.success(`🗑️ Deleted "${product?.name}"`);
  };

  const handleViewAnalytics = (productId: string) => {
    const product = listings.find(l => l.id === productId);
    console.log('📊 Viewing analytics for:', productId);
    toast.info(`Analytics for "${product?.name}" - Views: ${product?.views || 0}, Revenue: ₹${((product?.price || 0) * (product?.stock || 0) * 0.3).toFixed(0)}`);
  };

  const handleAddNewProduct = () => {
    console.log('➕ Adding new product - navigating to AI Studio');
    toast.success('Opening AI Studio to create your product!');
    if (onNavigate) {
      onNavigate('studio');
    }
  };

  // Filter and search products
  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          listing.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = 
      filterActive === 'all' || 
      (filterActive === 'active' && listing.active) ||
      (filterActive === 'inactive' && !listing.active);
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-emerald-950 dark:to-gray-900 p-4 pt-20">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={onBack}
            className="p-4 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          </button>
          <div>
            <h1 className="text-2xl text-gray-900 dark:text-white">My Shop</h1>
            {showDetailedText && <p className="text-gray-600 dark:text-gray-400">Manage your product listings</p>}
          </div>
        </motion.div>

        {/* Add New Product Button */}
        <motion.button
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          onClick={handleAddNewProduct}
          className="w-full mb-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl shadow-lg hover:shadow-xl transition-all"
        >
          <div className="flex items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Plus className="w-6 h-6" />
            </div>
            {showDetailedText && <span className="text-lg">Add New Product</span>}
          </div>
        </motion.button>

        {/* Search & Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="mb-6 space-y-3"
        >
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search products by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilterActive('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterActive === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              All ({listings.length})
            </button>
            <button
              onClick={() => setFilterActive('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterActive === 'active'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Active ({listings.filter(l => l.active).length})
            </button>
            <button
              onClick={() => setFilterActive('inactive')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filterActive === 'inactive'
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              Paused ({listings.filter(l => !l.active).length})
            </button>
          </div>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-3 gap-4 mb-6"
        >
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
              <Package className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl text-gray-900 dark:text-white">{filteredListings.filter(l => l.active).length}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Eye className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl text-gray-900 dark:text-white">{filteredListings.reduce((sum, l) => sum + (l.views || 0), 0)}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Total Views</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-lg text-center">
            <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
              <IndianRupee className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl text-gray-900 dark:text-white">₹{(filteredListings.reduce((sum, l) => sum + (l.price * (l.stock || 1)), 0) / 1000).toFixed(0)}K</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">Inventory</p>
          </div>
        </motion.div>

        {/* Product Listings */}
        <div className="space-y-4">
          {filteredListings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
            >
              <Package className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                {searchTerm || filterActive !== 'all' ? 'No products found' : 'No products yet'}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                {searchTerm
                  ? `No products match "${searchTerm}"`
                  : 'Create your first product using AI Studio to get started!'}
              </p>
              <button
                onClick={handleAddNewProduct}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
              >
                Create Product
              </button>
            </motion.div>
          ) : (
            filteredListings.map((listing, index) => (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="p-4">
                  <div className="flex gap-4">
                    {/* Product Image */}
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={listing.image}
                        alt={listing.name}
                        className="w-full h-full object-cover"
                      />
                      {!listing.active && (
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-[1px] flex items-center justify-center">
                          <span className="text-white text-xs font-medium">Paused</span>
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-gray-900 dark:text-white flex-1">{listing.name}</h3>
                        <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap ml-2">
                          {new Date(listing.createdAt).toLocaleDateString('en-IN')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                        {listing.description}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <IndianRupee className="w-4 h-4" />
                          <span>₹{listing.price.toLocaleString()}</span>
                        </div>
                        {listing.stock && (
                          <div className="flex items-center gap-1">
                            <Package className="w-4 h-4" />
                            <span>{listing.stock} in stock</span>
                          </div>
                        )}
                        {listing.views && (
                          <div className="flex items-center gap-1 text-xs">
                            <Eye className="w-3 h-3" />
                            <span>{listing.views} views</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEditProduct(listing.id)}
                        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        title="Edit product"
                      >
                        <Edit className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                      </button>

                      <button
                        onClick={() => handleToggleActive(listing.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          listing.active
                            ? 'bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800'
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                        title={listing.active ? 'Pause listing' : 'Activate listing'}
                      >
                        {listing.active ? (
                          <ToggleRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <ToggleLeft className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                        )}
                      </button>

                      <button
                        onClick={() => handleDeleteProduct(listing.id)}
                        className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-5 h-5 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Footer */}
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600 px-4 py-3 flex justify-between items-center text-xs">
                  <span className="text-gray-600 dark:text-gray-300">
                    {listing.active ? '✅ Live on marketplace' : '⏸️ Paused'}
                  </span>
                  <button
                    onClick={() => handleViewAnalytics(listing.id)}
                    className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Analytics →
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}