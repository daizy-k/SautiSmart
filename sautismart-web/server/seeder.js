const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const SetPiece = require('./models/SetPiece');
const TheoryModule = require('./models/TheoryModule');
const ArchiveItem = require('./models/ArchiveItem');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/sautismart';

// --- DATASETS ---

const setPiecesData = [
  {
    title: 'Kenya National Anthem (Arranged for Descant Recorder)',
    composer: 'Traditional / Arr. SautiSmart',
    gradeLevel: 'Grade 4',
    category: 'Instrumental',
    description: 'Syllabus recorder practice arrangement for the Kenyan National Anthem (Ee Mungu Nguvu Yetu).',
    fullMixAudioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    stems: [
      {
        name: 'Descant Recorder Lead',
        instrument: 'Descant Recorder',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      },
    ],
  },
  {
    title: 'Twende Pamoja Melody Practice',
    composer: 'Traditional / Arr. SautiSmart',
    gradeLevel: 'Grade 5',
    category: 'Instrumental',
    description: 'Progressive recorder exercise focusing on rhythmic agility and breath control.',
    fullMixAudioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    stems: [
      {
        name: 'Descant Recorder Lead',
        instrument: 'Descant Recorder',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
      },
    ],
  },
];

const theoryModulesData = [
  {
    title: 'Basics of Note Values, Shapes & Rests',
    gradeLevel: 'Grade 4',
    strand: 'Theory of Music',
    topic: 'Note Values and Rests',
    content:
      'Covers standard musical notes, beat counts, and corresponding rests: Semibreve (Whole Note, 4 beats), Minim (Half Note, 2 beats), Crotchet (Quarter Note, 1 beat), Quaver (Eighth Note, 1/2 beat), and Semiquaver (Sixteenth Note, 1/4 beat).',
    order: 1,
  },
  {
    title: 'The Musical Staff, Clefs & Pitch Names',
    gradeLevel: 'Grade 5',
    strand: 'Theory of Music',
    topic: 'Staff and Clefs',
    content:
      "A 5-line, 4-space stave. Treble Clef (G Clef) lines: E-G-B-D-F ('Every Good Boy Does Fine') and spaces: F-A-C-E. Bass Clef (F Clef) lines: G-B-D-F-A ('Good Boys Do Fine Always') and spaces: A-C-E-G ('All Cows Eat Grass').",
    order: 2,
  },
  {
    title: 'Common Musical Terms & Dynamic Markings',
    gradeLevel: 'Grade 6',
    strand: 'Theory of Music',
    topic: 'Dynamics and Tempo',
    content:
      'Dynamics: Piano (p - soft), Forte (f - loud), Mezzo-piano (mp), Mezzo-forte (mf), Fortissimo (ff), Pianissimo (pp), Crescendo (gradually louder), Decrescendo (gradually softer). Tempo: Adagio (slow), Andante (walking pace), Moderato (moderate), Allegro (fast), Presto (very fast).',
    order: 3,
  },
  {
    title: 'Time Signatures, Measures & Simple Meter',
    gradeLevel: 'Grade 7',
    strand: 'Theory of Music',
    topic: 'Time Signatures',
    content:
      'Understanding top and bottom numbers in time signatures: 2/4 (two crotchet beats per bar), 3/4 (three crotchet beats per bar - waltz), 4/4 (Common Time - four crotchet beats per bar).',
    order: 4,
  },
  {
    title: 'Intervals, Major Scales & Key Signatures',
    gradeLevel: 'Grade 8',
    strand: 'Theory of Music',
    topic: 'Scales and Key Signatures',
    content:
      'Construction of the Major Scale formula (Tone-Tone-Semitone-Tone-Tone-Tone-Semitone). C Major (no sharps/flats), G Major (1 sharp: F#), F Major (1 flat: Bb), and D Major (2 sharps: F#, C#).',
    order: 5,
  },
  {
    title: 'Compound Meter & Triads Construction',
    gradeLevel: 'Grade 9',
    strand: 'Theory of Music',
    topic: 'Triads and Compound Meter',
    content:
      'Advanced meter concepts: 6/8 compound duple time (two dotted-crotchet beats). Building tonic, subdominant, and dominant triads (Chords I, IV, V) in root position.',
    order: 6,
  },
];

