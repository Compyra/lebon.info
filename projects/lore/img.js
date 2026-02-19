// Helper function to generate image entries
function generateImages(folder, count, category, titlePrefix, keywordBase) {
    const images = [];
    for (let i = 1; i <= count; i++) {
        images.push({
            src: `./img/${folder}/${folder} (${i}).jpg`,
            title: `${titlePrefix} ${i}`,
            keywords: `${keywordBase} ${i}`,
            category: category
        });
    }
    return images;
}

const images = [
    ...generateImages('lore', 165, 'lore', 'Magical Lore', 'ancient mystical magic spell enchantment wizard witch sorcery artifact relic prophecy'),
    ...generateImages('muggle', 59, 'muggle', 'Muggle Humor', 'funny hilarious comedy laugh joke smile amusing entertaining'),
    ...generateImages('cute', 20, 'magic', 'Magical Cuteness', 'cute adorable sweet lovely precious wholesome heartwarming cheerful')
];
