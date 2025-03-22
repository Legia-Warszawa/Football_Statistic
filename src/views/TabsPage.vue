<template>
    <ion-page>
      <ion-tabs>
        <ion-router-outlet></ion-router-outlet> 
        <ion-tab-bar slot="bottom">
          <ion-tab-button tab="matches" href="/tabs/matches">
            <ion-icon :icon="footballOutline" />
            <ion-label>Liga Mistrzów</ion-label>
          </ion-tab-button>
          <ion-tab-button tab="settings" href="/tabs/Bundesliga">
            <ion-icon :icon="footballOutline" />
            <ion-label>Bundesliga</ion-label>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-page>
  </template>
  
  <script setup>
  import { IonPage, IonTabs, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, IonIcon } from '@ionic/vue';
  import { footballOutline, settingsOutline } from 'ionicons/icons';
  </script>
  