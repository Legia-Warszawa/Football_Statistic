<template>
  <ion-modal
    :is-open="isOpen"
    @didDismiss="closeModal"
    :enter-animation="null"
    :leave-animation="null"
  >
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Porównanie meczów</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="closeModal">Zamknij</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-button expand="block" color="danger" @click="clearComparison" style="margin-bottom: 16px;">
        🗑️ Wyczyść listę porównania
      </ion-button>

      <div class="comparison-table">
        <!-- Nagłówki drużyn -->
        <div class="comparison-row header-row">
          <div class="comparison-cell header-cell">Parametr</div>
          <div
            class="comparison-cell"
            v-for="match in matches"
            :key="match.matchID"
          >
            <div>
              <a :href="getFlashscoreLink(match.team1?.teamName)" target="_blank">
                {{ match.team1?.teamName ?? "Nieznana drużyna" }}
              </a>
              <br>vs<br>
              <a :href="getFlashscoreLink(match.team2?.teamName)" target="_blank">
                {{ match.team2?.teamName ?? "Nieznana drużyna" }}
              </a>
            </div>
          </div>
        </div>

        <!-- Wiersze szczegółów -->
        <div class="comparison-row" v-for="(row, index) in detailsRows" :key="index">
          <div class="comparison-cell parameter-cell">
            {{ row.label }}
          </div>
          <div
            class="comparison-cell"
            v-for="match in matches"
            :key="match.matchID + '-' + index"
          >
            {{ row.getValue(match) }}
          </div>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup>
import { format, parseISO } from "date-fns";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
} from "@ionic/vue";
import { translateGroupName } from "@/utils/groupNames";  // Zaimportuj funkcję tłumaczenia

const props = defineProps({
  isOpen: Boolean,
  matches: Array,
  translateGroupName: Function, // dodaj translateGroupName jako prop
});

const emit = defineEmits(["close"]);

const closeModal = () => {
  emit('close');
};

const clearComparison = () => {
  localStorage.removeItem('comparisonList');
  emit('close');
  window.location.reload();
};

const formatDate = (dateString) => {
  try {
    return format(parseISO(dateString), "dd.MM.yyyy HH:mm");
  } catch {
    return "Brak daty";
  }
};

const getFlashscoreLink = (teamName) => {
  if (!teamName) return "#";
  const formattedName = teamName.replace(/\s+/g, "-").toLowerCase();
  return `https://www.flashscore.pl/druzyna/${formattedName}/`;
};

// Dane do porównania
const detailsRows = [
  {
    label: "Wynik",
    getValue: (match) => `${match.matchResults?.[1]?.pointsTeam1 ?? "?"} - ${match.matchResults?.[1]?.pointsTeam2 ?? "?"}`,
  },
  {
    label: "Data meczu",
    getValue: (match) => formatDate(match.matchDateTime),
  },
  {
    label: "Kolejka / Grupa",
    getValue: (match) => translateGroupName(match.group?.groupName ?? "Brak danych"), // Tłumaczenie grupy
  },
  {
    label: "Stadion",
    getValue: (match) => match.location?.locationStadium ?? "Brak danych",
  },
  {
    label: "Miasto",
    getValue: (match) => match.location?.locationCity ?? "Brak danych",
  },
];

</script>

<style scoped>
.comparison-table {
  display: table;
  width: 100%;
  border-collapse: collapse;
}

.comparison-row {
  display: table-row;
}

.comparison-cell {
  display: table-cell;
  border: 1px solid #ccc;
  padding: 8px;
  text-align: center;
  vertical-align: middle;
}


.header-cell {
  font-weight: bold;

  font-size: 16px;
}

.parameter-cell {
  font-weight: bold;
 
  font-size: 15px;
}

a {
  color: #3366cc;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}
</style>
