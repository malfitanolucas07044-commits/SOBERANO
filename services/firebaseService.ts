import { PRODUCTS } from "../constants";
import { Product } from "../types";
import { db, storage, auth, isFirebaseEnabled } from "../firebaseConfig";
import { collection, getDocs, doc, setDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";

// Eliminamos las constantes de almacenamiento local para escritura.
// Solo leemos de local si es absolutamente necesario por temas de caché, pero no escribimos ahí.

// --- AUTHENTICATION ---

export const loginAdmin = async (email: string, password: string) => {
  // 1. PRIORIDAD: Backdoor Local (Acceso de Emergencia)
  const lowerEmail = email.toLowerCase().trim();
  const allowedUsers = [
    'josemujica.py@gmail.com',
    'malfitanolucas07044@gmail.com',
    'admin@soberano.com',
    'jose', 
    'lucas'
  ];

  const isAllowedLocal = allowedUsers.some(user => lowerEmail.includes(user));
  
  if (isAllowedLocal && password === 'Soberano2026!') {
      console.log("Acceso de emergencia concedido.");
      return { user: { email: email, uid: 'local-admin-verified' } };
  }

  // 2. Intentar Firebase Auth
  if (auth) {
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error("Error de autenticación Firebase:", error);
      throw error;
    }
  }

  throw new Error("No se pudo conectar al servicio de autenticación.");
};

export const logoutAdmin = async () => {
  if (auth) {
    try {
        await signOut(auth);
    } catch (e) {
        console.warn("Error al cerrar sesión:", e);
    }
  }
};

// --- IMÁGENES (Firebase Storage) ---

/**
 * Sube imagen a Firebase Storage OBLIGATORIAMENTE.
 * Ya no convierte a Base64 local.
 */
export const uploadImageToFirebase = async (file: File, folder: string = 'products'): Promise<string> => {
  if (!storage) {
    throw new Error("Error crítico: No hay conexión con Firebase Storage. Verifica tu internet o la configuración.");
  }

  try {
    // 1. Crear referencia única
    // Usamos timestamp para evitar colisiones de nombre
    const fileName = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);

    // 2. Subir archivo
    await uploadBytes(storageRef, file);

    // 3. Obtener URL pública (visible para todos los clientes)
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;

  } catch (error) {
    console.error("Error subiendo a Firebase Storage:", error);
    throw new Error('Falló la subida a la nube. Intenta nuevamente.');
  }
};

// --- BASE DE DATOS (Firestore) ---

export const getProductsFromFirebase = async (): Promise<Product[]> => {
  // Intentamos leer de la nube
  if (db) {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push(doc.data() as Product);
      });
      
      // Si la base de datos está vacía, retornamos los productos por defecto (hardcoded)
      // para que la web no se vea vacía al principio.
      if (products.length === 0) return PRODUCTS; 
      
      return products;
    } catch (e) {
      console.error("Error leyendo de Firebase:", e);
      // En caso de error de lectura (sin internet), mostramos los locales por defecto
      return PRODUCTS;
    }
  }
  return PRODUCTS;
};

export const saveProductToFirebase = async (product: Product): Promise<Product> => {
  if (!db) {
    throw new Error("No hay conexión con la base de datos en la nube.");
  }

  const newProduct = { 
    ...product, 
    id: product.id || `prod-${Date.now()}` 
  };

  try {
    // Guardamos directamente en la colección "products"
    await setDoc(doc(db, "products", newProduct.id), newProduct);
    return newProduct;
  } catch (e) {
    console.error("Error guardando en Firebase:", e);
    throw new Error("No se pudo guardar en la nube.");
  }
};

export const deleteProductFromFirebase = async (productId: string): Promise<void> => {
  if (!db) {
    throw new Error("No hay conexión con la base de datos.");
  }
  await deleteDoc(doc(db, "products", productId));
};

// --- CATEGORÍAS ---

export const getCategories = async (): Promise<string[]> => {
  // Las categorías son simples, podemos mantenerlas locales o moverlas a firebase en el futuro.
  // Por ahora, para simplificar, usamos localStorage para configuración de admin, 
  // pero esto no afecta a que los clientes vean los productos.
  const stored = localStorage.getItem('soberano_categories_local');
  if (stored) return JSON.parse(stored);
  return ['Relojes', 'Perfumes'];
};

export const saveCategories = async (categories: string[]) => {
  localStorage.setItem('soberano_categories_local', JSON.stringify(categories));
};