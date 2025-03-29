import axios from "axios";

const API_BASE_URL = "https://api.openligadb.de";

export const getMatches = async (league, year, matchDay) => {
  if (!league || !year || !matchDay) {
    console.error("❌ Nieprawidłowe parametry: league, year, matchDay");
    return [];
  }

  try {
    const url = `${API_BASE_URL}/getmatchdata/${league}/${year}/${matchDay}`;
    console.log("🌍 Pobieranie danych z:", url);
    
    const response = await axios.get(url, { timeout: 10000 }); // Timeout 10s
    console.log("✅ Pobrane mecze:", response.data);
    
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error("⏳ Żądanie zostało anulowane:", error.message);
    } else if (error.code === "ECONNABORTED") {
      console.error("⚠️ Timeout - serwer nie odpowiedział na czas!");
    } else {
      console.error("❌ Błąd pobierania danych:", error);
    }
    return [];
  }
};
