import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import "../../App.css";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaStar } from "react-icons/fa6";

function ProductListing({ searchQuery }) {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const recordsPerPage = 12;
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);

  const [wishlist, setWishlist] = useState(() => {
    const savedWishlist = localStorage.getItem("wishlist");
    return savedWishlist ? JSON.parse(savedWishlist) : [];
  });

  // Wishlist Toggle
  const handleWishlist = (product) => {
    setWishlist((prevWishlist) => {
      const cleanedWishlist = prevWishlist.filter((item) => item !== null);
      const isInWishlist = cleanedWishlist.some((item) => item.id === product.id);
      const updatedWishlist = isInWishlist
        ? cleanedWishlist.filter((item) => item.id !== product.id)
        : [...cleanedWishlist, product];

      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
      return updatedWishlist;
    });
  };

  // Product Click
  const handleProductCard = (productId) => {
    navigate(`/product/${productId}`);
  };
  const fetchProducts = () => {
    axios
      .get("https://dummyjson.com/products/categories")
      .then((res) => {
        setCategories(res.data || []);
      })
      .catch(() => {
        setError("Error fetching categories");
      });
  }
  //categories fetching 
  useEffect(() => {
    fetchProducts()


  }, []);
  const Fetchcategories = () => {
    setLoading(true);
    let url = selectedCategory
      ? `https://dummyjson.com/products/category/${selectedCategory}`
      : "https://dummyjson.com/products";

    axios
      .get(url)
      .then((res) => {

        setProducts(res.data.products || []);
        setCurrentPage(1)

        setLoading(false);
      })
      .catch(() => {
        setError("Error fetching products");
        setLoading(false);
      });
  }
  // Fetching API
  useEffect(() => {
    Fetchcategories()
  }, [selectedCategory]);

  // Search query filter
  const filteredProducts = products?.filter((product) =>
    product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.price.toString().includes(searchQuery) ||
    product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.rating?.toString().includes(searchQuery)
  );

  // Pagination logic
  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  
  const records = useMemo(() => {
    return filteredProducts.slice(firstIndex, lastIndex);
  }, [filteredProducts, firstIndex, lastIndex]); 

  const totalPages = Math.ceil(filteredProducts.length / recordsPerPage);

  const pageNumbers = [...Array(totalPages + 1).keys()].slice(1);

  function prePage() {
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCPage(id) {
    setCurrentPage(id);
  }

  function nextPage() {
    if (currentPage !== totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }
  console.log(records, "filteredProducts");

  return (
    <div className="product-wrapper">
      {/* Category Dropdown */}
      <div className="category-dropdown">
        <select onChange={(e) => setSelectedCategory(e.target.value)}
          value={selectedCategory}>
          <option value="">Select Category</option>
          {categories.map((category) => (
            <option key={category.slug || index} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Products Listing */}
      <div className="product-grid">
        {error && <p style={{ color: "red" }}>{error}</p>}
        {products.length > 0 ? (
          records.map((product) => (
            <div key={product.id} className="product-card-new" onClick={() => handleProductCard(product.id)}>
              {/* Wishlist Button */}
              <button className="wishlist-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleWishlist(product);
                }}
              >
                {wishlist.some((item) => item && item.id === product.id) ? (
                  <FaHeart color="red" />
                ) : (
                  <FaRegHeart color="gray" />
                )}
              </button>

              {/* Product Details */}
              <img src={product.thumbnail} alt={product.title} loading="lazy" className="product-image" />
              <h4 className="product-title">{product.title}</h4>
              <p className="product-desc">{product.description.substring(0, 75)}...</p>
              <p className="product-price">${product.price}</p>

              {/* Star Rating */}
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => {
                  const starValue = i + 1;
                  return (
                    <span
                      key={i}
                      className={
                        product.rating >= starValue
                          ? "star full"
                          : product.rating >= starValue - 0.5
                            ? "star half"
                            : "star empty"
                      }
                    >
                      <FaStar />
                    </span>
                  );
                })}
              </div>
            </div>
          ))
        ) : (
          !loading && <p>No products found</p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="pagination-wrapper">
          <ul className="pagination-list">
            <li className="pagination-item">
              <button className="pagination-btn" onClick={prePage}

                disabled={loading || currentPage <= 1}>
                Prev
              </button>
            </li>
            {pageNumbers.map((n) => (
              <li key={n} className={`pagination-item ${currentPage === n ? "active" : ""}`}>
                <button className="pagination-btn" onClick={() => changeCPage(n)}>
                  {n}
                </button>
              </li>
            ))}
            <li className="pagination-item">
              <button className="pagination-btn"
                onClick={nextPage}
                disabled={loading || currentPage === pageNumbers[pageNumbers.length - 1]}>
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}

export default ProductListing;
