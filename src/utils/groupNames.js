// This file contains the mapping of group names from German to Polish.

export const germanToPolishGroups = {
    "Viertelfinale Rückspiele": "Ćwierćfinał Rewanżowy",
    "Halbfinale Rückspiele": "Półfinał Rewanżowy",
    "Viertelfinale Hinspiele": "Ćwierćfinał Pierwszy",
    "Achtelfinale Rückspiele": "1/8 Finału Rewanżowy",
    "Achtelfinale Hinspiele": "1/8 Finału Pierwszy",
    "1. Spieltag": "1. Kolejka",
    "2. Spieltag": "2. Kolejka",
    "3. Spieltag": "3. Kolejka",
    "4. Spieltag": "4. Kolejka",
    "5. Spieltag": "5. Kolejka",
    "6. Spieltag": "6. Kolejka",
    "7. Spieltag": "7. Kolejka",
    "8. Spieltag": "8. Kolejka",
    "Halbfinale Hinspiele": "Półfinał Pierwszy",
    "Finale": "Finał",
  };
  
  export const translateGroupName = (groupName) => {
    return germanToPolishGroups[groupName] || groupName; 
  };
  

