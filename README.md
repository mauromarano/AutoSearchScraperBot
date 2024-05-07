# Autoscout Scraper and Bot

## Descrizione
Il progetto `autoscout_scraper_and_bot` è un'applicazione automatizzata che effettua lo scraping del sito di vendita di auto Autoscout. Utilizza URL personalizzati per cercare veicoli basandosi su specifici criteri come modello, marca, cilindrata, anno, e altri. Estrae i dati di ogni veicolo corrispondente alla ricerca, salva i risultati in un database e invia notifiche via Telegram con tutte le informazioni e foto delle auto trovate.

## Stack Tecnologico
- **JavaScript**: Il linguaggio di programmazione principale usato per lo sviluppo del progetto.
- **Node.js**: Ambiente di esecuzione per JavaScript.
- **Docker**: Utilizzato per containerizzare l'applicazione e il database, facilitando l'esecuzione in qualsiasi ambiente.
- **PostgreSQL**: Sistema di gestione del database usato per archiviare i dati estratti dallo scraping.
- **Telegram API**: Per inviare notifiche agli utenti.
- **Adminer**: Strumento incluso per la gestione del database attraverso un'interfaccia web.

## Come Avviare il Progetto
Per avviare il progetto, seguire i seguenti passaggi:

1. **Configurazione Iniziale**:
   - Clona il repository:
     ```
     git clone https://github.com/tuo-username/autoscout_scraper_and_bot.git
     ```
   - Rinomina `./src/example.config.js` in `./src/config.js`.
   - Configura le variabili necessarie nel `.src/config.js` per la connessione al database e l'integrazione con Telegram.

2. **Setup del Database**:
   - Utilizza Adminer per connetterti al tuo database Docker contenente PostgreSQL.
   - Crea la tabella necessaria seguendo lo schema presente in `schema.sql`.

3. **Lancio dell'Applicazione**:
   - Nella directory principale del progetto, esegui:
     ```
     docker compose up
     ```
   - L'applicazione inizierà a fare lo scraping basandosi sugli URL presenti nell'array di `app.js` e invierà le notifiche via Telegram.

Questi passaggi ti permetteranno di avviare e utilizzare l'applicazione per lo scraping delle informazioni sulle auto da Autoscout e ricevere aggiornamenti in tempo reale.
