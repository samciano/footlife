// core/storage.js
// Camada única de persistência. Se um dia quisermos trocar localStorage por outra
// forma de save (arquivo, IndexedDB, backend), só este arquivo precisa mudar.

const STORAGE_KEY = "carreira_save_v1";

export const Storage = {
  salvar(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  },

  carregar() {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch (e) {
      console.error("Save corrompido, ignorando.", e);
      return null;
    }
  },

  existe() {
    return localStorage.getItem(STORAGE_KEY) !== null;
  },

  apagar() {
    localStorage.removeItem(STORAGE_KEY);
  }
};
