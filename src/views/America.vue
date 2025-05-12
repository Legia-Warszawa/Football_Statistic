<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title style="text-align: center; ">Mecze Copa America</ion-title>
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
            </ion-item>
          </ion-list>

          <ion-text v-else>
            <!-- <p>Brak danych do wyświetlenia.</p> -->
          </ion-text>

          <!-- Modal z MatchDetails -->
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
import { onIonViewWillEnter } from "@ionic/vue";

const matchStore = useMatchStore();
const { matches } = storeToRefs(matchStore);
const selectedMatch = ref(null);
const loading = ref(false);
const selectedMatchDay = ref("1");
const matchDays = Array.from({ length: 7 }, (_, i) => `${i + 1}`); 

const formatDate = (dateString) => {
  return format(parseISO(dateString), "dd.MM.yyyy HH:mm");
};

const showMatchDetails = (match) => {
  console.log("Wybrano mecz:", match);
  selectedMatch.value = match;
};

const loadMatches = async () => {
  console.log("Ładowanie meczów dla kolejki:", selectedMatchDay.value);
  loading.value = true;
  try {
    await matchStore.fetchMatches("CA2024", "2024", selectedMatchDay.value);
  } catch (error) {
    console.error("Błąd podczas ładowania meczów:", error);
  } finally {
    loading.value = false;
  }
};

const selectMatchDay = async (day) => {
  console.log("Wybrano kolejkę:", day);
  selectedMatchDay.value = day;
  selectedMatch.value = null;
  await loadMatches();
};

onIonViewWillEnter(async () => {
  console.log("Wejście na stronę America");
  await loadMatches();
});

watch(selectedMatchDay, async (newDay) => {
  console.log("Zmiana kolejki na:", newDay);
  await loadMatches();
});
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
  border: none;
  border-radius: 8px;
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

.team-logo {
  width: 24px;
  height: 28px;
  vertical-align: middle;
  margin: 0 5px;
}
</style>