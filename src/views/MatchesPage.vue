<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Mecze</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list v-if="matches.length">
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
              {{ match.matchResults?.[0]?.pointsTeam1 ?? "?" }} - 
              {{ match.matchResults?.[0]?.pointsTeam2 ?? "?" }}
            </p>
            <p>Data meczu: {{ formatDate(match.matchDateTime) }}</p>
          </ion-label>
        </ion-item>
      </ion-list>
      <ion-text v-else>
        <p>Brak danych do wyświetlenia.</p>
      </ion-text>

      <!-- Modal z szczegółami meczu -->
      <ion-modal :is-open="selectedMatch !== null" @didDismiss="selectedMatch = null">
        <ion-header>
          <ion-toolbar>
            <ion-title>Szczegóły meczu</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="selectedMatch = null">Zamknij</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div v-if="selectedMatch">
            <h2>
              <img :src="selectedMatch.team1?.teamIconUrl" alt="Logo drużyny 1" class="team-logo" />
              {{ selectedMatch.team1?.teamName ?? "Nieznana drużyna" }} 
              vs 
              <img :src="selectedMatch.team2?.teamIconUrl" alt="Logo drużyny 2" class="team-logo" />
              {{ selectedMatch.team2?.teamName ?? "Nieznana drużyna" }}
            </h2>
            <p>
              Wynik: 
              {{ selectedMatch.matchResults?.[0]?.pointsTeam1 ?? "?" }} - 
              {{ selectedMatch.matchResults?.[0]?.pointsTeam2 ?? "?" }}
            </p>
            <p>Data meczu: {{ formatDate(selectedMatch.matchDateTime) }}</p>
            <p>Miejsce: {{ selectedMatch.location?.locationStadium ?? "Nieznane" }}</p>
            <p>Sezon: {{ selectedMatch.leagueName ?? "Nieznany" }}</p>
            <!--
              <p>Gole:</p>
                  <ul>
                    <li v-for="goal in [...selectedMatch.goals].sort((a, b) => a.matchMinute - b.matchMinute)" :key="goal.goalID">
                      {{ goal.matchMinute }}' - {{ goal.goalGetterName }} 
                      <span v-if="goal.isOwnGoal">(samobójczy)</span>
                      <span v-if="goal.isPenalty">(karny)</span>
                      ({{ goal.scoreTeam1 }} - {{ goal.scoreTeam2 }})
                    </li>
                  </ul>
            -->    
            <p>Grupa: {{ selectedMatch.group?.groupName ?? "Nieznana" }}</p>
            <p>Status: {{ selectedMatch.matchIsFinished ? "Zakończony" : "W trakcie" }}</p>
          </div>
        </ion-content>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { useMatchStore } from "@/stores/matchStore";
import { storeToRefs } from "pinia";
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonList, IonText, IonModal, IonButtons, IonButton,} from '@ionic/vue';
import { format, parseISO } from 'date-fns';

const matchStore = useMatchStore();
const { matches } = storeToRefs(matchStore);
const selectedMatch = ref(null);


const formatDate = (dateString) => {
  return format(parseISO(dateString), 'dd.MM.yyyy HH:mm');
};


const showMatchDetails = (match) => {
  selectedMatch.value = match;
};

onMounted(async () => {
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