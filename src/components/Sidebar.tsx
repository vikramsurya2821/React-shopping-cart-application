import "./Sidebar.css";

interface SidebarProps {
  categories: string[];
  category: string;
  setCategory: (value: string) => void;

  maxPrice: number;
  setMaxPrice: (value: number) => void;

  minRating: number;
  setMinRating: (value: number) => void;
}

function Sidebar({
  categories,
  category,
  setCategory,
  maxPrice,
  setMaxPrice,
  minRating,
  setMinRating,
}: SidebarProps) {

  const clearFilters = () => {
    setCategory("All");
    setMaxPrice(500000);
    setMinRating(0);
  };

  return (
    <aside className="sidebar">

      <h2>Filters</h2>

      <hr />

      {/* CATEGORY */}
      <h3>Category</h3>

      {categories.map((item) => (
        <label
          key={item}
          className="filter-item"
        >
          <input
            type="radio"
            name="category"
            checked={category === item}
            onChange={() => setCategory(item)}
          />

          <span>{item}</span>
        </label>
      ))}

      <hr />

      {/* PRICE */}
      <h3>Maximum Price</h3>

      <p>
        ₹0 - ₹
        {maxPrice.toLocaleString("en-IN")}
      </p>

      <input
        type="range"
        min="0"
        max="500000"
        step="1000"
        value={maxPrice}
        onChange={(event) =>
          setMaxPrice(Number(event.target.value))
        }
      />

      <hr />

      {/* RATING */}
      <h3>Rating</h3>

      {[4, 3, 2].map((rating) => (
        <label
          key={rating}
          className="filter-item"
        >
          <input
            type="radio"
            name="rating"
            checked={minRating === rating}
            onChange={() => setMinRating(rating)}
          />

          <span>
            ⭐ {rating}★ & above
          </span>
        </label>
      ))}

      <button
        type="button"
        className="clear-btn"
        onClick={clearFilters}
      >
        Clear Filters
      </button>

    </aside>
  );
}

export default Sidebar;