const archiveItemsData = [
  // --- CULTURAL SONGS WITH YOUTUBE LINKS ---
  {
    title: 'Mukangala Traditional Wedding Song',
    itemType: 'Folk Song',
    tribeOfOrigin: 'Luhya',
    culturalOccasion: 'Weddings and Celebrations',
    description: 'Traditional Luhya wedding celebration song performed during nuptial rituals.',
    culturalSignificance: 'Symbolizes unity and communal blessing for newlyweds.',
    audioUrl: 'https://www.youtube.com/watch?v=kYv9bH8eYfU',
  },
  {
    title: 'Mwana wa Mberi Bridal Dance',
    itemType: 'Folk Song',
    tribeOfOrigin: 'Luhya',
    culturalOccasion: 'Weddings and Dowry Ceremonies',
    description: 'Joyous bridal entry song accompanied by rhythmic clapping and ululations.',
    culturalSignificance: 'Welcomes the firstborn bride into her new household.',
    audioUrl: 'https://www.youtube.com/watch?v=0hY7bN9jQ6c',
  },
  {
    title: 'Sioyaye (Bukusu Circumcision Anthem)',
    itemType: 'Folk Song',
    tribeOfOrigin: 'Luhya (Bukusu)',
    culturalOccasion: 'Circumcision and Initiation Rites',
    description: 'Powerful initiation song performed by candidates and warriors during the Khuminyisa ceremony.',
    culturalSignificance: 'Instills courage, endurance, and cultural pride during the rite of passage.',
    audioUrl: 'https://www.youtube.com/watch?v=rUjU5jZk5rA',
  },
  {
    title: 'Kutembeya Chinyimba Initiation Dance',
    itemType: 'Folk Song',
    tribeOfOrigin: 'Luhya',
    culturalOccasion: 'Circumcision and Rites of Passage',
    description: 'Rhythmic processional dance featuring ankle bells (Chinyimba) leading initiates to the river.',
    culturalSignificance: 'Announces the readiness of young men for adult responsibilities.',
    audioUrl: 'https://www.youtube.com/watch?v=Vp_gZ8YQfWs',
  },
  {
    title: 'Nyathi Onyi Luo Lullaby & Birth Celebration',
    itemType: 'Folk Song',
    tribeOfOrigin: 'Luo',
    culturalOccasion: 'Birth and Child Naming',
    description: 'Gentle Luo lullaby and welcoming chant sung by grandmothers and mothers.',
    culturalSignificance: 'Bestows ancestral names and protection upon the newborn baby.',
    audioUrl: 'https://www.youtube.com/watch?v=8qW1qQY_V1c',
  },
  {
    title: 'Dodo Birth Chant and Clan Welcome',
    itemType: 'Folk Song',
    tribeOfOrigin: 'Luo',
    culturalOccasion: 'Birth and Naming Ceremonies',
    description: 'Traditional Dodo style chant celebrating the safe arrival of a newborn into the clan.',
    culturalSignificance: 'Exalts maternal strength and reinforces clan lineage ties.',
    audioUrl: 'https://www.youtube.com/watch?v=zJg9vL2jR9Y',
  },
  {
    title: 'Ngurario Customary Marriage Ceremony Song',
    itemType: 'Folk Song',
    tribeOfOrigin: 'Kikuyu',
    culturalOccasion: 'Weddings (Ngurario)',
    description: 'Final traditional marriage rite song accompanied by the cutting of the shoulder meat (Kiande).',
    culturalSignificance: 'Seals the marriage covenant permanently under Kikuyu customary law.',
    audioUrl: 'https://www.youtube.com/watch?v=yW6bYk9jP8c',
  },
  {
    title: 'Ruracio Processional Folk Song',
    itemType: 'Folk Song',
    tribeOfOrigin: 'Kikuyu',
    culturalOccasion: 'Weddings and Dowry (Ruracio)',
    description: 'Negotiation and welcoming folk song sung when the groom’s family visits the bride’s home.',
    culturalSignificance: 'Fosters friendship, negotiation, and kinship between families.',
    audioUrl: 'https://www.youtube.com/watch?v=gT8vH7yB2eM',
  },

  // --- 1. CHORDOPHONES (STRINGED INSTRUMENTS) ---
  // Bowed Fiddles
  {
    title: 'Wandindi',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Gikuyu',
    culturalOccasion: 'Social Gatherings & Storytelling',
    description: 'Two-stringed bowed fiddle with a resonator made of skin and a horn or wooden shell.',
    culturalSignificance: 'Provides melodic accompaniment for traditional Kikuyu narrative songs.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Shiriri',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Luhya',
    culturalOccasion: 'Beer Parties & Festive Dances',
    description: 'Single-stringed bowed fiddle played with a small bow smeared with tree resin.',
    culturalSignificance: 'Drives high-tempo dance rhythms during community celebrations.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Orutu',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Luo',
    culturalOccasion: 'Ohangla Dances & Storytelling',
    description: 'Single-stringed bowed fiddle with a cylindrical wooden body covered with lizard or python skin.',
    culturalSignificance: 'Central solo instrument in traditional Luo Ohangla and Nyatiti ensemble music.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: "Ong'eng'ö",
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Gusii',
    culturalOccasion: 'Cultural Ceremonies',
    description: 'Bowed single-stringed fiddle used by the Abagusii people.',
    culturalSignificance: 'Accompanies traditional epic recitations and moral praise songs.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Mbeve',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Kamba',
    culturalOccasion: 'Community Festivities',
    description: 'Traditional Kamba bowed stringed instrument with animal skin drum base.',
    culturalSignificance: 'Used in folk entertainment and story recitations.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Mwazigizi',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Taita',
    culturalOccasion: 'Traditional Healing & Festivities',
    description: 'Single-stringed bowed fiddle of the Taita people.',
    culturalSignificance: 'Used in sacred rituals and festive village performances.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  // Harps
  {
    title: 'Adeudeu',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Iteso',
    culturalOccasion: 'Worship & Cultural Gatherings',
    description: 'Arched 5-stringed plucked harp equipped with tuning pegs and a skin-covered wooden resonator.',
    culturalSignificance: 'Sacred instrument of the Iteso people for spiritual and social melodies.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  // Lyres
  {
    title: 'Nyatiti',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Luo',
    culturalOccasion: 'Funeral Dirges (Tero Buru) & Festivities',
    description: 'Eight-stringed plucked bowl lyre played while wearing ankle rattles (Gara) and toe rings (Asili).',
    culturalSignificance: 'Revered symbol of Luo heritage, philosophy, and classical musicianship.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Litungu',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Luhya (Bukusu)',
    culturalOccasion: 'Harvest & Circumcision Dances',
    description: 'Seven-stringed plucked bowl lyre constructed from carved wood and cattle hide.',
    culturalSignificance: 'Accompanies energetic Bukusu festive dances and historical epics.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Obokano',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Gusii',
    culturalOccasion: 'Worship & Chief Assemblies',
    description: 'Massive eight-stringed bass bowl lyre producing deep resonant bass notes.',
    culturalSignificance: 'Known as the "king of lyres" among the Abagusii.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Bukandit',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Sabaot',
    culturalOccasion: 'Initiation Rites',
    description: 'Six-stringed plucked bowl lyre of Mount Elgon Sabaot community.',
    culturalSignificance: 'Played during rites of passage and warrior celebrations.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Iritungu',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Kuria',
    culturalOccasion: 'Cultural Festivities',
    description: 'Eight-stringed bowl lyre of the Kuria people.',
    culturalSignificance: 'Pitches traditional Kuria dance tunes and warrior praise songs.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Chepkongo',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Kipsigis',
    culturalOccasion: 'Social Dances',
    description: 'Six-stringed plucked lyre of the Kipsigis sub-tribe.',
    culturalSignificance: 'Used in courtship dances and social gatherings.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Pukan',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Pokot',
    culturalOccasion: 'Pastoralist Celebrations',
    description: 'Five-stringed bowl lyre of the Pokot pastoralist community.',
    culturalSignificance: 'Expresses cattle praise, heroic deeds, and landscape devotion.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  // Ground Bows
  {
    title: 'Mbaito',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Gusii',
    culturalOccasion: 'Children Rites & Earth Rituals',
    description: 'Ground bow constructed over a pit in the earth covered with a tin or skin membrane.',
    culturalSignificance: 'Ancient earth-connected acoustic bass instrument.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Nderemo',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Gikuyu',
    culturalOccasion: 'Herding & Evening Storytelling',
    description: 'Ground musical bow utilizing a subterranean pit as an acoustic resonator chamber.',
    culturalSignificance: 'Traditional acoustic bass bow played by youth.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Indevendeve',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Luhya (Maragoli)',
    culturalOccasion: 'Folk Tales & Recreation',
    description: 'Ground bow with flexible wooden pole and taut fiber string embedded in an earth resonator.',
    culturalSignificance: 'Rhythmic earth-bass accompaniment for Maragoli folktales.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  // Gourd / Resonator Bows
  {
    title: 'Ntono',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Kuria',
    culturalOccasion: 'Initiation Rites & Courtship',
    description: 'Single-stringed musical bow attached to a dried calabash gourd resonator.',
    culturalSignificance: 'Crucial instrument played during Kuria male and female initiation songs.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Uta',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Gunya',
    culturalOccasion: 'Maritime Coastal Celebrations',
    description: 'Gourd-resonated musical bow used by coastal Gunya communities.',
    culturalSignificance: 'Accompanies maritime folk chants along the Indian Ocean coast.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Uta wa wathi',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Kamba',
    culturalOccasion: 'Hunting Expeditions & Dances',
    description: 'Hunter’s musical bow with attached gourd resonator.',
    culturalSignificance: 'Used by Kamba hunters to play reflective melodies in the bush.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Limoyi',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Luhya (Bukusu)',
    culturalOccasion: 'Herding & Solo Solace',
    description: 'Gourd-resonated bow plucked with thin stick or finger.',
    culturalSignificance: 'Personal leisure instrument played by Bukusu elders and herdsmen.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  // Mouth Bows
  {
    title: 'Obokano Mouth Bow',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Kuria',
    culturalOccasion: 'Solo Entertainment',
    description: 'Mouth-resonated flexible wooden bow where player modifies pitch using mouth cavity.',
    culturalSignificance: 'Intimate solo instrument for quiet reflection.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Lukhuje',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Tiriki',
    culturalOccasion: 'Youth Solace & Herding',
    description: 'Mouth-resonated musical bow held against the performer’s mouth for acoustic amplification.',
    culturalSignificance: 'Herdsmen instrument used to communicate with cattle.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  // Zithers
  {
    title: 'Makhana',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Luhya (Marachi)',
    culturalOccasion: 'Village Evenings',
    description: 'Raft zither constructed from parallel papyrus reeds with bark strings supported by bridges.',
    culturalSignificance: 'Unique reed zither providing delicate polyphonic textures.',
    instrumentFamily: 'String',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },

  // --- 2. AEROPHONES (WIND INSTRUMENTS) ---
  // Horns
  {
    title: "Tung'",
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Luo',
    culturalOccasion: 'War & Funeral Assemblies',
    description: 'Side-blown horn crafted from animal horns (bull or antelope).',
    culturalSignificance: 'Summons warriors and announces chief burials.',
    instrumentFamily: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Atom / Adet',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Turkana',
    culturalOccasion: 'Raids & Grazing Gatherings',
    description: 'Side-blown kudu horn used across Turkana territory.',
    culturalSignificance: 'Signals emergency alerts and victory marches.',
    instrumentFamily: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Kondei',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Pokot',
    culturalOccasion: 'Ceremonial Rallies',
    description: 'Traditional Pokot animal horn instrument.',
    culturalSignificance: 'Used during community councils and rainmaking ceremonies.',
    instrumentFamily: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Emouo',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Maasai',
    culturalOccasion: 'Eunoto & Warrior Rites',
    description: 'Kudu horn instrument blown during Maasai Moran age-set ceremonies.',
    culturalSignificance: 'Heralds the graduation of warriors into eldership.',
    instrumentFamily: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Aluti',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Iteso',
    culturalOccasion: 'Royal Processions',
    description: 'Side-blown animal horn of the Iteso people.',
    culturalSignificance: 'Used during chief installation and hunting victories.',
    instrumentFamily: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Siwa',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Lamu (Swahili/Bajuni)',
    culturalOccasion: 'Royal Swahili Ceremonies',
    description: 'Intricately carved ceremonial side-blown trumpet made of brass or elephant horn.',
    culturalSignificance: 'Symbol of Lamu regal authority and royal weddings.',
    instrumentFamily: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Esegere',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Kuria',
    culturalOccasion: 'Clan Gatherings',
    description: 'Animal horn blown laterally by Kuria clan leaders.',
    culturalSignificance: 'Signals council gatherings and sacred rituals.',
    instrumentFamily: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  // Transverse Flutes
  {
    title: 'Chivoti',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Mijikenda',
    culturalOccasion: 'Sengenya Dance & Celebrations',
    description: 'Transverse bamboo flute with open ends producing bright pentatonic melodies.',
    culturalSignificance: 'Lead melodic instrument in Mijikenda Sengenya and Gonda dances.',
    instrumentFamily: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Ekibiswi / Emborogo',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Kuria',
    culturalOccasion: 'Youth Dances',
    description: 'Transverse wooden flute of the Kuria community.',
    culturalSignificance: 'Pitches lively pastoral dance melodies.',
    instrumentFamily: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Mulele',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Luhya',
    culturalOccasion: 'Herding & Leisure',
    description: 'Side-blown bamboo flute played by young men while herding cattle.',
    culturalSignificance: 'Fosters connection with nature and community herds.',
    instrumentFamily: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Musherembe',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Taita',
    culturalOccasion: 'Harvest Dances',
    description: 'Transverse wooden flute crafted by Taita artisans.',
    culturalSignificance: 'Played during seasonal harvest festivities.',
    instrumentFamily: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Ndurerut',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Kipsigis',
    culturalOccasion: 'Pastoral Herding',
    description: 'Transverse bamboo reed flute played by Kipsigis herdsmen.',
    culturalSignificance: 'Calms livestock during long pastures.',
    instrumentFamily: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  // Oblique Flutes
  {
    title: 'Muturiru / Biringi',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Gikuyu',
    culturalOccasion: 'Initiation & Herding',
    description: 'Vertical end-blown bark or bamboo flute with finger holes.',
    culturalSignificance: 'Played by initiates during seclusion period after circumcision.',
    instrumentFamily: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Ebune',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Turkana',
    culturalOccasion: 'Rain Rituals',
    description: 'Vertical wooden flute used by Turkana pastoralists.',
    culturalSignificance: 'Invokes ancestral blessings for rain.',
    instrumentFamily: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Auleru',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Iteso',
    culturalOccasion: 'Folk Dances',
    description: 'Vertical flute played by Iteso musicians.',
    culturalSignificance: 'Provides sweet melodic accents in Iteso ensembles.',
    instrumentFamily: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Odundo',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Luo',
    culturalOccasion: 'Solitary Solace',
    description: 'End-blown notch flute used in Luo rural villages.',
    culturalSignificance: 'Instrument for personal expression and pastoral reflection.',
    instrumentFamily: 'Wind',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },

  // --- 3. MEMBRANOPHONES (DRUMS) ---
  // Single-Headed Drums
  {
    title: 'Isukuti Drum Set',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Luhya',
    culturalOccasion: 'Bull Fighting, Weddings & National Holidays',
    description: 'Set of three conical single-headed drums: Mutiti (lead high pitch), Mukupiro (medium), and Ing’oma (bass).',
    culturalSignificance: 'UNESCO Intangible Cultural Heritage symbol of Luhya identity.',
    instrumentFamily: 'Membranophone',
    imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop',
  },
  {
    title: 'Embegete',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Kuria',
    culturalOccasion: 'Warrior Dances',
    description: 'Tall single-headed conical drum played with hands.',
    culturalSignificance: 'Drives the cadence of Kuria warrior dances.',
    instrumentFamily: 'Membranophone',
    imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop',
  },
  {
    title: 'Boula',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Somalia',
    culturalOccasion: 'Cultural Festivities',
    description: 'Single-headed hand drum used in Somali Kenyan community dances.',
    culturalSignificance: 'Rhythmic centerpiece for wedding dances.',
    instrumentFamily: 'Membranophone',
    imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop',
  },
  {
    title: 'Kithembe',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Kamba',
    culturalOccasion: 'Kilumi Healing Rituals',
    description: 'Cylindrical single-headed drum laced with leather thongs.',
    culturalSignificance: 'Sacred drum used in Kamba Kilumi ritual dances.',
    instrumentFamily: 'Membranophone',
    imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop',
  },
  // Double-Headed Drums
  {
    title: 'Bul',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Luo',
    culturalOccasion: 'Ohangla & Chief Assemblies',
    description: 'Double-headed bass drum played with heavy sticks.',
    culturalSignificance: 'Provides the deep heartbeat in Luo traditional dance ensembles.',
    instrumentFamily: 'Membranophone',
    imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop',
  },
  {
    title: 'Endonyi',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Samia',
    culturalOccasion: 'Worship & Celebrations',
    description: 'Double-headed drum tuned with wooden pegs and skin lacing.',
    culturalSignificance: 'Rhythmic anchor in Samia folk performances.',
    instrumentFamily: 'Membranophone',
    imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop',
  },
  {
    title: 'Chapuo',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Digo (Mijikenda)',
    culturalOccasion: 'Sengenya Dance',
    description: 'Small double-headed drum played horizontally with hands on both sides.',
    culturalSignificance: 'Key rhythmic instrument in coastal Sengenya music.',
    instrumentFamily: 'Membranophone',
    imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop',
  },
  {
    title: 'Ngoma ya Pokomo',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Pokomo',
    culturalOccasion: 'Riverine Harvest Celebrations',
    description: 'Double-headed wooden drum played along the Tana River.',
    culturalSignificance: 'Celebrates good harvests and river blessings.',
    instrumentFamily: 'Membranophone',
    imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop',
  },
  {
    title: 'Atenusu',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Iteso',
    culturalOccasion: 'Akurisot Dance',
    description: 'Double-headed drum carved from solid tree trunk.',
    culturalSignificance: 'Drives the foot-stamping rhythm of Akurisot dance.',
    instrumentFamily: 'Membranophone',
    imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop',
  },
  {
    title: 'Egetemo',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Kuria',
    culturalOccasion: 'Clan Gatherings',
    description: 'Large double-headed ceremonial drum.',
    culturalSignificance: 'Used to announce major community events.',
    instrumentFamily: 'Membranophone',
    imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop',
  },
  {
    title: 'Mukanda',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Kamba',
    culturalOccasion: 'Mbalya & Muungano Dances',
    description: 'Double-headed cylindrical drum slung over the shoulder.',
    culturalSignificance: 'Supports acrobatic Kamba traditional dancers.',
    instrumentFamily: 'Membranophone',
    imageUrl: 'https://images.unsplash.com/photo-1519892300165-cb5542fb47c7?w=600&auto=format&fit=crop',
  },

  // --- 4. IDIOPHONES (SELF-SOUNDING / STRUCK / SHAKEN) ---
  // Rhythmic Idiophones
  {
    title: 'Kayamba',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Mijikenda / Giriama',
    culturalOccasion: 'Weddings, Harvests & Spiritual Healing',
    description: 'Flat reed shaker tray filled with abrus seeds or small pebbles, shaken with both hands.',
    culturalSignificance: 'Essential rhythmic instrument across coastal and national folk dances.',
    instrumentFamily: 'Idiophone',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Chinyimba',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Luhya (Bukusu)',
    culturalOccasion: 'Circumcision Rites (Khuminyisa)',
    description: 'Iron metal jingle bells strapped to the ankles or held in hand during initiation dances.',
    culturalSignificance: 'Accentuates the rhythmic footwork of circumcised initiates.',
    instrumentFamily: 'Idiophone',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: 'Gara',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Luo',
    culturalOccasion: 'Nyatiti Performance',
    description: 'Metal leg rattles tied to the right leg of the Nyatiti player to provide steady pulse.',
    culturalSignificance: 'Allows the Nyatiti player to maintain percussion while playing strings.',
    instrumentFamily: 'Idiophone',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  {
    title: "Karing'aring'a",
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Kikuyu',
    culturalOccasion: 'Mugoiyo Dance & Folk Songs',
    description: 'Struck metal ring or arch struck with a metal rod.',
    culturalSignificance: 'Provides bright metallic rhythmic accents.',
    instrumentFamily: 'Idiophone',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
  // Melodic Idiophones
  {
    title: 'Marimba',
    itemType: 'Indigenous Instrument',
    tribeOfOrigin: 'Mijikenda',
    culturalOccasion: 'Community Festivities',
    description: 'Tuned wooden xylophone keys mounted over gourds or wooden box resonators.',
    culturalSignificance: 'Produces polyphonic melodic rhythms for coastal festivals.',
    instrumentFamily: 'Idiophone',
    imageUrl: 'https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=600&auto=format&fit=crop',
  },
];

// --- SEEDER FUNCTION ---

const seedDatabase = async () => {
  try {
    console.log('Connecting to MongoDB database...');
    await mongoose.connect(MONGO_URI);
    console.log('Connected successfully to MongoDB.');

    console.log('Clearing existing collections (SetPiece, TheoryModule, ArchiveItem)...');
    await SetPiece.deleteMany({});
    await TheoryModule.deleteMany({});
    await ArchiveItem.deleteMany({});
    console.log('Collections cleared.');

    console.log(`Inserting ${setPiecesData.length} Set Pieces...`);
    const insertedSetPieces = await SetPiece.insertMany(setPiecesData);
    console.log(`Successfully inserted ${insertedSetPieces.length} Set Pieces.`);

    console.log(`Inserting ${theoryModulesData.length} Theory Modules...`);
    const insertedTheory = await TheoryModule.insertMany(theoryModulesData);
    console.log(`Successfully inserted ${insertedTheory.length} Theory Modules.`);

    console.log(`Inserting ${archiveItemsData.length} Cultural Archive Items...`);
    const insertedArchive = await ArchiveItem.insertMany(archiveItemsData);
    console.log(`Successfully inserted ${insertedArchive.length} Cultural Archive Items.`);

    console.log('\n========================================');
    console.log('🎉 SAUTISMART DATABASE SEEDED SUCCESSFULLY!');
    console.log(`- Set Pieces: ${insertedSetPieces.length}`);
    console.log(`- Theory Modules: ${insertedTheory.length}`);
    console.log(`- Cultural Archive Items: ${insertedArchive.length}`);
    console.log('========================================\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
