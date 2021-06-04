import React from "react";

const CreateProduct = () => {
  return (
    <div className="admin-create-product">
      <form className="mx-auto w-50">
        <div className="mb-3">
          <label htmlFor="create-product-input-image" className="form-label">
            Product Image
          </label>
          <input
            className="form-control"
            type="file"
            id="create-product-input-image"
          />
        </div>
        <div className="my-3">
          <label htmlFor="create-product-input-name" className="form-label">
            Product Name
          </label>
          <input
            type="text"
            className="form-control"
            id="create-product-input-name"
            placeholder="Mens Jacket Large"
          />
        </div>
        <div className="my-3">
          <label htmlFor="create-product-description" className="form-label">
            Product Description
          </label>
          <textarea
            className="form-control"
            id="create-product-description"
            placeholder="Enter product description here"
            rows="5"
          />
        </div>
        <div className="my-3">
          <label htmlFor="create-product-input-price" className="form-label">
            Price
          </label>
          <div className="input-group mb-3">
            <span className="input-group-text" id="create-product-input-price">
              &#36;
            </span>
            <input
              type="number"
              className="form-control"
              id="create-product-input-price"
              placeholder="20"
              aria-label="Price"
              aria-describedby="create-product-input-price"
            />
          </div>
        </div>
        <div className="my-3">
          <label htmlFor="create-product-input-select" className="form-label">
            Stock
          </label>
          <select
            className="form-select"
            id="create-product-input-select"
            aria-label="select category"
            defaultValue="default">
            <option value="default">Select category</option>
            <option value="1">One</option>
            <option value="2">Two</option>
            <option value="3">Three</option>
          </select>
        </div>
        <div className="my-3">
          <label htmlFor="create-product-input-stock" className="form-label">
            Stock
          </label>
          <input
            type="number"
            className="form-control"
            id="create-product-input-stock"
            placeholder="Mens Jacket Large"
          />
        </div>
        <button className="btn btn-primary my-3" type="submit">
          Add Product
        </button>
      </form>
    </div>
  );
};

export default CreateProduct;
