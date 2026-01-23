import { PRODUCTS } from "../constants";
import { Product } from "../types";

// --- CONFIGURACIÓN DE CLOUDINARY ---
// ¡IMPORTANTE! Reemplaza los valores de abajo con los de tu cuenta de Cloudinary:

// 1. Tu Cloud Name (está en el Dashboard de Cloudinary)
const CLOUDINARY_CLOUD_NAME = 'dfcp7k2ge'; 

// 2. Tu Upload Preset (creado en Settings -> Upload -> Upload Presets -> Mode: Unsigned)
const CLOUDINARY_UPLOAD_PRESET = 'soberano_imagenes'; 

// Clave para guardar datos en localStorage
const STORAGE_KEY = 'soberano_products_local';

/**
 * Sube una imagen a Cloudinary y retorna la URL pública (HTTPS).
 * Esto guarda la imagen permanentemente en la nube.
 */
export const uploadImageToFirebase = async (file: File, folder: string = 'products'): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('folder', folder); // Organiza las imágenes en carpetas en Cloudinary

  try {
    // Nota: Si cambiaste el Cloud Name arriba, esta URL se actualizará automáticamente
    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Error al subir imagen');
    }

    const data = await response.json();
    return data.secure_url; // Retorna la URL segura de la imagen en la nube
  } catch (error) {
    console.error("Error subiendo imagen a Cloudinary:", error);
    alert("Error al subir imagen. Verifica que tu preset sea 'Unsigned' en Cloudinary.");
    throw error;
  }
};

/**
 * Obtiene productos desde localStorage o devuelve los por defecto (constants).
 */
export const getProductsFromFirebase = async (): Promise<Product[]> => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    return JSON.parse(stored);
  }
  return PRODUCTS;
};

/**
 * Guarda (Crea o Actualiza) un producto en localStorage.
 */
export const saveProductToFirebase = async (product: Product): Promise<Product> => {
  const stored = localStorage.getItem(STORAGE_KEY);
  let products: Product[] = stored ? JSON.parse(stored) : [...PRODUCTS];

  if (product.id && products.some(p => p.id === product.id)) {
      // Actualizar existente
      products = products.map(p => p.id === product.id ? product : p);
  } else {
      // Crear nuevo
      const newProduct = { 
        ...product, 
        id: product.id || `prod-${Date.now()}` 
      };
      products.push(newProduct);
      product = newProduct;
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
  return product;
};

/**
 * Elimina un producto de localStorage.
 */
export const deleteProductFromFirebase = async (productId: string): Promise<void> => {
  const stored = localStorage.getItem(STORAGE_KEY);
  let products: Product[] = stored ? JSON.parse(stored) : [...PRODUCTS];
  
  products = products.filter(p => p.id !== productId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
};