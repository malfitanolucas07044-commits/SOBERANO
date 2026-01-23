import { Product, ProductCategory, PerfumeType } from './types';

export const WHATSAPP_NUMBER = '595984508348';
export const CONTACT_NAME = 'Soberano';

export const WATCH_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=80&w=2080&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1547996663-b85580e93299?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1619983081563-430f63602796?q=80&w=1974&auto=format&fit=crop'
];

export const PERFUME_HERO_IMAGES = [
  'https://images.unsplash.com/photo-1615160822187-8494eb7cbe85?q=80&w=2146&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1595535373192-fc09355289e5?q=80&w=1974&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1585675100412-42c278c6431e?q=80&w=1974&auto=format&fit=crop'
];

export const REVIEWS = [
  {
    id: 1,
    name: "Carlos M.",
    text: "La atención es impecable. El reloj llegó en perfecto estado y la presentación es de otro nivel. Totalmente recomendado para piezas exclusivas.",
    rating: 5
  },
  {
    id: 2,
    name: "Sofía R.",
    text: "Compré un decant de Baccarat Rouge para probar y terminé comprando la botella entera. El envío a Asunción fue rapidísimo y seguro.",
    rating: 5
  },
  {
    id: 3,
    name: "Fernando G.",
    text: "Excelente variedad de perfumes árabes que no se encuentran en otro lado. Precios muy competitivos para la calidad que ofrecen.",
    rating: 4
  }
];

