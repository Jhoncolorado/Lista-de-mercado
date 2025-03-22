import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from '../services/firebaseConfig';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import ProductFilter from '../components/ProductFilter';
import { addProductToFirestore, updateProductInFirestore } from '../services/productService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedStore, setSelectedStore] = useState('');
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    const q = query(collection(db, "productos"), where("active", "==", true));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const productArray = [];
      querySnapshot.forEach(doc => {
        productArray.push({ id: doc.id, ...doc.data() });
      });
      setProducts(productArray);
      setFilteredProducts(productArray);
    });
    return () => unsubscribe();
  }, []);

  const handleFilter = (queryText) => {
    if (!queryText) {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(
        products.filter(p => 
          (p.name && p.name.toLowerCase().includes(queryText.toLowerCase())) ||
          (p.brand && p.brand.toLowerCase().includes(queryText.toLowerCase())) ||
          (p.category && p.category.toLowerCase().includes(queryText.toLowerCase()))
        )
      );
    }
  };

  const addProduct = async (productData) => {
    const productWithStore = { ...productData, store: selectedStore };
    await addProductToFirestore(productWithStore);
    setIsAddingProduct(false);
  };

  const updateProduct = async (updatedProduct) => {
    await updateProductInFirestore(updatedProduct.id, updatedProduct);
  };

  const removeProduct = async (productId) => {
    await updateProductInFirestore(productId, { active: false });
  };

  return (
    <div className="products-page fade-in">
      <div className="page-header">
        <h2>Gestión de Productos</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setIsAddingProduct(!isAddingProduct)}
        >
          {isAddingProduct ? 'Cancelar' : 'Agregar Producto'}
        </button>
      </div>

      <div className="content-section">
        {isAddingProduct && (
          <div className="add-product-section">
            <h3>Nuevo Producto</h3>
            <ProductForm addProduct={addProduct} />
          </div>
        )}

        <div className="filter-section">
          <ProductFilter onFilter={handleFilter} />
        </div>

        <div className="products-section">
          <ProductList 
            products={filteredProducts}
            updateProduct={updateProduct}
            removeProduct={removeProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default Products; 