// src/services/productService.js
import { collection, addDoc, serverTimestamp, doc, updateDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Función para agregar un producto a la colección "productos"
export const addProductToFirestore = async (product) => {
  try {
    await addDoc(collection(db, "productos"), {
      ...product,
      active: true,               // Producto activo por defecto
      createdAt: serverTimestamp() // Se asigna la fecha de creación automáticamente
    });
    console.log("Producto agregado exitosamente");
  } catch (error) {
    console.error("Error al agregar producto:", error);
  }
};

// Función para actualizar (editar o desactivar) un producto en Firestore
export const updateProductInFirestore = async (productId, updates) => {
  try {
    const productRef = doc(db, "productos", productId);
    await updateDoc(productRef, updates);
    console.log("Producto actualizado");
  } catch (error) {
    console.error("Error al actualizar producto:", error);
  }
};
