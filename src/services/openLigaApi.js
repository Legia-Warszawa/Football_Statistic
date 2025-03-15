import axios from "axios";

const API_BASE_URL = "https://api.openligadb.de";

export const getMatches = async (league = "ucl24", year = "2024", matchDay = "11") => {
  try {
    const url = `${API_BASE_URL}/getmatchdata/${league}/${year}/${matchDay}`;
    console.log("Pobieranie danych z:", url); // 🔹 Logowanie URL-a
    const response = await axios.get(url);
    
    console.log("Pobrane mecze:", response.data); // 🔹 Logowanie pobranych danych
    return response.data;
  } catch (error) {
    console.error("Błąd pobierania danych:", error);
    return [];
  }
};
