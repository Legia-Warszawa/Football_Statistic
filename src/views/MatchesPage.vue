<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Mecze</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-list v-if="matches.length">
          <ion-item v-for="match in matches" :key="match.MatchID">
            <ion-label>
              <h2>
                {{ match.team1?.teamName ?? "Nieznana drużyna" }} 
                vs 
                {{ match.team2?.teamName ?? "Nieznana drużyna" }}
              </h2>
              <p>
                Wynik: 
                {{ match.matchResults?.[0]?.pointsTeam1 ?? "?" }} - 
                {{ match.matchResults?.[0]?.pointsTeam2 ?? "?" }}
              </p>
              <p>Data meczu: {{ new Date(match.MatchDateTimeUTC).toLocaleString() }}</p>
            </ion-label>
          </ion-item>
        </ion-list>
        <ion-text v-else>
          <p>Brak danych do wyświetlenia.</p>
        </ion-text>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup>
  import { onMounted, watch } from "vue";
  import { useMatchStore } from "@/stores/matchStore";
  import { storeToRefs } from "pinia";
  import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem } from '@ionic/vue';
  
  const matchStore = useMatchStore();
  const { matches } = storeToRefs(matchStore);
  
  onMounted(async () => {
    console.log("🔹 Komponent zamontowany, pobieram mecze...");
    await matchStore.fetchMatches("ucl24", "2024", "11");
  });
  
  // 🔥 Watch na zmiany w matches
  watch(matches, (newMatches) => {
    console.log("🔹 WATCH: matches zmienione!", newMatches);
  });
  </script>
  