export const PRODUCTS: Product[] = [
  // --- RELOJES POEDAGAR ---
  {
    id: 'w-poedagar-magnate-square',
    name: 'POEDAGAR MAGNATE SQUARE',
    brand: 'Poedagar',
    price: 290000,
    offerPrice: 260000,
    category: ProductCategory.WATCH,
    description: 'El Poedagar Magnate Square redefine la elegancia contemporánea con su distintiva caja cuadrada y un acabado dorado integral que proyecta autoridad, combinando una estética de lujo con la precisión de un movimiento de cuarzo de alta fidelidad para convertirse en la pieza central de cualquier atuendo formal o de negocios. — CARACTERÍSTICAS: Agujas luminiscentes, fechador automático, resistencia al agua 3ATM — MATERIAL DE LA CAJA: Aleación de alta resistencia — MATERIAL DE LA CORREA: Acero inoxidable dorado — CRISTAL: Mineral reforzado anti‑rayaduras — MOVIMIENTO: Cuarzo de precisión — DIÁMETRO DE LA CAJA: 40mm.',
    image: 'https://placehold.co/600x600/FFFFFF/000000?text=Magnate+Square',
    isStock: true,
    isBestSeller: true
  },
  {
    id: 'w-poedagar-imperial-steel',
    name: 'POEDAGAR IMPERIAL STEEL',
    brand: 'Poedagar',
    price: 290000,
    offerPrice: 260000,
    category: ProductCategory.WATCH,
    description: 'Este modelo destaca por su construcción robusta en acero pulido y un diseño cuadrado que rompe con lo convencional, proporcionando un aire de modernidad y pulcritud ideal para el hombre que busca un accesorio versátil que transmita profesionalismo y resistencia en su día a día. — CARACTERÍSTICAS: Visualización de fecha, manecillas con brillo nocturno, sellado hermético — MATERIAL DE LA CAJA: Aleación de zinc — MATERIAL DE LA CORREA: Acero inoxidable plateado — CRISTAL: Mineral de alta dureza — MOVIMIENTO: Cuarzo — DIÁMETRO DE LA CAJA: 40mm.',
    image: 'https://placehold.co/600x600/FFFFFF/000000?text=Imperial+Steel',
    isStock: true
  },
  {
    id: 'w-poedagar-legacy-leather',
    name: 'POEDAGAR LEGACY LEATHER',
    brand: 'Poedagar',
    price: 270000,
    offerPrice: 240000,
    category: ProductCategory.WATCH,
    description: 'El Poedagar Legacy Leather equilibra la audacia de su caja geométrica con la calidez clásica de una correa de cuero seleccionada, consolidándose como un estándar de buen gusto y comodidad superior para el caballero que busca distinción en un estilo casual-elegante. — CARACTERÍSTICAS: Calendario funcional, punteros luminosos, diseño ergonómico — MATERIAL DE LA CAJA: Aleación metálica — MATERIAL DE LA CORREA: Cuero legítimo — CRISTAL: Mineral resistente a impactos — MOVIMIENTO: Cuarzo analógico — DIÁMETRO DE LA CAJA: 40mm.',
    image: 'https://placehold.co/600x600/FFFFFF/000000?text=Legacy+Leather',
    isStock: true
  },
  {
    id: 'w-poedagar-avant-garde',
    name: 'POEDAGAR AVANT-GARDE CHRONO',
    brand: 'Poedagar',
    price: 300000,
    offerPrice: 270000,
    category: ProductCategory.WATCH,
    description: 'Una obra maestra de la ingeniería visual que presenta una esfera compleja con sub-diales funcionales inspirados en la alta competición, ofreciendo un diseño deportivo refinado y una estructura de acero que garantiza durabilidad y una presencia imponente en la muñeca. — CARACTERÍSTICAS: Cronógrafo funcional, fechador, resistencia al agua, alta luminosidad — MATERIAL DE LA CAJA: Acero inoxidable — MATERIAL DE LA CORREA: Acero inoxidable — CRISTAL: Mineral anti‑reflectante — MOVIMIENTO: Cuarzo multifunción — DIÁMETRO DE LA CAJA: 42mm.',
    image: 'https://placehold.co/600x600/FFFFFF/000000?text=Avant+Garde',
    isStock: true,
    isBestSeller: true
  },
  {
    id: 'w-poedagar-navigator-pro',
    name: 'POEDAGAR NAVIGATOR PRO',
    brand: 'Poedagar',
    price: 290000,
    offerPrice: 260000,
    category: ProductCategory.WATCH,
    description: 'Diseñado para la exploración urbana, el Navigator Pro combina una legibilidad excepcional con un diseño técnico avanzado y un bisel detallado, asegurando que este reloj sea un compañero confiable y sofisticado tanto en reuniones de alta dirección como en eventos sociales exclusivos. — ATRIBUTOS TÉCNICOS: Características: Bisel decorativo, manecillas de alta luminiscencia, calendario — MATERIAL DE LA CAJA: Aleación de alta densidad — MATERIAL DE LA CORREA: Acero inoxidable — CRISTAL: Mineral reforzado — MOVIMIENTO: Cuarzo de alto rendimiento — DIÁMETRO DE LA CAJA: 44mm.',
    image: 'https://placehold.co/600x600/FFFFFF/000000?text=Navigator+Pro',
    isStock: true
  },
  {
    id: 'w-poedagar-prestige-chrono',
    name: 'POEDAGAR PRESTIGE CHRONO',
    brand: 'Poedagar',
    price: 290000,
    offerPrice: 260000,
    category: ProductCategory.WATCH,
    description: 'Definición pura de lujo deportivo, este cronógrafo armoniza sus pulsadores laterales con una esfera meticulosamente grabada y una construcción en acero pulido que refleja la luz de manera sofisticada, garantizando puntualidad absoluta y una excelencia visual inigualable. — CARACTERÍSTICAS: Cronometraje de precisión, ventana de fecha, resistente a salpicaduras — MATERIAL DE LA CAJA: Acero inoxidable — MATERIAL DE LA CORREA: Acero inoxidable — CRISTAL: Mineral resistente a rayones — MOVIMIENTO: Cuarzo cronógrafo — DIÁMETRO DE LA CAJA: 43mm.',
    image: 'https://placehold.co/600x600/FFFFFF/000000?text=Prestige+Chrono',
    isStock: true
  },
  {
    id: 'w-poedagar-titan-chrono',
    name: 'POEDAGAR TITAN CHRONOGRAPH',
    brand: 'Poedagar',
    price: 290000,
    offerPrice: 260000,
    category: ProductCategory.WATCH,
    description: 'El Poedagar Titan destaca por su estética imponente y carácter fuerte, integrando indicadores de precisión en una esfera profunda diseñada para resistir el ritmo de vida moderno sin perder la elegancia y el brillo característicos de una pieza de alta gama. — CARACTERÍSTICAS: Sub‑diales activos, fechador, agujas con recubrimiento luminoso — MATERIAL DE LA CAJA: Aleación reforzada — MATERIAL DE LA CORREA: Acero inoxidable — CRISTAL: Mineral de alta resistencia — MOVIMIENTO: Cuarzo — DIÁMETRO DE LA CAJA: 42mm.',
    image: 'https://placehold.co/600x600/FFFFFF/000000?text=Titan+Chrono',
    isStock: true
  },
  {
    id: 'w-poedagar-stellar-elite',
    name: 'POEDAGAR STELLAR ELITE',
    brand: 'Poedagar',
    price: 305000,
    offerPrice: 275000,
    category: ProductCategory.WATCH,
    description: 'Pieza de colección de diseño vanguardista que combina arte y funcionalidad en una esfera de disposición única, complementada con un brazalete ergonómico y un cierre de seguridad superior que lo posicionan como un símbolo de estatus para el hombre contemporáneo. — CARACTERÍSTICAS: Diseño de esfera exclusivo, calendario completo, luminiscencia nocturna — MATERIAL DE LA CAJA: Acero inoxidable — MATERIAL DE LA CORREA: Acero inoxidable — CRISTAL: Mineral anti‑impacto — MOVIMIENTO: Cuarzo de alta gama — DIÁMETRO DE LA CAJA: 41mm.',
    image: 'https://placehold.co/600x600/FFFFFF/000000?text=Stellar+Elite',
    isStock: true
  },
  {
    id: 'w-poedagar-vanguard-master',
    name: 'POEDAGAR VANGUARD MASTER',
    brand: 'Poedagar',
    price: 305000,
    offerPrice: 275000,
    category: ProductCategory.WATCH,
    description: 'Representando la cúspide del diseño técnico, el Vanguard Master ofrece una estructura imponente y detalles visuales de lujo pensados para líderes, equilibrando peso y comodidad para un uso prolongado con la máxima precisión técnica y estilo impecable. — CARACTERÍSTICAS: Cronógrafo de alta precisión, fechador automático, sellado contra polvo — MATERIAL DE LA CAJA: Aleación de titanio y acero — MATERIAL DE LA CORREA: Acero inoxidable — CRISTAL: Mineral con tratamiento anti‑reflejo — MOVIMIENTO: Cuarzo multifuncional — DIÁMETRO DE LA CAJA: 43mm.',
    image: 'https://placehold.co/600x600/FFFFFF/000000?text=Vanguard+Master',
    isStock: true
  },
  
  // --- PERFUMES ---
  // Perfumes - Diseñador
  {
    id: 'p1',
    name: 'Sauvage Elixir',
    brand: 'Dior',
    price: 1200000,
    category: ProductCategory.PERFUME,
    subCategory: PerfumeType.DESIGNER,
    description: 'Una concentración extrema. Notas de pomelo, especias, lavanda orgánica y maderas.',
    image: 'https://placehold.co/600x600/FFFFFF/000000?text=Sauvage',
    isDecantAvailable: true,
    decantPrice3ml: 80000,
    decantPrice5ml: 120000,
    decantPrice10ml: 220000,
    isStock: true,
    isBestSeller: true
  },
  {
    id: 'p2',
    name: 'Bleu de Chanel Parfum',
    brand: 'Chanel',
    price: 1350000,
    category: ProductCategory.PERFUME,
    subCategory: PerfumeType.DESIGNER,
    description: 'Un aromático amaderado intensamente masculino.',
    image: 'https://placehold.co/600x600/FFFFFF/000000?text=Bleu+Chanel',
    isDecantAvailable: true,
    decantPrice3ml: 90000,
    decantPrice5ml: 135000,
    decantPrice10ml: 250000,
    isStock: true
  },
  
  // Perfumes - Árabe
  {
    id: 'p3',
    name: 'Club de Nuit Intense Man',
    brand: 'Armaf',
    price: 450000,
    offerPrice: 380000,
    category: ProductCategory.PERFUME,
    subCategory: PerfumeType.ARAB,
    description: 'Una fragancia amaderada especiada conocida por su excelente proyección.',
    image: 'https://placehold.co/600x600/FFFFFF/000000?text=CDNIM',
    isDecantAvailable: false,
    isStock: true
  },
  {
    id: 'p4',
    name: 'Khamrah',
    brand: 'Lattafa',
    price: 550000,
    category: ProductCategory.PERFUME,
    subCategory: PerfumeType.ARAB,
    description: 'Dulce, cálido y especiado. Notas de canela, nuez moscada y dátiles.',
    image: 'https://placehold.co/600x600/FFFFFF/000000?text=Khamrah',
    isDecantAvailable: true,
    decantPrice3ml: 35000,
    decantPrice5ml: 55000,
    decantPrice10ml: 95000,
    isStock: true,
    isBestSeller: true
  },

  // Perfumes - Nicho
  {
    id: 'p5',
    name: 'Aventus',
    brand: 'Creed',
    price: 2800000,
    category: ProductCategory.PERFUME,
    subCategory: PerfumeType.NICHE,
    description: 'La fragancia nicho más celebrada. Piña, abedul y almizcle.',
    image: 'https://placehold.co/600x600/FFFFFF/000000?text=Aventus',
    isDecantAvailable: true,
    decantPrice3ml: 180000,
    decantPrice5ml: 280000,
    decantPrice10ml: 520000,
    isStock: true
  },
  {
    id: 'p6',
    name: 'Baccarat Rouge 540',
    brand: 'Maison Francis Kurkdjian',
    price: 3200000,
    category: ProductCategory.PERFUME,
    subCategory: PerfumeType.NICHE,
    description: 'Luminoso y sofisticado. Jazmín, azafrán, ámbar gris y cedro.',
    image: 'https://placehold.co/600x600/FFFFFF/000000?text=Baccarat',
    isDecantAvailable: true,
    decantPrice3ml: 200000,
    decantPrice5ml: 320000,
    decantPrice10ml: 600000,
    isStock: true
  }
];