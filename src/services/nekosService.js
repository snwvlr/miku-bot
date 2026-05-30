const axios = require('axios');

class NekosService {
    constructor() {
        this.baseURL = 'https://nekos.best/api/v2';
        
        // Todas as categorias de GIF disponíveis
        this.gifCategories = [
            'baka', 'bite', 'blush', 'bored', 'cry', 'cuddle', 'dance', 
            'facepalm', 'feed', 'handhold', 'handshake', 'happy', 'highfive', 
            'hug', 'kick', 'kiss', 'laugh', 'lurk', 'nod', 'nom', 'nope', 
            'pat', 'peck', 'poke', 'pout', 'punch', 'shoot', 'shrug', 
            'slap', 'sleep', 'smile', 'smug', 'stare', 'think', 'thumbsup', 
            'tickle', 'wave', 'wink', 'yawn', 'yeet'
        ];

        // Categorias de imagem
        this.imageCategories = ['husbando', 'kitsune', 'neko', 'waifu'];
        
        // Cache simples
        this.cache = new Map();
        this.cacheTime = 60000; // 1 minuto
    }

    async getGif(category, amount = 1) {
        if (!this.gifCategories.includes(category)) {
            throw new Error(`Categoria inválida: ${category}`);
        }
        return this.fetch(category, amount);
    }

    async getImage(category, amount = 1) {
        if (!this.imageCategories.includes(category)) {
            throw new Error(`Categoria inválida: ${category}`);
        }
        return this.fetch(category, amount);
    }

    async fetch(category, amount = 1) {
        try {
            // Verificar cache
            const cacheKey = `${category}_${amount}`;
            const cached = this.cache.get(cacheKey);
            if (cached && Date.now() - cached.time < this.cacheTime) {
                // Retornar item aleatório do cache
                const items = cached.data;
                return items[Math.floor(Math.random() * items.length)];
            }

            const response = await axios.get(`${this.baseURL}/${category}`, {
                params: { amount: Math.min(amount, 20) },
                timeout: 10000
            });

            if (response.data && response.data.results && response.data.results.length > 0) {
                // Atualizar cache
                this.cache.set(cacheKey, {
                    data: response.data.results,
                    time: Date.now()
                });
                
                // Retornar item aleatório
                const items = response.data.results;
                return items[Math.floor(Math.random() * items.length)];
            }

            throw new Error('Nenhum resultado encontrado');
        } catch (error) {
            console.error(`Erro ao buscar ${category}:`, error.message);
            throw error;
        }
    }

    async getMultiple(category, amount = 5) {
        try {
            const response = await axios.get(`${this.baseURL}/${category}`, {
                params: { amount: Math.min(amount, 20) },
                timeout: 10000
            });

            if (response.data && response.data.results) {
                return response.data.results;
            }
            return [];
        } catch (error) {
            console.error(`Erro ao buscar múltiplos ${category}:`, error.message);
            return [];
        }
    }

    // Verificar se categoria existe
    isValidGifCategory(category) {
        return this.gifCategories.includes(category);
    }

    isValidImageCategory(category) {
        return this.imageCategories.includes(category);
    }

    // Listar categorias
    getGifCategories() {
        return this.gifCategories;
    }

    getImageCategories() {
        return this.imageCategories;
    }

    getAllCategories() {
        return {
            gif: this.gifCategories,
            image: this.imageCategories
        };
    }
}

module.exports = new NekosService();
