<template>
    <ion-page>
      <ion-tabs>
        <ion-router-outlet></ion-router-outlet> 
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="matches" href="/tabs/matches">
            <img src="../assets/Logo_UEFA_Champions_League.png" alt="Liga Mistrzów" class="custom-tab-icon" />
            <ion-label>Liga Mistrzów</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="settings" href="/tabs/Bundesliga">
            <img src="../assets/bundesliga-logo.png" alt="BundesLiga" class="custom-tab-icon" />
            <ion-label>Bundesliga</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="America" href="/tabs/America">
            <img src="../assets/copa-america-logo.png" alt="Copa America" class="custom-tab-icon" />
            <ion-label>America</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="favorites" href="/tabs/favorites">
            <ion-icon :icon="starOutline" />
            <ion-label>Ulubione</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-page>
  </template>
  
  <script setup>
  import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';
  import { footballOutline, settingsOutline, starOutline } from 'ionicons/icons';
  </script>
  
  <style scoped>
.custom-tab-icon {
  width: 24px; /* Dostosuj rozmiar */
  height: 24px;
  object-fit: contain;
}

/* Jeśli potrzebujesz większej kontroli nad wyglądem całego przycisku */
ion-tab-button {
  --padding-top: 8px;
  --padding-bottom: 8px;
}
  </style>