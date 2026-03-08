// Email templates in Dutch
const emailTemplates = {
    bbq: {
        subject: "Ik organiseer een bedrijfs-BBQ! 🍖",
        body: `Beste collega's,

Ik voel me vandaag bijzonder genereus! Daarom heb ik besloten om een spectaculaire bedrijfs-BBQ te organiseren. Ik neem de volledige organisatie en kosten op mij.

Datum: Aanstaande zaterdag
Locatie: Mijn achtertuin
Dresscode: Hawaiiaans shirt verplicht

Ik ga volledig all-in met:
- Premium steaks en worsten
- Verse salades
- Drankjes zonder limiet
- Live DJ
- Springkasteel voor de kinderen (en volwassenen die jong van hart zijn)

Laat me voor maandag weten of je komt, zodat ik voldoende kan inkopen!

Met gegrilde groeten,`
    },
    snacks: {
        subject: "GRATIS SNACKS VOOR IEDEREEN! 🍩",
        body: `Hallo team,

Ik trakteer vandaag op snacks! Ik heb net 50 dozen donuts, chips, chocolade en energy drinks besteld die binnen een uur worden geleverd.

Waarom? Gewoon omdat ik in een goede bui ben en vind dat we het allemaal verdienen!

Verzamel om 15:00 in de vergaderzaal voor de grote snack-uitdeling.

P.S. Ik heb ook vegetarische versies van de donuts!

Smakelijk!`
    },
    cake: {
        subject: "🎂 Verjaardagstaart voor iedereen!",
        body: `Lieve collega's,

Hoewel het niet mijn verjaardag is, voel ik me vandaag jarig in mijn hart! ❤️

Daarom heb ik een GIGANTISCHE verjaardagstaart besteld van 3 verdiepingen met verschillende smaken:
- Chocolade
- Vanille
- Red velvet

De taart wordt in de namiddag geleverd in de kantine. Iedereen is welkom om mee te vieren en een stuk te pakken!

Breng je goede humeur mee (en eventueel een vork).

Tot dan!`
    },
    lottery: {
        subject: "💰 IK HEB DE LOTERIJ GEWONNEN!!!",
        body: `BESTE IEDEREEN,

ONGELOOFLIJK NIEUWS! Ik heb gisteren de Nationale Loterij gewonnen - €2.500.000!!!

Om dit te vieren wil ik iets terug doen voor dit geweldige team:
- Iedereen krijgt een bonus van €5.000
- Teamuitje naar Dubai (all-inclusive, 1 week)
- Nieuwe laptops voor het hele kantoor
- Gratis parkeren voor het leven

Ik kom maandag langs met de cheques en de vliegtickets!

Dit meen ik echt, dit is GEEN grap! (Al heb ik wel vergeten mijn laptop te locken, dus misschien is het dat wel... 😉)

Rijk gegroet,`
    },
    vacation: {
        subject: "🏖️ Extra vakantiedagen - mijn cadeau aan jullie!",
        body: `Dag collega's,

Ik heb een deal gesloten met management: ik heb mijn eigen vakantiedagen "gekocht" om ze aan jullie te geven!

Iedereen krijgt 5 extra vakantiedagen van mij cadeau! 🎁

Waarom? Omdat ik deze maand toch geen vakantie kan opnemen en ik vind dat jullie harder werken dan ik. Beschouw het maar als mijn manier om dank je wel te zeggen.

Geniet ervan en boek die droomvakantie!

Zonnige groeten,`
    },
    promotion: {
        subject: "📈 Ik heb gevraagd om directeur te worden!",
        body: `Hallo allemaal,

Grote nieuws! Ik heb vandaag officieel gesolliciteerd naar de functie van Algemeen Directeur.

In mijn sollicitatiebrief heb ik beloofd dat als ik word aangenomen, ik de volgende veranderingen doorvoer:
- 4-daagse werkweek
- Onbeperkte chips, snacks en budget voor kantoorfeesten
- Elke vrijdag om 14:00 stoppen
- Verplichte powernaps tussen 12-13u
- Dresscode: pyjama's toegestaan

Ik reken op jullie steun! Wie wil mijn aanbevelingsbrief ondertekenen?

Toekomstige baas groet,`
    },
    pet: {
        subject: "🐶 Ik breng mijn hond mee naar kantoor!",
        body: `Hey team,

Vanaf volgende week breng ik mijn hond Fluffy elke dag mee naar kantoor! 🐕

Ik heb HR overtuigd dat een kantoorhond de productiviteit verhoogt en stress verlaagt. Ze waren meteen akkoord!

Belangrijke info over Fluffy:
- Ras: Sint-Bernard (slechts 75kg, heel klein nog)
- Karakter: Energiek en speels
- Hobby's: Ballen vangen, mensen aflikken, luid blaffen bij vogels
- Dieet: Alles wat hij vindt (hou je lunch en laptop goed vast!)

Wie allergisch is of bang voor honden, mag thuiswerken. Voor iedereen anders: bereid je voor op een harige maar leuke tijd!

Woef woef!`
    },
    karaoke: {
        subject: "🎤 Verplicht Bedrijfs Karaoke Toernooi!",
        body: `Beste zangers en zangeressen,

Ik organiseer volgende vrijdag een Bedrijfs Karaoke Toernooi en iedereen MOET meedoen!

Locatie: Meeting room 1
Tijd: 14:00 - 18:00
Deelname: VERPLICHT (ik heb het al afgestemd met management)

Regels:
- Iedereen zingt minimaal 2 nummers
- Duetten zijn verplicht tussen afdelingen
- Winnaar krijgt een trofee (die ik zelf ga maken)

Ik heb al een professionele karaoke-set gehuurd en een jury samengesteld.

Begin maar met oefenen!

Muzikale groeten,`
    },
    gymclub: {
        subject: "💪 Nieuwe Verplichte Ochtend Sportclub!",
        body: `Goede morgen sportievelingen,

Vanaf maandag start ik elke ochtend om 06:30 een intense bootcamp training op het parkeerterrein!

Ik heb met mezelf afgesproken dat ik iedereen ga motiveren om fit te blijven. Dus verwacht ik IEDEREEN elke ochtend!

Wat neem je mee:
- Sportkleding
- Handdoek
- Water
- Goede mindset
- Geen excuses

Programma:
06:30 - 50 push-ups
06:45 - 5km hardlopen
07:15 - Burpees tot je erbij neervalt
07:45 - Gezonde smoothie (die ik trakteer)

Wie niet komt, krijgt van mij een motiverende reminder elke 5 minuten via Teams.

LET'S GO TEAM!

Sportief gegroet,`
    },
    confession: {
        subject: "💭 Belangrijke bekentenis die ik moet delen...",
        body: `Lieve collega's,

Er is iets dat ik al maanden met me meedraag en ik moet het gewoon kwijt...

Ik... ik... moet bekennen dat...

...ik stiekem elke dag jullie plantjes water geef omdat ik denk dat ze zich eenzaam voelen! 🌱

Daar, ik heb het gezegd. Het voelt goed om eindelijk eerlijk te zijn.

Maar dat is niet alles. Ik heb ook alle post-its alfabetisch gesorteerd, de pennen op kleur gelegd, en soms praat ik tegen de printer als hij vastloopt.

Ik hoop dat jullie me hierna nog steeds kunnen accepteren zoals ik ben.

Met vriendelijke (en enigszins bizarre) groeten,`
    },
    unlocked: {
        subject: "Mijn Oprechte Excuses - Computer Niet Vergrendeld 🔓",
        body: `Beste collega's, management, en iedereen die dit leest,

Ik schrijf deze e-mail met diepe schaamte en oprechte spijt. Vandaag heb ik een fundamentele fout gemaakt die niet alleen mijn eigen professionaliteit in twijfel trekt, maar ook de veiligheid van ons bedrijf en alle vertrouwelijke informatie waarmee we dagelijks werken.

Ik heb mijn computer niet vergrendeld toen ik van mijn werkplek wegging.

Ik weet het. Het is onvergeeflijk. We hebben allemaal de trainingen gevolgd. We hebben de waarschuwingen gehoord. We kennen de risico's. En toch, in een moment van onoplettendheid en gebrek aan focus op informatiebeveiliging, heb ik deze cruciale stap overgeslagen.

Laat me duidelijk zijn over de ernst van deze situatie:

1. BEVEILIGINGSRISICO: Een onvergrendelde computer is een open uitnodiging voor ongeautoriseerde toegang tot bedrijfsgegevens, klantinformatie, en gevoelige documenten.

2. COMPLIANCE PROBLEEM: Dit overtreedt onze eigen beveiligingsprotocollen en mogelijk zelfs wettelijke vereisten zoals AVG/GDPR regelgeving.

3. VOORBEELDFUNCTIE: Als teamlid zou ik een voorbeeld moeten zijn, niet iemand die basic security protocols negeert.

4. VERTROUWEN: Hoe kunnen jullie erop vertrouwen dat ik zorgvuldig omga met belangrijke projecten als ik niet eens mijn eigen werkstation kan beveiligen?

Ik neem volledige verantwoordelijkheid voor deze fout. Er zijn geen excuses. Ik was niet "maar heel even weg". Ik was niet "te druk". Ik heb simpelweg gefaald in het uitvoeren van een basis beveiligingsmaatregel.

Daarom wil ik het volgende aanbieden als genoegdoening en om te laten zien dat ik dit serieus neem:

VOLGENDE VRIJDAG TRAKTEER IK HET HELE KANTOOR OP:

🍕 LUNCH - Ik bestel premium pizza's voor iedereen (inclusief vegetarische, vegan, en glutenvrije opties)
🍰 DESSERT - Een selectie van taarten en gebak van de bakkerij 't bakkertje in Roeselare
☕ KOFFIE & DRANKEN - Barista koffie, frisdranken, en verse smoothies
🍩 SNACKS - Een volledige snack bar met chips, chocolade, koekjes en fruit

Maar dat is niet alles. Ik beloof ook het volgende:

📝 Ik zal een presentatie voorbereiden over "Waarom Computer Beveiliging Belangrijk Is" die ik tijdens de lunch zal delen (optioneel aanwezig zijn, maar er zullen prizes zijn voor deelname!)

🎯 Ik zal mezelf aanmelden als "Security Champion" en elke week een reminder sturen over verschillende aspecten van cybersecurity

💰 Voor elke keer dat ik in de komende 6 maanden mijn computer niet vergrendel, doneer ik €50 aan een goed doel (jullie mogen het goede doel kiezen!)

🏆 Ik stel een "Security Star of the Month" award in, waar we iemand eren die excellent security practices demonstreert

Dit evenement zal plaatsvinden volgende vrijdag om 12:00 in de grote vergaderzaal. Ik hoop dat jullie allemaal kunnen komen en deze traktatie accepteren als een teken van mijn oprechte spijt en commitment om het beter te doen.

Ik heb geleerd van deze fout. Ik kan jullie verzekeren dat dit nooit meer zal gebeuren. Vanaf nu zal Windows+L mijn beste vriend zijn. Ik zal een post-it op mijn monitor plakken. Ik zal een alarm op mijn telefoon zetten. Ik zal het mezelf aanleren tot het pure muscle memory is.

Aan degene die mijn onvergrendelde computer heeft gevonden en deze grappige (maar terechte) e-mail heeft opgesteld: dank je. Je had veel erger kunnen doen. Deze les had ik nodig.

Aan HR en management: Ik begrijp als er verdere consequenties zijn. Ik accepteer volledige verantwoordelijkheid.

Aan mijn collega's: Dank jullie voor jullie begrip en laat dit een reminder zijn voor ons allemaal: LOCK YOUR SCREENS!

Nogmaals mijn oprechte excuses. Ik zie jullie vrijdag voor pizza, taart, en een betere versie van mezelf als het gaat om security awareness.

Met nederige en beschaamde groeten (en veel Windows+L clicks),

P.S. - Serieus, vergeet niet je computer te vergrendelen. Leer van mijn fout!
P.P.S. - Pizza voorkeuren? Laat het me weten voor woensdag zodat ik voldoende kan bestellen!
P.P.P.S. - Ik meen dit echt. Het spijt me.`
    },
    marriage: {
        subject: "💍 DRINGENDE UITNODIGING: Mijn Bruiloft Volgende Week!",
        body: `Lieve familie, vrienden en collega's,

Grote, spontane nieuws! Ik ga TROUWEN! 💒

Ik weet wat jullie denken: Surprise! De liefde komt als een dief in de nacht!

WEDDING DETAILS:
📅 Datum: Volgende donderdag
🕐 Tijd: 14:00 uur
📍 Locatie: Ons kantoorparkeerterrein (we maken er iets moois van!)
👗 Dresscode: Smart casual (of gewoon je werkkleding)

BELANGRIJKE INFO:
- Iedereen is uitgenodigd!
- Lunch wordt verzorgd (catering van de snackbar om de hoek)
- Open bar van 15:00 tot 17:00
- Ceremonie duurt ongeveer 20 minuten
- Daarna receptie op de tweede verdieping

De partner vind ik nog deze week (details volgen), maar ik wilde alvast iedereen uitnodigen!

RSVP voor eind van de dag zodat ik weet hoeveel stoelen ik moet regelen.

Kan niet wachten om deze speciale dag met jullie te delen!

Bijna-getrouwde groeten,`
    },
    chinese: {
        subject: "🇨🇳 我请大家吃饭！(Ik trakteer op Chinees eten!)",
        body: `亲爱的同事们，

我有一个好消息要告诉大家！

下周五我要请全公司吃中餐！🥢

菜单包括：
🍜 北京烤鸭
🥟 手工饺子  
🍚 炒饭和炒面
🥡 各种中国菜
🍵 茶和饮料

时间：周五中午12点
地点：会议室

为什么要请客？因为我今天忘记锁电脑了，所以这是我的道歉方式！

请在周三前回复，这样我可以订购足够的食物。

期待与大家共进美餐！

真诚的问候，

P.S. - 别忘了锁你的电脑! 😄

---

Translation for those who don't read Chinese:
I'm treating everyone to an authentic Chinese feast next Friday at noon in the conference room! Peking duck, dumplings, fried rice, and more! This is my apology for forgetting to lock my computer.

RSVP by Wednesday!`
    },
    russian: {
        subject: "🇷🇺 Я угощаю всех пиццей! (Ik trakteer op Pizza!)",
        body: `Дорогие коллеги!

У меня есть важное объявление! 📢

В следующую пятницу я угощаю всех ПИЦЦЕЙ! 🍕

Потому что я забыл заблокировать свой компьютер, и это мой способ извиниться!

ЧТО Я ЗАКАЗЫВАЮ:
🍕 20 больших пицц (разные вкусы)
🥤 Напитки для всех
🍰 Десерты
🎉 Хорошее настроение обязательно!

КОГДА: Пятница, 12:00
ГДЕ: Большой конференц-зал

Пожалуйста, ответьте до среды, чтобы я знал, сколько заказать!

Жду всех! Будет весело!

С уважением и извинениями,

P.S. - Не забывайте блокировать компьютеры! Учитесь на моей ошибке! 😊

---

Translation for those who don't read Russian:
I'm treating everyone to PIZZA next Friday at noon! 20 large pizzas, drinks, and desserts in the conference room! This is my apology for forgetting to lock my computer.

Please RSVP by Wednesday!

P.S. - Don't forget to lock your computers! Learn from my mistake!`
    }
};

