import {
  Col,
  Row,
} from "react-bootstrap";

import type { Product } from "../../types/Product";

import ProductCard from "./ProductCard";

interface ProductGridProps {
  products: Product[];

  viewProduct: (id: number) => void;

  addToCart: (product: Product) => void;
}

function ProductGrid({
  products,
  viewProduct,
  addToCart,
}: ProductGridProps) {
  return (
    <Row className="g-4">

      {products.map((product) => (

        <Col
          xs={12}
          sm={6}
          md={4}
          xl={3}
          key={product.id}
        >
          <ProductCard
            product={product}
            viewProduct={viewProduct}
            addToCart={addToCart}
          />
        </Col>

      ))}

    </Row>
  );
}

export default ProductGrid;