import axios from "axios";

const API_BASE_URL = "https://api.openligadb.de";

export const getMatches = async (league, year, matchDay) => {
  if (!league || !year) {
    console.error(" Nieprawidłowe parametry: league i year są wymagane");
    return [];
  }

  let url = `${API_BASE_URL}/getmatchdata/${league}/${year}`;
  if (matchDay !== undefined && matchDay !== null) {
    url += `/${matchDay}`;
  }

  try {
    console.log(" Pobieranie danych z:", url);
    const response = await axios.get(url, { timeout: 10000 });
    console.log(" Pobrane mecze:", response.data);
    return response.data;
  } catch (error) {
    if (axios.isCancel(error)) {
      console.error("⏳ Żądanie anulowane:", error.message);
    } else if (error.code === "ECONNABORTED") {
      console.error("Timeout - serwer nie odpowiedział na czas!");
    } else {
      console.error(" Błąd pobierania danych:", error);
    }
    return [];
  }
};