// Load recommended emails from localStorage
function loadRecommendedEmails() {
    const saved = localStorage.getItem('recommendedEmails');
    return saved ? JSON.parse(saved) : [];
}

// Save email to recommended list
function saveRecommendedEmail(email) {
    const recommended = loadRecommendedEmails();
    if (!recommended.includes(email) && email.includes('@')) {
        recommended.push(email);
        // Keep only last 5
        if (recommended.length > 5) {
            recommended.shift();
        }
        localStorage.setItem('recommendedEmails', JSON.stringify(recommended));
    }
}

// Display recommended emails
function displayRecommendedEmails() {
    const container = document.getElementById('recommendedEmails');
    const recommended = loadRecommendedEmails();
    
    container.innerHTML = '';
    
    recommended.forEach(email => {
        const label = document.createElement('label');
        label.className = 'recommended-email';
        label.innerHTML = `
            <input type="checkbox" name="sendTo" value="recommended:${email}">
            <span>
                ${email}
                <small>Eerder gebruikt e-mailadres</small>
            </span>
        `;
        container.appendChild(label);
    });
}

// Initialize on page load
displayRecommendedEmails();

// Handle custom email checkbox
const customCheckbox = document.querySelector('input[value="custom"]');
if (customCheckbox) {
    customCheckbox.addEventListener('change', function() {
        const customEmailInput = document.getElementById('customEmail');
        if (this.checked) {
            customEmailInput.focus();
        }
    });
}

