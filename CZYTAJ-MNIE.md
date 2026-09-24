# iNotely — jak wrzucić na stronę

W tym folderze jest gotowa strona: `index.html` (cały program), `manifest.webmanifest` i `sw.js` (instalacja jako aplikacja i praca bez internetu), ikony, `polityka-prywatnosci.html` oraz `_headers` (ustawienia serwera dla Netlify i Cloudflare Pages).

## 1. Zanim wrzucisz — uzupełnij swoje dane

W dwóch plikach wpisz, kto prowadzi stronę:

- `index.html` — wyszukaj `INO_SITE` i zmień `[Twoje imię i nazwisko albo nazwa]` oraz `[twój adres e-mail]`.
- `polityka-prywatnosci.html` — te same dwa miejsca (trzy wystąpienia).

## 2. Wrzucenie na hosting (wymagane https)

Najprościej, za darmo:

- **Netlify Drop** — wejdź na app.netlify.com/drop i przeciągnij cały folder `iNotely`.
- **Cloudflare Pages** — Workers & Pages → Create → Pages → Upload assets → wybierz folder.
- **GitHub Pages** — wrzuć pliki do repozytorium i włącz Pages w ustawieniach.

Instalacja jako aplikacja i praca bez internetu działają tylko pod adresem `https://…` (albo `http://localhost` przy testach). Otwarte jako plik z dysku program działa normalnie, tylko bez instalacji.

## 3. Aktualizacja

Gdy wrzucasz nową wersję `index.html`, w pliku `sw.js` zmień linijkę `const VERSION = '…'` (np. dopisz `-2`). Użytkownicy dostaną wtedy komunikat o nowej wersji. **Notatki zostają** — są w przeglądarce użytkownika, nie w plikach strony.

## 4. Gdzie są notatki użytkowników

Każdy użytkownik ma notatki tylko u siebie — w swojej przeglądarce (IndexedDB). Strona niczego nie wysyła na serwer, więc hosting nie potrzebuje bazy danych, a Ty nie przechowujesz cudzych danych. Uwaga: wyczyszczenie danych przeglądarki usuwa notatki — dlatego program ma „Kopię wszystkiego" (Plik) i prosi przeglądarkę o trwały zapis.

## 5. Ciasteczka i zgody

Program nie używa ciasteczek. Przy pierwszym wejściu pokazuje krótką informację i pyta o zgodę na usługi zewnętrzne (czcionki Google, biblioteki z CDN, pogoda, YouTube). Bez zgody wszystko działa, tylko z czcionkami systemowymi, a wzory i eksport PDF poproszą o zgodę przy pierwszym użyciu.

To nie jest porada prawna — jeśli strona ma służyć firmie albo dużej liczbie osób, warto dać politykę prywatności do przejrzenia prawnikowi.
