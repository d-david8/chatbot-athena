Cerințe generale

1. Python 3.8+
2. PostgreSQL 12+
3. Node.js + npm (pentru frontend)

Pași de instalare:

1. Instalare editor de cod (opțional)

   - Se recomandă instalarea Visual Studio Code:https://code.visualstudio.com/

2. Instalare dependințe
   Windows
   2.1. Instalare Python (3.8+): - Se descarcă de la: https://www.python.org/downloads/windows/ - Se bifează opțiunea „Add Python to PATH” în timpul instalării.
   2.2. Instalare PostgreSQL: - Se descarcă de la: https://www.postgresql.org/download/windows/ - Se reține userul și parola setată la instalare.
   2.3. Instalare Node.js (versiunea LTS): - Se descarcă de la: https://nodejs.org/en/download

   Linux (Ubuntu/Debian) folosind terminalul:
   2.1. Instalare Python și pip: - sudo apt update - sudo apt install python3 python3-venv python3-pip -y
   2.2. Instalare PostgreSQL: - sudo apt install postgresql postgresql-contrib -y
   2.3. Instalare Node.js: - sudo apt install nodejs npm -y

   macOS
   2.1. Instalare Homebrew (dacă nu este instalat): - /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
        Pentru procesoare Intel:
            - echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zprofile - eval "$(/usr/local/bin/brew shellenv)"
        Pentru procesoare Apple Silicon:
            - echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile - eval "$(/opt/homebrew/bin/brew shellenv)"
   2.2. Instalare Python: - brew install python
   2.3. Instalare PostgreSQL: - brew install postgresql - brew services start postgresql
   2.4. Instalare Node.js: - brew install node

3. Clonare proiectului

   - git clone https://github.com/d-david8/chatbot-athena.git

4. Crearea și activarea mediului virtual (backend)

   - am cd chatbot-athena/backend
   - source venv/bin/activate(MacOs/Linux) / venv\Scripts\activate(Windows)

5. Instalarea dependintelor

   - pip install -r requirements.txt

6. Creare bază de date PostgreSQL

   - psql
   - CREATE DATABASE "ATHENA";
   - CREATE USER athena WITH PASSWORD 'athena2024';
   - GRANT ALL PRIVILEGES ON DATABASE "ATHENA" TO athena;
   - \q
   - se verifica sa fie acelasi port din fisierul backedn/backedn/settings.py linia 107 cu portul serverul de PostgreSQL (psql + SHOW port;)

7. Aplicarea migrărilor în Django(/backedn)

   - python manage.py makemigrations
   - python manage.py migrate

8. Pornirea aplicatiei de backend

   - python manage.py runserver

9. Instalare și rulare frontend

   - cd ../frontend
   - npm install
   - npm run dev

10. Importul setarilor initiale

    - pg_restore -U athena -d ATHENA -p 5433 -c ~/calea/la/fisier/athena_settings.dump din directorul chatbot-athena

11. Pentru conectare se va utiliza userul admin si parola admin

11. Se deschide platforma accesând link-ul: http://localhost:5173/login

12. Pentru conectare se va utiliza userul admin si parola admin
