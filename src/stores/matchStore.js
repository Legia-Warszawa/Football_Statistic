import { defineStore } from "pinia";
import { ref } from "vue";
import { getMatches } from "@/services/openLigaApi";

export const useMatchStore = defineStore("matchStore", () => {
  const matches = ref([]); // 🔹 Reactive array dla meczów Ligi Mistrzów
  const matchesBundesliga = ref([]); // 🔹 Reactive array dla meczów Bundesligi

  // Funkcja do pobierania meczów Ligi Mistrzów
  const fetchMatches = async (league = "ucl24", year = "2024", matchDay = "11") => {
    console.log("🔹 Fetching matches..."); 
    const data = await getMatches(league, year, matchDay);
    
    console.log("🔹 Dane pobrane w store:", data);
    
    if (Array.isArray(data) && data.length > 0) {
      matches.value = [...data]; 
      console.log("✅ Mecze zapisane w store:", matches.value);
    } else {
      console.warn("⚠️ Brak danych do zapisania w store!");
    }
  };

  // Funkcja do pobierania meczów Bundesligi
  const fetchBundesligaMatches = async (league = "bl1", year = "2024", matchDay = "25") => {
    console.log("🔹 Fetching Bundesliga matches..."); 
    const data = await getMatches(league, year, matchDay);
    
    console.log("🔹 Dane Bundesligi pobrane w store:", data);
    
    if (Array.isArray(data) && data.length > 0) {
      matchesBundesliga.value = [...data]; 
      console.log("✅ Mecze Bundesligi zapisane w store:", matchesBundesliga.value);
    } else {
      console.warn("⚠️ Brak danych Bundesligi do zapisania w store!");
    }
  };

  return { matches, matchesBundesliga, fetchMatches, fetchBundesligaMatches };
});