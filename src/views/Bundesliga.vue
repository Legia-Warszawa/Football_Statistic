<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Blank</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Bundesliga</ion-title>
        </ion-toolbar>
      </ion-header>

      <div id="container">
        <strong>In Progressss</strong>
      </div>
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
const { matchesBundesliga, isLoading } = storeToRefs(matchStore);


const formatDate = (dateString) => {
  return format(parseISO(dateString), 'dd.MM.yyyy HH:mm');
};


const showMatchDetails = (match) => {
  selectedMatch.value = match;
};

onMounted(async () => {
  console.log("🔹 Komponent zamontowany, pobieram mecze Bundesligi...");
  await matchStore.fetchBundesligaMatches("bl1", "2024", "25");
});

watch(matchesBundesliga, (newMatches) => {
  console.log("🔹 WATCH: Liczba meczy Bundesligi:", newMatches.length);
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
#container {
  text-align: center;
  
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}

#container strong {
  font-size: 20px;
  line-height: 26px;
}

#container p {
  font-size: 16px;
  line-height: 22px;
  
  color: #8c8c8c;
  
  margin: 0;
}

#container a {
  text-decoration: none;
}
</style>
