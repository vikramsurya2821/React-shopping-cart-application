import { Form } from "react-bootstrap";

interface ProductsHeaderProps {
  productCount: number;
  sort: string;
  setSort: (value: string) => void;
}

function ProductsHeader({
  productCount,
  sort,
  setSort,
}: ProductsHeaderProps) {
  return (
    <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">

      <div>
        <h1 className="h2 mb-1">
          Products
        </h1>

        <p className="text-muted mb-2 mb-md-0">
          {productCount} products found
        </p>
      </div>

      <Form.Select
        style={{ maxWidth: "230px" }}
        value={sort}
        onChange={(e) =>
          setSort(e.target.value)
        }
      >
        <option value="default">
          Sort By
        </option>

        <option value="low">
          Price: Low to High
        </option>

        <option value="high">
          Price: High to Low
        </option>

        <option value="rating">
          Rating
        </option>

      </Form.Select>

    </div>
  );
}

export default ProductsHeader;