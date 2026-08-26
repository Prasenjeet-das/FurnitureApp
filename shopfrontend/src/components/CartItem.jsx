function CartItem({ product, onUpdateQuantity, onRemove }) {
  return (
    <div className="card mb-3 shadow-sm">
      <div className="row g-0 align-items-center">

        <div className="col-md-3 text-center p-3">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded"
          />
        </div>

        <div className="col-md-6">
          <div className="card-body">

            <h5>{product.name}</h5>

            <p className="text-muted mb-1">
              Category: {product.category}
            </p>

            <h5 className="text-success">
              ₹{product.price}
            </h5>

            <div className="d-flex align-items-center mt-3">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => onUpdateQuantity(product.id, product.quantity - 1, product)}
              >
                −
              </button>

              <span className="mx-3 fw-bold">
                {product.quantity}
              </span>

              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => onUpdateQuantity(product.id, product.quantity + 1, product)}
              >
                +
              </button>
            </div>

          </div>
        </div>

        <div className="col-md-3 text-center">
          <button className="btn btn-danger" onClick={() => onRemove(product.id)}>
            Remove
          </button>
        </div>

      </div>
    </div>
  );
}

export default CartItem;