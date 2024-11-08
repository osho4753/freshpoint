# Predikce

Když jsem zkoumal téma predikci, narazil jsem na výpočet předpovědí lineárního trendu.
Pomocí vstupních parametrů můžeme určit sklon trendu a vizualizovat, jak probíhá graf prodeje v časovém intervalu.
S těmito údaji můžeme předpovídat další prodeje (více o vzorci v projektu).
Get endpoint(http://localhost:3000/prediction)
Post endpoint(http://localhost:3000/predict)

odesílané hodnoty musí mít hodnotu tj. tržby za týden a časové značky ve formátu ISOString jinak hodnoty neprojdou validací.

kód taky přijímá 3 parametry ('changepoint_prior_scale','changepoint_range','interval_width').
changepoint_range : Část historie, ve které se budou vyhodnocovat změny trendu.
changepoint_prior_scale : Posílení nebo oslabení trendu
interval_width : Ovlivňuje trend - vysoká interval_width zvyšuje trend.
Není nutné nastavovat všechny tři parametry, můžete nastavit kterýkoli z nich samostatně.

## Technologie

- TypeScript
- Node.js
- Express

## Setup

1. Clone the repository.
2. Install dependencies:
   npm install

## Start

npm run dev
