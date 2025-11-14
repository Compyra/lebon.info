document.getElementById('snackButton').addEventListener('click', function() {
    let clickCount = localStorage.getItem('snackButtonClickCount') || 0;
    clickCount++;
    localStorage.setItem('snackButtonClickCount', clickCount);

    let subject;
    let body;

    if (clickCount === 1) {
        subject = "Ik trakteer!";
        body = "Hallo allemaal,\n\nIk trakteer! Binnenkort breng ik lekkere snacks mee naar kantoor om de sfeer (en de bloedsuikerspiegel) op peil te houden.\n\nSmakelijke groeten!";
    } else {
        subject = "Ik organiseer een BBQ!";
        body = "Hallo allemaal,\n\nIk voel me gul! Daarom heb ik besloten om een bedrijfs-BBQ te organiseren. Ik neem de volledige verantwoordelijkheid op mij.\n\nBereid jullie voor op een feestmaal! Details over de datum en locatie volgen snel.\n\nMet vriendelijke groeten,";
    }

    const mailtoLink = `mailto:allen@lebon.info?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
});