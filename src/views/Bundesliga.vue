<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Mecze Bundesliga</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="layout-container">
        <div class="sidebar">
          <h3>Kolejki</h3>
          <div class="matchday-buttons">
            <button
              v-for="day in matchDays"
              :key="day"
              :class="{ active: selectedMatchDay === day }"
              @click="selectMatchDay(day)"
            >
              {{ day }}
            </button>
          </div>
        </div>

        <div class="content">
          <ion-list v-if="matches?.length">
            <ion-item 
              v-for="match in matches" 
              :key="match.matchID" 
              @click="showMatchDetails(match)"
            >
              <ion-label>
                <h2>
                  <img :src="match.team1?.teamIconUrl" class="team-logo" />
                  {{ match.team1?.teamName ?? "Nieznana drużyna" }} 
                  vs 
                  <img :src="match.team2?.teamIconUrl" class="team-logo" />
                  {{ match.team2?.teamName ?? "Nieznana drużyna" }}
                </h2>
                <p>
                  Wynik: {{ match.matchResults?.[1]?.pointsTeam1 ?? "?" }} - 
                  {{ match.matchResults?.[1]?.pointsTeam2 ?? "?" }}
                </p>
                <p>Data meczu: {{ formatDate(match.matchDateTime) }}</p>
              </ion-label>
              <ion-button
                slot="end"
                :color="isInComparisonList(match) ? 'success' : 'danger'"
                @click.stop="toggleComparison(match)"
              >
                {{ isInComparisonList(match) ? 'Usuń z porównania' : 'Dodaj do porównania' }}
              </ion-button>
            </ion-item>
          </ion-list>

          <ion-text v-else>
            <p>Brak danych do wyświetlenia.</p>
          </ion-text>

          <MatchDetails 
            v-if="selectedMatch"
            :match="selectedMatch" 
            @close="selectedMatch = null"
          />
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, watch } from "vue";
import { useMatchStore } from "@/stores/matchStore";
import { storeToRefs } from "pinia";
import { format, parseISO } from "date-fns";
import MatchDetails from "@/components/MatchDetails.vue";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonList,
  IonText,
  onIonViewWillEnter,
} from "@ionic/vue";

const matchStore = useMatchStore();
const { matches } = storeToRefs(matchStore);
const selectedMatch = ref(null);
const loading = ref(false);
const selectedMatchDay = ref("26"); // domyślnie 26 kolejka
const matchDays = Array.from({ length: 34 }, (_, i) => `${i + 1}`);

const formatDate = (dateString) => {
  return format(parseISO(dateString), "dd.MM.yyyy HH:mm");
};

const showMatchDetails = (match) => {
  selectedMatch.value = match;
};

const loadMatches = async () => {
  loading.value = true;
  await matchStore.fetchMatches("bl1", "2024", selectedMatchDay.value);
  loading.value = false;
};

const selectMatchDay = async (day) => {
  selectedMatchDay.value = day;
  await loadMatches();
};

onIonViewWillEnter(async () => {
  await loadMatches();
});

const comparisonList = ref(JSON.parse(localStorage.getItem('comparisonList')) || []);

const isInComparisonList = (match) => {
  return comparisonList.value.some((item) => item.matchID === match.matchID);
};

const toggleComparison = (match) => {
  if (isInComparisonList(match)) {
    comparisonList.value = comparisonList.value.filter((item) => item.matchID !== match.matchID);
  } else {
    comparisonList.value.push(match);
  }
  localStorage.setItem('comparisonList', JSON.stringify(comparisonList.value));
};
</script>

<style scoped>
.layout-container {
  display: flex;
  flex-direction: row;
  padding: 1rem;
  gap: 1rem;
}

.sidebar {
  width: 200px;
  border: 1px solid #a3c2f2;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(76, 141, 255, 0.15);
}

.sidebar h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #3366cc;
}

.matchday-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.matchday-buttons button {
  background-color: #93aed6;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  text-align: left;
  transition: background-color 0.2s, transform 0.2s;
  color: #003366;
  font-weight: 500;
}

.matchday-buttons button:hover {
  background-color: #b3d1ff;
  transform: scale(1.03);
}

.matchday-buttons button.active {
  background-color: #4c8dff;
  color: #ffffff;
  font-weight: bold;
}

.content {
  flex: 1;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 20px;
}

.team-logo {
  width: 24px;
  height: 28px;
  vertical-align: middle;
  margin: 0 5px;
}

@media (max-width: 768px) {
  .layout-container {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
  }
}
</style>