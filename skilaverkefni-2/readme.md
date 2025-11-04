# Skilaverkefni 2: Tónlistargagnagrunnur

Verkefni í hönnun og fyrirspurnum í PostgreSQL gagnagrunni.

## Yfirlit

Byggðu upp heildstæðan tónlistargagnagrunn frá grunni og æfðu þig svo í flóknum SQL fyrirspurnum. Þetta verkefni reynir á hönnun skema, CRUD aðgerðir, tengsl og fyrirspurnir yfir margar töflur. Við erum búin að fara í öll helstu atriði nema tengitöflur og JOIN sem verður tekið fyrir í tímanum 28.október. Verkefninu er aðeins skipt upp með það í huga. Hluti 1 byrjar á efni sem er búið að fara yfir (Section 1-3) og svo eru Section 4-10 miðuð við að það þurfi þekkinguna úr tímanum 28.október til að klára flest af þeim.

Þetta verkefni er sett upp með mjög svipuðu sniði og workshop verkefnið sem við gerðum í tímanum á fimmtudaginn 23.október (það verkefni og lausnin við því er inni á github í lesson11 möppunni).

**Sett fyrir:** 25.október
**Skilafrestur:** 6.nóvember kl 18:00
**Gagnagrunnur:** `music_homework`

## Uppsetning

1.  Búðu til nýjan PostgreSQL gagnagrunn:
    ```sql
    CREATE DATABASE music_homework;
    ```
2.  Tengstu við `music_homework` gagnagrunninn í pgAdmin eða psql.

## Vinna með verkefnið

### Hluti 1: Byggðu skemað þitt

Opnaðu `homework-database.sql` og kláraðu hlutana í réttri röð:

- **Section 1:** Búðu til grunntöflur (albúm, flytjendur, lög, tónlistarstefnur)
- **Section 2:** Æfðu `ALTER TABLE` aðgerðir
- **Section 3:** Skrifaðu einfaldar fyrirspurnir á eina töflu

**Eftir tímann 28. október:**

- **Section 4:** Búðu til tengitöflur með "foreign keys"
- **Section 5:** Æfðu einfaldar `JOIN` aðgerðir

### Hluti 2: Hlaða inn gögnum og flóknar fyrirspurnir (Eftir tímann 28. október)

1.  Þegar þú hefur lokið við 1. hluta, keyrðu þá frumgögnin (seed data):
    ```
    Keyra: homework-seed-data.sql
    ```
    Þetta hleður inn 30 albúmum, 15 flytjendum, 50+ lögum og umsögnum.
2.  Haltu áfram í `homework-database.sql`:
    - **Section 6:** Staðfestu inn hlaðin gögn
    - **Section 7:** `JOIN` yfir margar töflur
    - **Section 8:** Samantektir (Aggregates) með `JOIN`
    - **Section 9:** Flóknar fyrirspurnir
    - **Section 10:** API sviðsmyndir

## Mikilvægar athugasemdir

- ⚠️ **EKKI keyra `homework-seed-data.sql` fyrr en 1. hluta er lokið**
- homework-seed-data.sql hreinsar öll fyrirliggjandi gögn - það er óhætt að endurkeyra hana ef þú gerir mistök
- Skrifaðu allar SQL fyrirspurnir þínar beint í `homework-database.sql` undir hverri æfingu
- Prófaðu fyrirspurnirnar þínar jafnóðum
- Vísbendingar eru af skornum skammti í seinni hlutunum - það er viljandi gert!

## Ábendingar

- Byrjaðu snemma - þetta er umfangsmikið verkefni
- Ljúktu við hlutana í réttri röð
- Prófaðu hverja fyrirspurn áður en þú ferð í þá næstu
- Ef þú skemmir gögnin þín
  - í 1. hluta þá geturðu hent gagnagrunninum og keyrt skipanirnar þínar allar aftur þangað sem þú varst komin(n)
  - í 2. hluta þá geturðu keyrt allar skipanirnar í `homework-seed-data.sql` hvenær sem er til að resetta grunninn
- Notaðu námsefnið og SQL svindlblaðið sem tilvísun

## Skil

Skilaðu fullgerðri `homework-database.sql` skrá með öllum fyrirspurnum útfylltum.

## Aðstoð

- Skoðaðu námsefni/lausnir úr tíma 11
- Kíktu á SQL svindlblaðið
- Notaðu PostgreSQL skjölunina
- Spurðu í tíma eða á Teams
