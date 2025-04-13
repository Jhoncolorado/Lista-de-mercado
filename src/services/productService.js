// src/services/productService.js
import { collection, addDoc, serverTimestamp, doc, updateDoc, arrayUnion, getDocs } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Función para agregar un producto a la colección "productos"
export const addProductToFirestore = async (product) => {
  try {
    const docRef = await addDoc(collection(db, "productos"), {
      ...product,
      active: true,
      price: parseFloat(product.price), // Aseguramos que el precio sea número
      createdAt: serverTimestamp(), // Timestamp del servidor
      lastUpdated: serverTimestamp(), // Agregamos última actualización
      priceHistory: [{
        date: new Date().toISOString(),
        price: parseFloat(product.price)
      }]
    });
    console.log("Producto agregado exitosamente");
    return docRef.id;
  } catch (error) {
    console.error("Error al agregar producto:", error);
    throw error;
  }
};

// Función para actualizar (editar o desactivar) un producto en Firestore
export const updateProductInFirestore = async (productId, updates) => {
  try {
    const productRef = doc(db, "productos", productId);
    const updateData = {
      ...updates,
      lastUpdated: serverTimestamp()
    };

    // Si se está actualizando el precio, agregamos al historial
    if (updates.price !== undefined) {
      updateData.price = parseFloat(updates.price);
      updateData.priceHistory = arrayUnion({
        date: new Date().toISOString(),
        price: parseFloat(updates.price)
      });
    }

    await updateDoc(productRef, updateData);
    console.log("Producto actualizado");
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    throw error;
  }
};

// Función para inicializar el historial de precios en productos existentes
export const initializePriceHistory = async () => {
  try {
    const productsRef = collection(db, "productos");
    const querySnapshot = await getDocs(productsRef);
    
    for (const doc of querySnapshot.docs) {
      const data = doc.data();
      if (!data.priceHistory) {
        await updateDoc(doc.ref, {
          priceHistory: [{
            date: data.createdAt?.toDate()?.toISOString() || new Date().toISOString(),
            price: data.price
          }]
        });
      }
    }
    console.log("Historial de precios inicializado");
  } catch (error) {
    console.error("Error al inicializar historial de precios:", error);
    throw error;
  }
};
