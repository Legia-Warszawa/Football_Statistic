<template>
    <ion-page @click="refreshFavorites">
      <ion-header>
        <ion-toolbar>
          <ion-title>Ulubione drużyny</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <ion-list v-if="favoriteTeams.length">
          <div v-for="team in favoriteTeams" :key="team.teamId" class="team-section">
            <ion-item lines="full">
              <ion-avatar slot="start">
                <img :src="team.teamIconUrl" />
              </ion-avatar>
              <ion-label>
                <h2>{{ team.teamName }}</h2>
                <p>Ostatnie mecze:</p>
              </ion-label>
              <ion-button
                slot="end"
                color="danger"
                fill="clear"
                size="small"
                @click="removeFromFavorites(team.teamId)"
              >
                <ion-icon :icon="trashOutline" />
              </ion-button>
            </ion-item>
  
            <ion-list v-if="team.matches && team.matches.length">
              <ion-item v-for="match in team.matches" :key="match.matchID">
                <ion-label>
                  <p>{{ match.team1.teamName }} vs {{ match.team2.teamName }}</p>
                  <p>
                    {{ formatDate(match.matchDateTime) }} –
                    {{ getMatchScore(match) }}
                  </p>
                </ion-label>
              </ion-item>
            </ion-list>
            <ion-text v-else color="medium" class="ion-padding-start">Brak meczów</ion-text>
          </div>
        </ion-list>
        <ion-text v-else color="medium">Brak ulubionych drużyn</ion-text>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { onMounted, onUnmounted, ref } from 'vue';
  import {
    IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonAvatar, IonLabel, IonText, IonButton, IonIcon
  } from '@ionic/vue';
  import { format, parseISO } from 'date-fns';
  import { pl } from 'date-fns/locale';
  import { trashOutline } from 'ionicons/icons';
  
  const FAVORITES_KEY = 'favoriteTeams';
  const favoriteTeams = ref([]);
  
  // Formatowanie daty
  const formatDate = (isoDate) => {
    if (!isoDate) return "Nieznana data";
    return format(parseISO(isoDate), 'dd.MM.yyyy HH:mm', { locale: pl });
  };
  
  // Pobieranie wyniku meczu
  const getMatchScore = (match) => {
    const result = match.matchResults?.find(r => r.resultName === "Endergebnis");
    return result ? `${result.pointsTeam1} - ${result.pointsTeam2}` : "Brak wyniku";
  };
  
  // Pobieranie meczów drużyny
  const fetchTeamMatches = async (teamId) => {
    console.log(`📡 Pobieram mecze dla drużyny ID: ${teamId}`);
    try {
      const response = await fetch(`https://api.openligadb.de/getmatchesbyteamid/${teamId}/10/10`);
      if (!response.ok) throw new Error("Błąd odpowiedzi z API");
      const data = await response.json();
      console.log(`✅ Otrzymano ${data.length} meczów dla drużyny ${teamId}`);
      return data;
    } catch (e) {
      console.error(`❌ Błąd pobierania meczów dla drużyny ID ${teamId}:`, e);
      return [];
    }
  };
  
  // Ładowanie ulubionych drużyn
  const loadFavorites = async () => {
    const raw = localStorage.getItem(FAVORITES_KEY);
    console.log("📦 Surowe dane z localStorage:", raw);
  
    try {
      const teamIds = raw ? JSON.parse(raw) : [];
      console.log("✅ Odczytane ID drużyn:", teamIds);
  
      const teamsWithMatches = await Promise.all(teamIds.map(async (teamId) => {
        const matches = await fetchTeamMatches(teamId);
        const firstMatch = matches[0];
        const team = firstMatch?.team1?.teamId === teamId ? firstMatch.team1 : firstMatch?.team2;
  
        if (!team) {
          console.warn(`⚠️ Brak danych drużyny dla ID: ${teamId}`);
          return { teamId, teamName: `Drużyna ${teamId}`, teamIconUrl: '', matches: [] };
        }
  
        return {
          teamId: team.teamId,
          teamName: team.teamName,
          teamIconUrl: team.teamIconUrl,
          matches,
        };
      }));
  
      favoriteTeams.value = teamsWithMatches;
      console.log("🏁 Gotowe drużyny z meczami:", favoriteTeams.value);
    } catch (e) {
      console.error("❌ Błąd ładowania ulubionych drużyn", e);
    }
  };
  
  // Funkcja do usuwania drużyny z ulubionych
  const removeFromFavorites = (teamIdToRemove) => {
    const raw = localStorage.getItem(FAVORITES_KEY);
    let ids = raw ? JSON.parse(raw) : [];
    ids = ids.filter(id => id !== teamIdToRemove);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(ids));
    console.log(`🗑️ Usunięto drużynę ID ${teamIdToRemove} z ulubionych`);
    loadFavorites(); // ponowne załadowanie danych
  };
  
  // Odświeżenie ulubionych drużyn po kliknięciu na stronę
  const refreshFavorites = () => {
    console.log("🔄 Odświeżam dane ulubionych drużyn...");
    loadFavorites(); // załaduj ponownie dane z localStorage
  };
  
  onMounted(() =>{
    console.log("🏁 Komponent ulubionych drużyn załadowany!");
    loadFavorites(); // załaduj dane przy montowaniu komponentu
  });
  </script>
  
  <style scoped>
  .team-section {
    margin-bottom: 24px;
  }
  </style>
  