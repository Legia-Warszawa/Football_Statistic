<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Mecze Liga Mistrzów</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list v-if="matches?.length">
        <ion-item v-for="match in matches" :key="match.matchID" @click="showMatchDetails(match)">
          <ion-label>
            <h2>
              <img :src="match.team1?.teamIconUrl" alt="Logo drużyny 1" class="team-logo" />
              {{ match.team1?.teamName ?? "Nieznana drużyna" }} 
              vs 
              <img :src="match.team2?.teamIconUrl" alt="Logo drużyny 2" class="team-logo" />
              {{ match.team2?.teamName ?? "Nieznana drużyna" }}
            </h2>
            <p>
              Wynik: 
              {{ match.matchResults?.[1]?.pointsTeam1 ?? "?" }} - 
              {{ match.matchResults?.[1]?.pointsTeam2 ?? "?" }}
            </p>
            <p>Data meczu: {{ formatDate(match.matchDateTime) }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-text v-else>
        <p>Brak danych do wyświetlenia.</p>
      </ion-text>
      
      <MatchDetails v-if="selectedMatch" :match="selectedMatch" @close="selectedMatch = null" />
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useMatchStore } from "@/stores/matchStore";
import { storeToRefs } from "pinia";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonText, IonModal, IonButtons, IonButton,onIonViewWillEnter} from '@ionic/vue';
import { format, parseISO } from 'date-fns';
import MatchDetails from "@/components/MatchDetails.vue";


const matchStore = useMatchStore();
const { matches } = storeToRefs(matchStore);
const selectedMatch = ref(null);


const formatDate = (dateString) => {
  return format(parseISO(dateString), 'dd.MM.yyyy HH:mm');
};


const showMatchDetails = (match) => {
  selectedMatch.value = match;
};


onIonViewWillEnter(async () => {
  console.log("🔹 Komponent zamontowany, pobieram mecze...");
  await matchStore.fetchMatches("ucl24", "2024", "11");
});

watch(matches, (newMatches) => {
  console.log("🔹 WATCH: Liczba meczy:", newMatches.length);
  newMatches.forEach((match, index) => {
    console.log(`🔹 Mecz ${index + 1}:`, {
      team1: match.team1?.teamName,
      team2: match.team2?.teamName,
      date: match.matchDateTime,
    });
  });
});
</script>

<style scoped>
.team-logo {
  width: 24px;
  height: 28px;
  vertical-align: middle;
  margin-right: 5px;
  margin-left: 5px;
}

ion-modal {
  --width: 90%;
  --height: 50%;
  --border-radius: 10px;
}
ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  margin-bottom: 8px;
}
</style>