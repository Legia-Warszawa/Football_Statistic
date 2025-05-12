import { defineStore } from "pinia";
import { ref } from "vue";
import { getMatches } from "@/services/openLigaApi";

export const useMatchStore = defineStore("matchStore", () => {
  const matches = ref([]); 

  const fetchMatches = async (league, year, matchDay) => {
    console.log(`🔹 Pobieranie meczów: ${league}, Rok: ${year}, Kolejka: ${matchDay}`);

    try {
      const data = await getMatches(league, year, matchDay);
      console.log("Pobrane mecze:", data);

      if (Array.isArray(data)) {
        matches.value = data; 
        console.log(" Mecze ligi", league, "zapisane w store:", matches.value);
      } else {
        console.warn(" Błąd: Otrzymane dane nie są tablicą!", data);
      }
    } catch (error) {
      console.error(" Błąd pobierania meczów:", error);
    }
  };

  return { matches, fetchMatches };
});

 
