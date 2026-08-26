import useWishlist from "../hooks/useWishlist";

function Wishlist() {
  const { wishlistItems, removeFromWishlist } = useWishlist();

  return (
    <div className="container mt-5">
      <h2 className="mb-4">My Wishlist</h2>

      {wishlistItems.length === 0 ? (
        <div className="alert alert-info">
          No products in your wishlist.
        </div>
      ) : (
        <div className="row">
          {wishlistItems.map((item) => (
            <div className="col-md-4 mb-4" key={item.id}>
              <div className="card h-100 shadow-sm">
                {item.image && (
                  <img
                    src={item.image}
                    className="card-img-top"
                    alt={item.name}
                    style={{ height: "220px", objectFit: "cover" }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5>{item.name}</h5>
                  <h6 className="text-success">
                    ₹{item.price.toLocaleString()}
                  </h6>
                  <button
                    className="btn btn-outline-danger mt-auto"
                    onClick={() => removeFromWishlist(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Wishlist;