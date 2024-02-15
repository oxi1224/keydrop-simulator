# PROJEKT NIE AKTUALIZOWANY
# PROJECT DISCONTINUED

# Wymagania
- Node.JS (https://nodejs.org/en)
- yarn (https://yarnpkg.com/)
- PostgreSQL (https://www.postgresql.org.pl/)
- Baza danych (lokalna bądź postronna)

# Uzywanie
- Pobierz kod źródłowy i wypakuj
- Stwórz bazę danych PostgreSQL i stwórz plik ``.env`` z następującą zawartością:
```.env
DATABASE_URL = "Link do bazy danych"
```
- Wpisz następujące komendy w konsoli w ścieżce w której znajduje się projekt:
```
yarn
npx prisma db push
npx prisma generate
yarn dev -- --open
```
- Jeżeli wszystko zostało poprawne wykonane, powinno się otworzyć okno przeglądarki zawierające stronę.

## Importowanie skrzynek
Instrukcja znajduję sie w osobnym repozytorium. [link](https://github.com/oxi1224/keydrop-simulator-scripts/tree/main)

## Autorzy
- [Oxi1224](https://github.com/oxi1224)
