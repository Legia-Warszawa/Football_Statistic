<template>
  <ion-modal :is-open="true" @didDismiss="$emit('close')">
    <ion-header>
      <ion-toolbar>
        <ion-title>Szczegóły meczu</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$emit('close')">Zamknij</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="match" class="match-header">
        <div class="team-info">
          <img :src="match.team1?.teamIconUrl" alt="Logo drużyny 1" class="team-logo" />
          <span class="team-name">{{ match.team1?.teamName ?? "Nieznana drużyna" }}</span>
        </div>

        <div class="match-score">
          <div class="score-box">
            <span class="score">{{ getFinalScore() }}</span>
          </div>
          <span class="match-status" :class="{ finished: match.matchIsFinished }">
            {{ match.matchIsFinished ? "Zakończony" : "W trakcie" }}
          </span>
        </div>

        <div class="team-info">
          <img :src="match.team2?.teamIconUrl" alt="Logo drużyny 2" class="team-logo" />
          <span class="team-name">{{ match.team2?.teamName ?? "Nieznana drużyna" }}</span>
        </div>
      </div>

      <ion-grid class="match-info-grid" v-if="match">
        <ion-row>
          <ion-col size="6">
            <ion-item>
              <ion-label>
                <h3>Data i godzina</h3>
                <p>{{ formatDateTime(match.matchDateTime) }}</p>
              </ion-label>
            </ion-item>
          </ion-col>
          <ion-col size="6">
            <ion-item>
              <ion-label>
                <h3>Stadion</h3>
                <p>{{ match.location?.locationStadium ?? "Nieznany" }}</p>
              </ion-label>
            </ion-item>
          </ion-col>
        </ion-row>

        <ion-row>
          <ion-col size="6">
            <ion-item>
              <ion-label>
                <h3>Miasto</h3>
                <p>{{ match.location?.locationCity ?? "Nieznane" }}</p>
              </ion-label>
            </ion-item>
          </ion-col>
          <ion-col size="6">
            <ion-item>
              <ion-label>
                <h3>Kolejka</h3>
                <p>{{ translateGroupName(match.group?.groupName ?? "Nieznana") }}</p>
              </ion-label>
            </ion-item>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-list class="goals-list" v-if="sortedGoals.length">
        <ion-list-header>
          <ion-label>Strzelcy goli</ion-label>
        </ion-list-header>
        <ion-item v-for="goal in sortedGoals" :key="goal.goalID">
          <ion-label>
            <p>
              <span class="goal-minute">{{ goal.matchMinute }}'</span>
              <span class="goal-scorer">{{ goal.goalGetterName }}</span>
              <span class="goal-score">{{ goal.scoreTeam1 }} - {{ goal.scoreTeam2 }}</span>
            </p>
            <p v-if="goal.isPenalty" class="goal-type">(karny)</p>
            <p v-if="goal.isOwnGoal" class="goal-type">(samobój)</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <div v-else class="no-goals">
        <ion-text color="medium">Brak informacji o golach</ion-text>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import { computed, watch } from "vue";
import {
  IonModal, IonHeader, IonToolbar, IonTitle, IonButtons, IonButton,
  IonContent, IonGrid, IonRow, IonCol, IonItem, IonLabel, IonList,
  IonListHeader, IonText
} from "@ionic/vue";
import { format, parseISO } from "date-fns";
import { pl } from "date-fns/locale";
import { translateGroupName } from "@/utils/groupNames"; // Importujemy funkcję z pliku

const props = defineProps({
  match: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["close"]);

console.log("🏁 Komponent załadowany!");
console.log("📊 Otrzymane dane meczu:", props.match);

const formatDateTime = (dateString) => {
  if (!dateString) return "Nieznana data";
  console.log("🕒 Formatowanie daty:", dateString);
  return format(parseISO(dateString), "dd.MM.yyyy HH:mm", { locale: pl });
};

const getFinalScore = () => {
  const finalResult = props.match.matchResults?.find((r) => r.resultName === "Endergebnis");
  const score = finalResult
    ? `${finalResult.pointsTeam1 ?? "?"} - ${finalResult.pointsTeam2 ?? "?"}`
    : `${props.match.matchResults?.[0]?.pointsTeam1 ?? "?"} - ${props.match.matchResults?.[0]?.pointsTeam2 ?? "?"}`;
  
  console.log("⚽ Wynik końcowy:", score);
  return score;
};

const sortedGoals = computed(() => {
  console.log("⚽ Sortowanie goli...");
  return [...(props.match.goals ?? [])].sort((a, b) => (a.matchMinute ?? 0) - (b.matchMinute ?? 0));
});

watch(() => props.match, (newMatch, oldMatch) => {
  console.log("🔄 Dane meczu zostały zaktualizowane!");
  console.log("📊 Stare dane:", oldMatch);
  console.log("📊 Nowe dane:", newMatch);
}, { deep: true });
</script>

<style scoped>
.match-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid var(--ion-color-light);
  margin-bottom: 16px;
}

.team-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
}

.team-logo {
  width: 48px;
  height: 48px;
  object-fit: contain;
  margin-bottom: 8px;
}

.team-name {
  font-weight: 500;
  text-align: center;
}

.match-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0 16px;
}

.score-box {
  background: var(--ion-color-light);
  padding: 8px 16px;
  border-radius: 8px;
  margin-bottom: 4px;
}

.score {
  font-weight: bold;
  font-size: 1.2em;
}

.match-status {
  font-size: 0.8em;
  color: var(--ion-color-success);
}

.match-status.finished {
  color: var(--ion-color-medium);
}

.match-info-grid {
  margin: 16px 0;
}

.goals-list {
  margin-top: 24px;
}

.goal-minute {
  font-weight: bold;
  margin-right: 8px;
  color: var(--ion-color-primary);
}

.goal-scorer {
  font-weight: 500;
}

.goal-score {
  float: right;
  color: var(--ion-color-medium);
}

.goal-type {
  font-size: 0.8em;
  color: var(--ion-color-medium);
  margin-top: 2px;
}

.no-goals {
  text-align: center;
  padding: 20px;
  color: var(--ion-color-medium);
}
</style>
