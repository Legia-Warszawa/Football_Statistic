<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Mecze Liga Mistrzów
          <button 
            class="custom-button large-button" 
            @click="showCompareModal = true" 
            v-if="comparisonList.length"
          >
            <span>🔍 Porównaj wybrane mecze ({{ comparisonList.length }})</span>
          </button>
        </ion-title>
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
          <div v-if="loading" class="loading-container">
            <ion-spinner name="crescent" />
            <p>Ładowanie meczów...</p>
          </div>

          <button 
            class="custom-button large-button" 
            @click="showCompareModal = true" 
            v-if="comparisonList.length"
          >
            <span>🔍 Porównaj wybrane mecze ({{ comparisonList.length }})</span>
          </button>

          <ion-list v-if="matches?.length">
            <ion-item
              v-for="match in matches"
              :key="match.matchID"
              @click="showMatchDetails(match)"
            >
              <ion-label>
                <h2>
                  <img :src="match.team1?.teamIconUrl" alt="Logo drużyny 1" class="team-logo" />
                  {{ match.team1?.teamName ?? "Nieznana drużyna" }}
                  vs
                  <img :src="match.team2?.teamIconUrl" alt="Logo drużyny 2" class="team-logo" />
                  {{ match.team2?.teamName ?? "Nieznana drużyna" }}
                </h2>
                <p>Wynik: {{ match.matchResults?.[1]?.pointsTeam1 ?? "?" }} - {{ match.matchResults?.[1]?.pointsTeam2 ?? "?" }}</p>
                <p>Data meczu: {{ formatDate(match.matchDateTime) }}</p>
              </ion-label>

              <ion-button
                slot="end"
                :color="isInComparisonList(match) ? 'danger' : 'success'"
                :class="{ pulse: isAnimating(match.matchID) }"
                @click.stop="toggleComparison(match)"
              >
                <ion-icon :icon="isInComparisonList(match) ? checkmarkCircle : addCircle" slot="start" />
                {{ isInComparisonList(match) ? 'Usuń' : 'Dodaj' }}
              </ion-button>
            </ion-item>
          </ion-list>

          <CompareModal
            v-if="showCompareModal"
            :isOpen="showCompareModal"
            :matches="comparisonList"
            @close="showCompareModal = false"
          />

          <ion-text v-else>
            <p>Brak danych do wyświetlenia.</p>
          </ion-text>
        </div>
      </div>

      <MatchDetails v-if="selectedMatch" :match="selectedMatch" @close="selectedMatch = null" />
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from "vue";
import { useMatchStore } from "@/stores/matchStore";
import { storeToRefs } from "pinia";
import { format, parseISO } from "date-fns";
import MatchDetails from "@/components/MatchDetails.vue";
import CompareModal from "@/components/CompareModal.vue";
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
  IonSpinner,
  IonButton,
  IonIcon,
  onIonViewWillEnter,
} from "@ionic/vue";
import { addCircle, checkmarkCircle } from "ionicons/icons";

// Store
const matchStore = useMatchStore();
const { matches } = storeToRefs(matchStore);

// Stany
const selectedMatch = ref(null);
const loading = ref(false);
const selectedMatchDay = ref("1");
const matchDays = Array.from({ length: 16 }, (_, i) => `${i + 1}`);

const formatDate = (dateString) => format(parseISO(dateString), "dd.MM.yyyy HH:mm");

const showMatchDetails = (match) => {
  selectedMatch.value = match;
};

const loadMatches = async () => {
  loading.value = true;
  await matchStore.fetchMatches("ucl24", "2024", selectedMatchDay.value);
  loading.value = false;
};

const selectMatchDay = async (day) => {
  selectedMatchDay.value = day;
  await loadMatches();
};

onIonViewWillEnter(async () => {
  await loadMatches();
});

// Lista porównań
const comparisonList = ref(JSON.parse(localStorage.getItem('comparisonList')) || []);
const showCompareModal = ref(false);

// Animacja
const animatingItems = ref([]);

const isAnimating = (matchID) => animatingItems.value.includes(matchID);

const isInComparisonList = (match) => {
  return comparisonList.value.some((item) => item.matchID === match.matchID);
};

const toggleComparison = (match) => {
  if (isInComparisonList(match)) {
    comparisonList.value = comparisonList.value.filter((item) => item.matchID !== match.matchID);
    console.log(`🛑 Usunięto z porównania:`, match.team1?.teamName, "vs", match.team2?.teamName);
  } else {
    comparisonList.value.push(match);
    console.log(`✅ Dodano do porównania:`, match.team1?.teamName, "vs", match.team2?.teamName);
  }
  localStorage.setItem('comparisonList', JSON.stringify(comparisonList.value));

  animatingItems.value.push(match.matchID);
  setTimeout(() => {
    animatingItems.value = animatingItems.value.filter(id => id !== match.matchID);
  }, 500);
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
  /* border: 1px solid #a3c2f2; */
  border: none;
  border-radius: 12px;
  padding: 1rem;
  box-shadow: 0 4px 12px rgba(76, 141, 255, 0.15);
}

.sidebar h3 {
  font-size: 22px;
  font-weight: 500;
  margin-bottom: 19px;
  color: #ccc233;
  text-align: center;
}

.matchday-buttons {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.matchday-buttons button {
  background-color: #ff595e;
  border: none;
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
  color: #003366;
  font-weight: 500;
}

.matchday-buttons button:hover {
  background-color: #ffca3a;
  transform: scale(1.03);
}

.matchday-buttons button.active {
  background-color: #8ac926;
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

.pulse {
  animation: pulse 0.5s ease;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

@media (max-width: 768px) {
  .layout-container {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
  }
}

.custom-button {
  display: inline-block;
  width: 100%; /* Adjust width as needed */
  padding: 12px 20px;
  font-size: 16px;
  font-weight: bold;
  color: #003366;
  background-color: #ff595e;
  border: none;
  cursor: pointer;
  text-align: center;
  transition: background-color 0.3s, color 0.3s;
  margin-bottom: 10px;
  border-radius: 8px;
}

.custom-button:hover {
  background-color: #ffca3a;
  color: grey;
}

.custom-button span {
  display: inline-block;
  transition: transform 0.2s ease; /* Smooth scaling */
}

.custom-button:hover span {
  transform: scale(1.9); /* Scale the text */
}
</style>
