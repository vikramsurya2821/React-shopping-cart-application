import {
  Button,
  Card,
  Form,
} from "react-bootstrap";

interface FilterSidebarProps {
  categories: string[];
  brands: string[];

  selectedCategories: string[];
  selectedBrands: string[];

  minPrice: string;
  maxPrice: string;

  onCategoryChange: (category: string) => void;
  onBrandChange: (brand: string) => void;

  setMinPrice: (value: string) => void;
  setMaxPrice: (value: string) => void;

  clearFilters: () => void;
}

function FilterSidebar({
  categories,
  brands,
  selectedCategories,
  selectedBrands,
  minPrice,
  maxPrice,
  onCategoryChange,
  onBrandChange,
  setMinPrice,
  setMaxPrice,
  clearFilters,
}: FilterSidebarProps) {
  return (
    <Card className="shadow-sm">
      <Card.Body>

        <div className="d-flex justify-content-between align-items-center mb-3">

          <Card.Title className="mb-0">
            Filters
          </Card.Title>

          <Button
            variant="outline-danger"
            size="sm"
            onClick={clearFilters}
          >
            Clear
          </Button>

        </div>

        <hr />

        {/* CATEGORY */}

        <div className="mb-4">

          <h5 className="mb-3">
            Category
          </h5>

          {categories.map((category) => (
            <Form.Check
              key={category}
              type="checkbox"
              id={`category-${category}`}
              label={category}
              className="mb-2"
              checked={selectedCategories.includes(
                category
              )}
              onChange={() =>
                onCategoryChange(category)
              }
            />
          ))}

        </div>

        <hr />

        {/* BRAND */}

        <div className="mb-4">

          <h5 className="mb-3">
            Brand
          </h5>

          {brands.map((brand) => (
            <Form.Check
              key={brand}
              type="checkbox"
              id={`brand-${brand}`}
              label={brand}
              className="mb-2"
              checked={selectedBrands.includes(
                brand
              )}
              onChange={() =>
                onBrandChange(brand)
              }
            />
          ))}

        </div>

        <hr />

        {/* PRICE */}

        <div>

          <h5 className="mb-3">
            Price
          </h5>

          <Form.Control
            type="number"
            placeholder="Minimum Price"
            className="mb-2"
            value={minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value)
            }
          />

          <Form.Control
            type="number"
            placeholder="Maximum Price"
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value)
            }
          />

        </div>

      </Card.Body>
    </Card>
  );
}

export default FilterSidebar;