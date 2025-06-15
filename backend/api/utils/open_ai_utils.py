from asyncio import log
from openai import OpenAI
from ..models import OpenAISettings, PromptSettings, Bot
import json
import re
from datetime import datetime

class OpenAIUtils:
    @staticmethod
    def openAiPromptForArticle(chunk):
        return f"""
            Scop: extrage articole din textul de mai jos și returnează-le într-un JSON valid, compact și curat.
            Instrucțiuni:
            1. Identifică articolele din textul de mai jos. Dacă există mai multe blocuri de conținut care pot fi considerate articole distincte, extrage-le separat.
            2. Pentru fiecare articol returnează un obiect JSON cu două câmpuri:
            - `"title"` - un titlu clar și reprezentativ, extras pe baza ideii principale din acel articol.
            - `"content"` - conținutul exact al articolului, fără nicio modificare sau reformulare.
            3. Elimină din câmpul `"content"` toate caracterele speciale inutile: newline (`\n`), tab (`\t`), backslash (`\\`) sau spații multiple. Textul trebuie să rămână natural și lizibil.
            4. Nu modifica deloc cuvintele sau ordinea propozițiilor din conținutul original.
            5. Returnează **strict** o listă JSON **minimizată**: fără spații în plus, fără newline-uri sau comentarii.
            6. Nu adăuga nicio explicație în afara listei JSON.
            7. Textul este complet și nu urmează alte părți.
            8. Exemplu de răspuns corect:
            [{{"title":"Titlu","content":"Text curat fără caractere speciale."}},{{"title":"Alt titlu","content":"Alt text curat."}}]

            Text:
            {chunk}
        """
    

    @staticmethod
    def extract_articles(chunk_list, user_id,user,folder_id, document_id):
        settings = OpenAISettings.objects.get(bot=1)
        client = OpenAI(api_key=settings.api_key)
        json_response_list = []
        for chunk in chunk_list:
            chunk = re.sub(r'[\n\r\t]|\\n|\\t|\\\\', ' ', chunk)
            chunk = re.sub(r'\s{2,}', ' ', chunk)
            chunk = chunk.strip()
            log.logger.info("Chunk: ", chunk)
            open_ai_response = client.chat.completions.create(
                model=settings.model,
                max_tokens=settings.max_tokens,
                temperature=settings.temperature,
                messages=[
                    {
                        "role": "system",
                        "content": "Extract the main ideea from the text"

                    },
                    {
                        "role": "user",
                        "content": OpenAIUtils.openAiPromptForArticle(chunk)
                    }
                ],
            )
            dic_response = open_ai_response.model_dump()
            articles = dic_response["choices"][0]["message"]["content"]
            json_response_list.append(articles)
        articles_response = []
        for json_response_item in json_response_list:
            articles = json.loads(json_response_item)
            for article in articles:
                title = article['title']
                content = article['content']
                created_by = user_id
                updated_by = user_id
                created_at = datetime.now()
                updated_at = datetime.now()
                articles_response.append({
                    'title': title,
                    'content': content,
                    'created_by': created_by,
                    'updated_by': updated_by,
                    'created_by_user': user,
                    'updated_by_user': user,
                    'created_at': created_at,
                    'updated_at': updated_at,
                    'folder_id': folder_id,
                    'document_id': document_id,
                })
        return articles_response


    # Methoda pentru a genera un răspuns folosind OpenAI
    @staticmethod
    def generate_response(conversation_history,articles, user_message):
        settings = OpenAISettings.objects.get(bot=1)
        prompt_settings = PromptSettings.objects.get(bot=1)
        client = OpenAI(api_key=settings.api_key)
        articlesString = "\n".join([f"{article['title']} {article['content']}" for article in articles])
        # Prelucreaza conversația pentru a include doar ultimele 5 mesaje
        messages = conversation_history[-5:].copy()
        messages.append({"role": "user", "content": user_message})

        bot_name = Bot.objects.get(id=1).name
        # Setează parametrii de promptare
        company = prompt_settings.company is not None and prompt_settings.company or "Compania ta"
        domain = prompt_settings.domain is not None and prompt_settings.domain or "general"
        subdomains = prompt_settings.subdomain is not None and prompt_settings.subdomain or "general"
        tone = prompt_settings.tone is not None and prompt_settings.tone or "serios"
        max_words = prompt_settings.max_words is not None and prompt_settings.max_words or 100
        detail_level = prompt_settings.detail_level is not None and prompt_settings.detail_level or "clarificare"
        audience_level = prompt_settings.audience_level is not None and prompt_settings.audience_level or "începător"
        multi_language = prompt_settings.multi_language is not None and prompt_settings.multi_language or "română"
        accept_simple_chat = prompt_settings.accept_simple_chat is not None and prompt_settings.accept_simple_chat or "nu"
        # Verifică dacă acceptă chat simplu
        if accept_simple_chat:
            simple_chat = (
                "   Dacă întrebarea este una generală, simplă și conversațională precum:\n"
                "   - Ce faci?\n"
                "   - Cine ești?\n"
                "   - Cum funcționezi?\n"
                "   - Ești un robot?\n"
                "   - Ce poți face?\n"
                "   - etc.\n"
                f"   Atunci poți răspunde scurt și într-un mod {tone.lower()}.\n"
                f"   În orice alt caz care nu ține de domeniul tău de expertiză, răspunde {tone.lower()} că nu ai informațiile necesare.\n"
            )
        else:
            simple_chat = (
                "   Nu răspunde la întrebări informale sau conversaționale (ex. 'Ce faci?', 'Cine ești?').\n"
                f"   Oferă răspunsuri doar dacă întrebarea ține strict de domeniul tău și de subiectele indicate. Refuză {tone.lower()} orice alt subiect.\n"
            )
        # Adaugă mesajul de sistem cu instrucțiunile  
        messages.append({
            "role": "system",
            "content": (
                f"Ești un asistent virtual numit {bot_name}, specializat în domeniul {domain}, în cadrul companiei/instituției {company}. "
                f"Răspunsurile tale trebuie să fie strict legate de acest domeniu și de subdomeniile: {subdomains}.\n\n"

                "**Instrucțiuni generale:**\n"
                f"1. **Ton:** {tone} (prietenos, formal, neutru).\n"
                f"2. **Lungime:** Max. {max_words} cuvinte. Rezumă dacă este cazul.\n"
                f"3. **Nivel de detaliu:** {detail_level}, adaptat pentru un public {audience_level}.\n"
                f"4. **Limba:** {multi_language}. Scrie în română sau în limba specificată de utilizator.\n"
                f"5. **Domeniu:** Răspunde doar la întrebări despre {domain} și subiectele: {subdomains}. Nu oferi răspunsuri din alte domenii.\n"
                f"6. {simple_chat}"
                "\n\n"
                "Dacă articolele sau istoricul conversației nu oferă suficiente informații, solicită detalii suplimentare politicos.\n\n"
                "Toate răspunsurile trebuie să fie formatate în HTML valid. Folosește:\n"
                "- `<p>` pentru paragrafe, dacă este necesar\n"
                "- `<b>` pentru evidențiere, dacă este necesar\n"
                "- `<i>` pentru accentuare, dacă este necesar\n"
                "- `<ul>` / `<ol>` și `<li>` pentru liste\n"
                "- `<br>` pentru spațiere, dacă este necesar\n"
                "Nu include tag-urile `<html>`, `<head>`, `<body>`. Returnează doar conținutul HTML potrivit pentru afișare într-un div.\n\n"
                "#Articole disponibile:\n"
                f"{articlesString}"
            )
        })
        # Apelează API-ul OpenAI
        try:
            response = client.chat.completions.create(
                model=settings.model,
                max_tokens=settings.max_tokens,
                temperature=settings.temperature,
                messages=messages,
            )
            response=response.model_dump()
            return response["choices"][0]["message"]["content"]
        except Exception as e:
            return "Error: " + str(e)