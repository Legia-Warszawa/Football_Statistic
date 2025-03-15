import { defineStore } from "pinia";
import { ref } from "vue";
import { getMatches } from "@/services/openLigaApi";

export const useMatchStore = defineStore("matchStore", () => {
  const matches = ref([]); // 🔹 Reactive array

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

  return { matches, fetchMatches };
});
