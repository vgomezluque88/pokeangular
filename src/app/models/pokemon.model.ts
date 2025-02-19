export interface Pokemon { // ✅ Definimos una interfaz para incluir `image`
    name: string;
    url: string;
    image?: string; // Hacemos `image` opcional con `?`
}