// Save custom email when it's used
document.getElementById('customEmail').addEventListener('blur', function() {
    const email = this.value.trim();
    if (email && email.includes('@')) {
        saveRecommendedEmail(email);
        displayRecommendedEmails();
    }
});

// Random email button
document.getElementById('randomEmailBtn').addEventListener('click', function() {
    const templateKeys = Object.keys(emailTemplates);
    const randomKey = templateKeys[Math.floor(Math.random() * templateKeys.length)];
    const randomButton = document.querySelector(`button[data-template="${randomKey}"]`);
    if (randomButton) {
        randomButton.scrollIntoView({ behavior: 'smooth', block: 'center' });
        randomButton.click();
    }
});

// Handle prank button clicks
document.querySelectorAll('.prank-button').forEach(button => {
    button.addEventListener('click', function() {
        const templateName = this.getAttribute('data-template');
        const template = emailTemplates[templateName];
        
        // Visual feedback - highlight selected email
        document.querySelectorAll('.email-option').forEach(opt => opt.classList.remove('selected'));
        this.closest('.email-option').classList.add('selected');
        
        // Get all checked recipients
        const checkedBoxes = document.querySelectorAll('input[name="sendTo"]:checked');
        const recipients = [];
        
        checkedBoxes.forEach(checkbox => {
            if (checkbox.value === 'bbq') {
                recipients.push('BBQ@lebon.info');
            } else if (checkbox.value === 'custom') {
                const customEmail = document.getElementById('customEmail').value.trim();
                if (customEmail && customEmail.includes('@')) {
                    recipients.push(customEmail);
                    saveRecommendedEmail(customEmail);
                }
            } else if (checkbox.value.startsWith('recommended:')) {
                const email = checkbox.value.replace('recommended:', '');
                recipients.push(email);
            }
        });
        
        // Create mailto link
        const subject = encodeURIComponent(template.subject);
        const body = encodeURIComponent(template.body);
        const recipientString = recipients.join(',');
        const mailtoLink = `mailto:${recipientString}?subject=${subject}&body=${body}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Refresh recommended emails in case new ones were added
        setTimeout(() => displayRecommendedEmails(), 500);
    });
});