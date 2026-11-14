const genres = [
  { slug: 'classic-rock', name: 'Classic Rock', palette: ['#e85d2a', '#1b1b1b'], sort: 1 },
  { slug: 'pop-rock', name: 'Pop Rock', palette: ['#ff5c2e', '#ffd166'], sort: 2 },
  { slug: 'prog-rock', name: 'Prog Rock', palette: ['#6a4c93', '#14213d'], sort: 3 },
  { slug: 'funk-rock', name: 'Funk Rock', palette: ['#f72585', '#4cc9f0'], sort: 4 },
  { slug: 'electronic', name: 'Electronic', palette: ['#06d6a0', '#073b4c'], sort: 5 },
  { slug: 'hip-hop', name: 'Hip-Hop', palette: ['#ffd166', '#ef476f'], sort: 6 },
  { slug: 'jazz', name: 'Jazz', palette: ['#bc6c25', '#283618'], sort: 7 },
  { slug: 'indie', name: 'Indie', palette: ['#95d5b2', '#1b4332'], sort: 8 },
  { slug: 'punk', name: 'Punk', palette: ['#e63946', '#1d3557'], sort: 9 },
  { slug: 'soul', name: 'Soul', palette: ['#ffb4a2', '#6d6875'], sort: 10 },
  { slug: 'ambient', name: 'Ambient', palette: ['#8ecae6', '#219ebc'], sort: 11 },
  { slug: 'reggae', name: 'Reggae', palette: ['#2d6a4f', '#ffd166'], sort: 12 },
  { slug: 'psychedelic', name: 'Psychedelic', palette: ['#9b5de5', '#f15bb5'], sort: 13 },
  { slug: 'folk-rock', name: 'Folk Rock', palette: ['#dda15e', '#606c38'], sort: 14 }
];

const categories = [
  { slug: 'vinyl', name: 'Vinyl Records', tagline: 'New releases and rare pressings', sort: 1 },
  { slug: 'turntables', name: 'Turntables', tagline: 'Players for every budget', sort: 2 },
  { slug: 'accessories', name: 'Accessories', tagline: 'Slipmats, sleeves and care kits', sort: 3 },
  { slug: 'giftcards', name: 'Gift Cards', tagline: 'The perfect present for crate diggers', sort: 4 }
];

const albums = [
  {
    slug: 'midnight-frequency', title: 'Midnight Frequency', artist: 'Neon District',
    genre: 'electronic', year: 2025, price: 2990, oldPrice: 3590, format: 'LP', label: 'Klangwelt',
    stock: 12, status: 'in_stock', rating: 4.7, sold: 214,
    description: 'Двенадцать треков гипнотического электронного звука: аналоговые синтезаторы, пульсирующие басовые линии и вокальные сэмплы, записанные в берлинской студии за одну зиму.',
    tracks: [['Night Drive', '4:12'], ['Analog Heart', '5:03'], ['Glass City', '3:47'], ['Low Orbit', '6:20'], ['Midnight Frequency', '5:31'], ['Afterhours', '4:55']]
  },
  {
    slug: 'orange-county', title: 'Orange County', artist: 'The Paper Planes',
    genre: 'indie', year: 2024, price: 2490, format: 'LP', label: 'Small Town Tapes',
    stock: 8, status: 'in_stock', rating: 4.5, sold: 156,
    description: 'Тёплый инди-поп с гитарами, напоминающими о летних поездках по побережью. Дебютный полноформатный альбом группы из Санта-Моники.',
    tracks: [['Palm Trees', '3:21'], ['Orange County', '4:05'], ['Slow Summer', '3:58'], ['Jetty', '2:44'], ['Golden Hour', '4:33'], ['Home Again', '3:12']]
  },
  {
    slug: 'velvet-static', title: 'Velvet Static', artist: 'Mira Cole',
    genre: 'pop-rock', year: 2025, price: 2790, oldPrice: 3190, format: 'LP', label: 'Mellow Wave',
    stock: 5, status: 'in_stock', rating: 4.8, sold: 98,
    description: 'Поп-рок нового поколения: chunky-гитары, бархатный вокал и припевы, которые застревают в голове после первого прослушивания.',
    tracks: [['Velvet Static', '3:44'], ['Cherry Telephone', '3:19'], ['Runaway Heart', '4:02'], ['Neon Rain', '3:51'], ['Sweet Escape', '4:18'], ['Last Dance', '3:36']]
  },
  {
    slug: 'desert-rose', title: 'Desert Rose', artist: 'Sahara Sons',
    genre: 'classic-rock', year: 1978, price: 4290, format: 'LP', label: 'Roadrunner Legacy',
    stock: 3, status: 'in_stock', rating: 4.9, sold: 402,
    description: 'Классика рока в переиздании 180-gram virgin vinyl. Оригинальный микс 1978 года, ремастеринг с аналоговых лент.',
    tracks: [['Desert Rose', '5:26'], ['Highway Dust', '4:41'], ['Cactus Moon', '6:02'], ['Rio Grande', '3:58'], ['Lonesome Rider', '5:14'], ['Encore', '7:33']]
  },
  {
    slug: 'neon-boulevard', title: 'Neon Boulevard', artist: 'Cassette Club',
    genre: 'electronic', year: 2026, price: 3290, format: 'LP', label: 'Klangwelt',
    stock: 0, status: 'preorder', rating: 0, sold: 0,
    description: 'Предзаказ на новый альбом Cassette Club. Синтвейв-саундтрек к фильму, которого ещё не сняли. Релиз — март 2026.',
    tracks: [['Boulevard', '4:47'], ['Palms at Night', '5:12'], ['Chrome Hearts', '3:59'], ['Sunset Strip', '4:28'], ['Laser Eyes', '5:41'], ['Last Exit', '6:05']]
  },
  {
    slug: 'golden-hour-live', title: 'Golden Hour (Live)', artist: 'The Faders',
    genre: 'classic-rock', year: 2023, price: 3690, format: '2LP', label: 'Roadrunner Legacy',
    stock: 6, status: 'in_stock', rating: 4.6, sold: 187,
    description: 'Концертный двойной винил, записанный в зале Royal Albert Hall. Включает три ранее не издававшихся композиции.',
    tracks: [['Intro', '1:42'], ['Golden Hour', '5:08'], ['Static Bloom', '4:29'], ['Coastline', '4:57'], ['Wildfire', '6:11'], ['Fading Light', '5:44']]
  },
  {
    slug: 'purple-haze-revisited', title: 'Purple Haze Revisited', artist: 'Ivy Jenkins',
    genre: 'psychedelic', year: 2024, price: 2890, format: 'LP', label: 'Small Town Tapes',
    stock: 10, status: 'in_stock', rating: 4.4, sold: 121,
    description: 'Психоделический рок с элементами фолка: флейта, ситар и эхо-камеры. Запись в съёмной студии Лос-Анджелеса.',
    tracks: [['Purple Haze', '4:37'], ['Incense & Peppermints', '3:22'], ['Butterfly', '5:15'], ['White Rabbit', '4:08'], ['Jefferson Airplane', '3:56'], ['Today', '4:44']]
  },
  {
    slug: 'street-poetry', title: 'Street Poetry', artist: 'MC Verse',
    genre: 'hip-hop', year: 2024, price: 3190, oldPrice: 3690, format: 'LP', label: 'Concrete Beats',
    stock: 14, status: 'in_stock', rating: 4.7, sold: 233,
    description: 'Бум-бап с живыми инструментами и семплами из джазовых пластинок 60-х. Гость на альбоме — легендарный DJ Kutmasta.',
    tracks: [['Street Poetry', '4:29'], ['Concrete Roses', '3:56'], ['Mic Check', '4:12'], ['Corner Store', '5:02'], ['Raised by Radio', '4:38'], ['Final Verse', '3:47']]
  },
  {
    slug: 'blue-in-green', title: 'Blue in Green', artist: 'Ella Moreau Trio',
    genre: 'jazz', year: 1959, price: 4990, format: 'LP', label: 'Blue Note Classics',
    stock: 2, status: 'in_stock', rating: 5.0, sold: 510,
    description: 'Переиздание культового альбома в серии Blue Note Classics. 180 g, полустороннее прессование, оригинальный дизайн обложки.',
    tracks: [['Blue in Green', '5:37'], ['All Blues', '11:33'], ['Skating', '6:08'], ['Flamenco Sketches', '9:25'], ['So What', '9:22'], ['Miles Mode', '5:49']]
  },
  {
    slug: 'static-bloom', title: 'Static Bloom', artist: 'The Faders',
    genre: 'pop-rock', year: 2022, price: 2290, format: 'LP', label: 'Mellow Wave',
    stock: 20, status: 'in_stock', rating: 4.3, sold: 345,
    description: 'Дебютный альбом The Faders — смесь брит-popа и калифорнийского солнца. Продюсер — Джек Антонофф.',
    tracks: [['Static Bloom', '3:28'], ['Side Effect', '3:15'], ['Peach', '3:42'], ['Better Days', '4:01'], ['Fade', '3:55'], ['Never Leaving', '4:22']]
  },
  {
    slug: 'machine-dreams', title: 'Machine Dreams', artist: 'Kraftwerk Legacy',
    genre: 'electronic', year: 2025, price: 3490, format: 'LP', label: 'Klangwelt',
    stock: 9, status: 'in_stock', rating: 4.6, sold: 178,
    description: 'Концептуальный электронный альбом о городах будущего. Записан полностью на аналоговых синтезаторах 70-х.',
    tracks: [['Machine Dreams', '5:44'], ['City Lights', '4:28'], ['Autobahn', '6:12'], ['Roboter', '3:58'], ['Neon Highway', '5:26'], ['Future City', '7:08']]
  },
  {
    slug: 'rust-and-gold', title: 'Rust & Gold', artist: 'The Hollow Pines',
    genre: 'indie', year: 2023, price: 2390, format: 'LP', label: 'Small Town Tapes',
    stock: 11, status: 'in_stock', rating: 4.5, sold: 198,
    description: 'Фолк-рок из горного городка: банджо, гармонь и честные тексты о работе и любви.',
    tracks: [['Rust & Gold', '4:12'], ['Coal Town', '3:49'], ['Wool & Steel', '4:36'], ['Hollow Pines', '5:18'], ['Copper Sky', '3:57'], ['Riverbed', '4:44']]
  },
  {
    slug: 'chromatic', title: 'Chromatic', artist: 'Polyphia Project',
    genre: 'prog-rock', year: 2024, price: 3590, oldPrice: 4090, format: 'LP', label: 'Sumerian Archive',
    stock: 4, status: 'in_stock', rating: 4.8, sold: 167,
    description: 'Прогрессивный инструментальный рок: сложные размеры, полиритмия и гитарные соло, записанные с первого дубля.',
    tracks: [['Chromatic', '4:58'], ['French exit', '3:44'], ['Ode to the Moon', '5:26'], ['Garden of Eden', '4:17'], ['Nymph', '6:02'], ['Yours Again', '4:39']]
  },
  {
    slug: 'no-more-heroes', title: 'No More Heroes', artist: 'The Struts',
    genre: 'punk', year: 1977, price: 3990, format: 'LP', label: 'Raw Power',
    stock: 3, status: 'in_stock', rating: 4.9, sold: 289,
    description: 'Переиздание панк-классики на цветном виниле. Оригинальный sleeve, printed inner bag с текстами песен.',
    tracks: [['No More Heroes', '3:28'], ['Going Down', '2:56'], ['School Daze', '4:11'], ['In Your Room', '3:47'], ['Rough Kids', '3:02'], ['Violent Love', '2:39']]
  },
  {
    slug: 'quiet-fire', title: 'Quiet Fire', artist: 'Nina Simone Tribute',
    genre: 'soul', year: 1965, price: 4590, format: 'LP', label: 'Soul Archives',
    stock: 2, status: 'in_stock', rating: 4.9, sold: 276,
    description: 'Душевная классика 60-х в сериале  Audiophile Pressing. Включает бонусный 7" сингл с неиздававшимися треками.',
    tracks: [['Quiet Fire', '4:15'], ['Feeling Good', '3:42'], ['I Put a Spell on You', '2:58'], ['Sinnerman', '10:21'], ['Wild Is the Wind', '6:58'], ['Don\'t Let Me Be Misunderstood', '2:44']]
  },
  {
    slug: 'wandering-star', title: 'Wandering Star', artist: 'Astra Khan',
    genre: 'ambient', year: 2025, price: 2690, format: 'LP', label: 'Klangwelt',
    stock: 7, status: 'in_stock', rating: 4.4, sold: 89,
    description: 'Медитативный эмбиент с полевыми записями пустыни и модульными синтезаторами. Идеально для вечернего прослушивания.',
    tracks: [['Wandering Star', '7:44'], ['Dune', '6:12'], ['Night Sky', '8:05'], ['Slow Drift', '5:38'], ['Horizon Line', '9:21'], ['First Light', '6:57']]
  },
  {
    slug: 'roots-and-culture', title: 'Roots & Culture', artist: 'Jah Mason',
    genre: 'reggae', year: 1982, price: 3790, format: 'LP', label: 'Island Heritage',
    stock: 4, status: 'in_stock', rating: 4.7, sold: 145,
    description: 'Рутс-реггей в оригинальном прессовании. Золотая эра ямайского звука: плотные басы и духовые секции.',
    tracks: [['Roots & Culture', '4:37'], ['Rivers of Babylon', '3:58'], ['Redemption Song', '4:44'], ['No Woman No Cry', '5:12'], ['Get Up Stand Up', '3:56'], ['One Love', '4:02']]
  },
  {
    slug: 'flower-child', title: 'Flower Child', artist: 'The Daisy Chain',
    genre: 'classic-rock', year: 1969, price: 4190, format: 'LP', label: 'Roadrunner Legacy',
    stock: 2, status: 'in_stock', rating: 4.6, sold: 198,
    description: 'Хиппи-рок конца 60-х: психоделические гитары, орган и вокальные гармонии. Оригинал обложки Gatefold.',
    tracks: [['Flower Child', '5:22'], ['Summer of Love', '4:18'], ['San Francisco', '3:56'], ['White Rabbit', '4:44'], ['Somebody to Love', '4:37'], ['Volunteers', '3:12']]
  },
  {
    slug: 'paper-moon', title: 'Paper Moon', artist: 'Lola & The Lights',
    genre: 'pop-rock', year: 2025, price: 2590, format: 'LP', label: 'Mellow Wave',
    stock: 15, status: 'in_stock', rating: 4.2, sold: 67,
    description: 'Свежий поп-рок с вокалом, который сравнивают с ранними Florence + The Machine. Пластинка на виниле цвета «лососёвый».',
    tracks: [['Paper Moon', '3:51'], ['Knife Edge', '4:08'], ['Underwater', '3:36'], ['Ceremony', '4:22'], ['Little Death', '3:59'], ['Big Love', '4:45']]
  },
  {
    slug: 'be-bop-classics', title: 'Be Bop Classics', artist: 'Charlie Parker Ensemble',
    genre: 'jazz', year: 1956, price: 5290, format: 'LP', label: 'Blue Note Classics',
    stock: 1, status: 'in_stock', rating: 5.0, sold: 322,
    description: 'Коллекционное переиздание бибоп-классики. Стерео-ремастеринг с оригинальных лент, вставка с фотографиями сессий.',
    tracks: [['Ko-Ko', '2:58'], ['Now\'s the Time', '3:16'], ['Parker\'s Mood', '3:02'], ['Ornithology', '3:01'], ['Confirmation', '2:58'], ['Anthropology', '2:58']]
  },
  {
    slug: 'funk-machine', title: 'Funk Machine', artist: 'The Groove Council',
    genre: 'funk-rock', year: 1975, price: 3890, format: 'LP', label: 'Soul Archives',
    stock: 5, status: 'in_stock', rating: 4.8, sold: 267,
    description: 'Фанк-рок середины 70-х: бас, который можно резать, и духовой секцией, от которой невозможно усидеть на месте.',
    tracks: [['Funk Machine', '5:44'], ['Slap Bass', '4:28'], ['Hot Pants', '4:52'], ['Give It Up', '5:16'], ['Soul Finger', '3:38'], ['Cold Sweat', '4:09']]
  },
  {
    slug: 'spider-babies', title: 'Spider Babies', artist: 'The Cramps Legacy',
    genre: 'punk', year: 1980, price: 3690, format: 'LP', label: 'Raw Power',
    stock: 6, status: 'in_stock', rating: 4.5, sold: 134,
    description: 'Психобилли и панк-рок на одной пластинке. Грязный звук, злободневные тексты и культовый статус.',
    tracks: [['Spider Babies', '2:58'], ['Garbageman', '3:16'], ['I\'m Cramped', '2:44'], ['Tear It Up', '3:05'], ['Fever', '2:38'], ['Human Fly', '2:49']]
  },
  {
    slug: 'silk-road', title: 'Silk Road', artist: 'Nusrat Ensemble',
    genre: 'ambient', year: 2023, price: 2890, format: 'LP', label: 'World Echoes',
    stock: 8, status: 'in_stock', rating: 4.6, sold: 112,
    description: 'Этнический эмбиент с инструментами Центральной Азии: дутар, сато и карталы. Запись в старой мечети Самарканда.',
    tracks: [['Silk Road', '8:22'], ['Samarkand', '6:45'], ['Caravan', '7:18'], ['Desert Wind', '5:57'], ['Night Market', '6:33'], ['Steppe', '9:12']]
  },
  {
    slug: 'motown-gold', title: 'Motown Gold', artist: 'Various Artists',
    genre: 'soul', year: 1972, price: 3290, format: 'LP', label: 'Soul Archives',
    stock: 9, status: 'in_stock', rating: 4.7, sold: 289,
    description: 'Сборник хитов Motown в оригинальных миксах. The Supremes, Marvin Gaye, Stevie Wonder и The Temptations на одном виниле.',
    tracks: [['Ain\'t No Mountain High Enough', '2:48'], ['I Heard It Through the Grapevine', '3:14'], ['Superstition', '4:12'], ['My Girl', '2:58'], ['Reach Out I\'ll Be There', '3:02'], ['Dancing in the Street', '2:44']]
  },
  {
    slug: 'krautrock-vol-1', title: 'Krautrock Vol. 1', artist: 'Neu! Inspired',
    genre: 'prog-rock', year: 1972, price: 4490, format: 'LP', label: 'Brain Archive',
    stock: 3, status: 'in_stock', rating: 4.9, sold: 156,
    description: 'Краутрок-классика: монотонный ритм, психоделические гитары и космическая энергетика Берлина начала 70-х.',
    tracks: [['Hallogallo', '10:08'], ['Negativland', '9:47'], ['Im Glück', '6:49'], ['Sonderbar', '8:22'], ['Lieber Honig', '7:18'], ['Für Immer', '11:33']]
  },
  {
    slug: 'dub-plates', title: 'Dub Plates', artist: 'King Tubby Sound',
    genre: 'reggae', year: 1976, price: 3990, format: 'LP', label: 'Island Heritage',
    stock: 5, status: 'in_stock', rating: 4.8, sold: 178,
    description: 'Даб-классика Кинг Табби: эхо, реверберация и басовые линии, построившие целое направление музыки.',
    tracks: [['Dub Plate Special', '4:22'], ['King Tubby\'s Dub', '5:18'], ['Satan\'s Dub', '3:57'], ['Zion Dub', '4:44'], ['Dub the Right Way', '5:31'], ['Jah My Shepherd', '4:09']]
  },
  {
    slug: 'lo-fi-beauty', title: 'Lo-Fi Beauty', artist: 'Bedroom Producer',
    genre: 'hip-hop', year: 2025, price: 2390, format: 'LP', label: 'Concrete Beats',
    stock: 18, status: 'in_stock', rating: 4.3, sold: 94,
    description: 'Лоу-фай хоп-хоп с пыльными семплами и расслабленным флоу. Идеальная фоновая музыка для учёбы и работы.',
    tracks: [['Lo-Fi Beauty', '3:22'], ['Rainy Window', '2:58'], ['Cassette Dreams', '3:44'], ['Night Bus', '3:16'], ['Pillow Talk', '2:47'], ['Sunday Morning', '3:52']]
  },
  {
    slug: 'cosmic-traveller', title: 'Cosmic Traveller', artist: 'Sun Ra Arkestra',
    genre: 'jazz', year: 1973, price: 4790, format: 'LP', label: 'Blue Note Classics',
    stock: 2, status: 'in_stock', rating: 4.9, sold: 201,
    description: 'Космический джаз Сан Ра: авангард, свинг и философия космоса. Одна из самых влиятельных пластинок XX века.',
    tracks: [['Cosmic Traveller', '6:47'], ['Space Is the Place', '8:22'], ['Lights on a Satellite', '5:18'], ['Nuclear War', '7:44'], ['Astro Black', '6:09'], ['Sunship', '4:56']]
  },
  {
    slug: 'grunge-years', title: 'Grunge Years', artist: 'Seattle Sound',
    genre: 'punk', year: 1994, price: 3490, format: 'LP', label: 'Raw Power',
    stock: 7, status: 'in_stock', rating: 4.6, sold: 188,
    description: 'Гранж-классика из Сиэтла: грязные гитары, надрывный вокал и энергия гаражных клубов начала 90-х.',
    tracks: [['Smells Like Teen Spirit', '5:01'], ['Come As You Are', '3:39'], ['Lithium', '4:16'], ['In Bloom', '4:14'], ['About a Girl', '3:08'], [' Polly', '2:54']]
  },
  {
    slug: 'shibuya-nights', title: 'Shibuya Nights', artist: 'Tokyo Metro',
    genre: 'electronic', year: 2026, price: 3090, format: 'LP', label: 'Klangwelt',
    stock: 0, status: 'preorder', rating: 0, sold: 0,
    description: 'Сайбер-поп и техно из Токио. Предзаказ с эксклюзивным цветным винилом и постером в подарок.',
    tracks: [['Shibuya Crossing', '4:58'], ['Neon Alley', '5:22'], ['Metro Pulse', '4:37'], ['Akihabara', '6:08'], ['Rainy Shinjuku', '5:44'], ['Last Train', '7:02']]
  },
  {
    slug: 'orchard-road', title: 'Orchard Road', artist: 'The Kooks Field',
    genre: 'indie', year: 2025, price: 2490, oldPrice: 2890, format: 'LP', label: 'Small Town Tapes',
    stock: 13, status: 'in_stock', rating: 4.4, sold: 76,
    description: 'Инди-рок с британским акцентом и летними припевами. Записан в доме XVIII века в графстве Кент.',
    tracks: [['Orchard Road', '3:44'], ['Cherry Lane', '3:18'], ['English Rain', '4:02'], ['Garden Party', '3:56'], ['Hops & Barley', '4:29'], ['Last Train Home', '3:37']]
  },
  {
    slug: 'blues-before-sunrise', title: 'Blues Before Sunrise', artist: 'Robert Johnson Revival',
    genre: 'classic-rock', year: 1937, price: 5990, format: 'LP', label: 'Roadrunner Legacy',
    stock: 1, status: 'in_stock', rating: 5.0, sold: 356,
    description: 'Переиздание легендарных записей 1936–1937 годов. Коллекционное издание с буклетом и архивными фотографиями.',
    tracks: [['Cross Road Blues', '2:39'], ['Sweet Home Chicago', '3:02'], ['Hellhound on My Trail', '2:36'], ['Love in Vain', '2:48'], ['Rambling on My Mind', '2:53'], ['Stop Breaking Down', '2:22']]
  },
  {
    slug: 'psychedelic-woman', title: 'Psychedelic Woman', artist: 'Fela Kuti Global',
    genre: 'funk-rock', year: 1974, price: 4190, format: 'LP', label: 'Soul Archives',
    stock: 4, status: 'in_stock', rating: 4.7, sold: 133,
    description: 'Афро-бит и фанк Фела Кути: духовые секции, перкуссия и политические тексты. Золотая эра африканской музыки.',
    tracks: [['Psychedelic Woman', '5:22'], ['Zombie', '12:26'], ['Water No Get Enemy', '11:29'], ['Shakara', '4:38'], ['Gentleman', '15:36'], ['Jeun K\'oku', '7:17']]
  },
  {
    slug: 'yacht-rock', title: 'Yacht Rock', artist: 'Smooth Sailors',
    genre: 'pop-rock', year: 1981, price: 2990, format: 'LP', label: 'Mellow Wave',
    stock: 16, status: 'in_stock', rating: 4.2, sold: 145,
    description: 'Мягкий рок начала 80-х: пальмы, катера и безмятежность. Steely Dan и Toto в одном флаконе.',
    tracks: [['Yacht Rock', '4:12'], ['Sailing', '4:05'], ['Rosanna', '4:28'], ['Africa', '4:56'], ['Baker Street', '6:08'], ['What a Fool Believes', '3:44']]
  },
  {
    slug: 'riot-city', title: 'Riot City', artist: 'The Clash Tribute Band',
    genre: 'punk', year: 1979, price: 3590, format: 'LP', label: 'Raw Power',
    stock: 8, status: 'in_stock', rating: 4.8, sold: 234,
    description: 'Панк-рок эпохи расцвета: политика, регги-влияния и гимны улиц Лондона конца 70-х.',
    tracks: [['London Calling', '3:20'], ['White Riot', '1:58'], ['Career Opportunities', '1:52'], ['Clampdown', '3:50'], ['The Guns of Brixton', '3:10'], ['Train in Vain', '3:10']]
  },
  {
    slug: 'rainy-day-jazz', title: 'Rainy Day Jazz', artist: 'Bill Evans Homage',
    genre: 'jazz', year: 1961, price: 4690, format: 'LP', label: 'Blue Note Classics',
    stock: 3, status: 'in_stock', rating: 4.9, sold: 189,
    description: 'Тройное фортепиано, контрабас и барабаны: тихая революция в джазе, изменившая жанр навсегда.',
    tracks: [['Waltz for Debby', '6:58'], ['My Funny Valentine', '5:22'], ['Peace Piece', '7:18'], ['Solar', '5:12'], ['Alice in Wonderland', '8:36'], ['Gloria\'s Step', '6:11']]
  },
  {
    slug: 'highland-fling', title: 'Highland Fling', artist: 'Celtic Storm',
    genre: 'folk-rock', year: 2024, price: 2790, format: 'LP', label: 'Small Town Tapes',
    stock: 9, status: 'in_stock', rating: 4.5, sold: 122,
    description: 'Фолк-рок с шотландскими корнями: вистл, скрипка и эпические хоры. Записан в замке XIV века.',
    tracks: [['Highland Fling', '4:44'], ['Misty Glen', '5:18'], ['Whisky Jar', '3:56'], ['Northern Lights', '6:02'], ['Stone Circle', '4:37'], ['Farewell to Eire', '7:28']]
  },
  {
    slug: 'chrome-age', title: 'Chrome Age', artist: 'Futurecop',
    genre: 'electronic', year: 2024, price: 3290, oldPrice: 3790, format: 'LP', label: 'Klangwelt',
    stock: 10, status: 'in_stock', rating: 4.6, sold: 167,
    description: 'Ретро-футуризм: синтезаторы 80-х встречаются с современным продакшеном. Саундтрек к неоновому будущему.',
    tracks: [['Chrome Age', '4:58'], ['Neon Grid', '5:22'], ['Laser Rain', '4:37'], ['Digital Heart', '5:44'], ['Sunset Boulevard', '6:18'], ['2099', '7:09']]
  },
  {
    slug: 'summer-of-love', title: 'Summer of Love', artist: 'Fifty Years On',
    genre: 'classic-rock', year: 2026, price: 2890, format: 'LP', label: 'Roadrunner Legacy',
    stock: 0, status: 'preorder', rating: 0, sold: 0,
    description: 'Юбилейный сборник к 50-летию лета любви. Лимитированное издание на красном виниле, 500 копий.',
    tracks: [['California Dreaming', '2:44'], ['San Francisco', '3:56'], ['White Rabbit', '2:34'], ['Somebody to Love', '2:56'], ['Light My Fire', '7:06'], ['Piece of My Heart', '4:14']]
  },
  {
    slug: 'bluegrass-mornings', title: 'Bluegrass Mornings', artist: 'Appalachian Dawn',
    genre: 'folk-rock', year: 2023, price: 2290, format: 'LP', label: 'Small Town Tapes',
    stock: 12, status: 'in_stock', rating: 4.3, sold: 88,
    description: 'Блюграсс с гор Аппалачи: мандолина, банджо и высокие вокальные гармонии. Музыка для утреннего кофе.',
    tracks: [['Morning Dew', '3:28'], ['Blue Ridge Mountain', '4:12'], ['Man of Constant Sorrow', '3:44'], ['Angelina', '3:56'], ['Whiskey Before Breakfast', '2:58'], ['Big Mon', '3:08']]
  },
  {
    slug: 'disco-forever', title: 'Disco Forever', artist: 'Studio 54 Allstars',
    genre: 'funk-rock', year: 1978, price: 3690, format: 'LP', label: 'Soul Archives',
    stock: 6, status: 'in_stock', rating: 4.7, sold: 245,
    description: 'Диско-золото эпохи Studio 54: струнные, латинские перкуссии и безудержные танцевальные ритмы.',
    tracks: [['Disco Inferno', '10:51'], ['Le Freak', '5:28'], ['I Will Survive', '4:56'], ['Don\'t Leave Me This Way', '6:08'], ['Ring My Bell', '3:32'], ['Boogie Wonderland', '4:49']]
  },
  {
    slug: 'shoegaze-dreams', title: 'Shoegaze Dreams', artist: 'My Bloody Valentines',
    genre: 'indie', year: 1991, price: 3990, format: 'LP', label: 'Small Town Tapes',
    stock: 4, status: 'in_stock', rating: 4.8, sold: 176,
    description: 'Смоугейз-классика: стена звука из педалей и размытый вокал, изменивший инди-сцену навсегда.',
    tracks: [['Only Shallow', '4:17'], ['When You Sleep', '4:11'], ['Come in Alone', '3:49'], ['Sometimes', '5:20'], ['In a Whisper', '4:08'], ['Honey Power', '4:51']]
  },
  {
    slug: 'surf-ride', title: 'Surf Ride', artist: 'The Beachcombers',
    genre: 'classic-rock', year: 1962, price: 3490, format: 'LP', label: 'Roadrunner Legacy',
    stock: 5, status: 'in_stock', rating: 4.5, sold: 134,
    description: 'Серф-рок начала 60-х: тремоло-гитары, автомобили и пляжи. Дух калифорнийской свободы на виниле.',
    tracks: [['Surfin\' Safari', '2:08'], ['Surfer Girl', '2:27'], ['Wipe Out', '2:15'], ['Pipeline', '2:22'], ['Misirlou', '2:14'], ['Good Vibrations', '3:36']]
  },
  {
    slug: 'dubai-nights', title: 'Dubai Nights', artist: 'Desert Electronica',
    genre: 'electronic', year: 2025, price: 2990, format: 'LP', label: 'Klangwelt',
    stock: 11, status: 'in_stock', rating: 4.4, sold: 109,
    description: 'Техно с восточными мотивами: арабские гаммы, глубокий бас и ритмы пустыни. Запись на вилле в Дубае.',
    tracks: [['Dubai Nights', '6:22'], ['Sand Storm', '5:48'], ['Pearl Diver', '5:14'], ['Mirage', '6:47'], ['Caravan', '5:56'], ['Oasis', '7:18']]
  }
];

const faqs = [
  { question: 'Как оформить предзаказ?', answer: 'Выберите пластинку со значком «Предзаказ», добавьте в корзину и оформите заказ как обычно. Мы свяжемся с вами за неделю до релиза и отправим пластинку в день поступления.', sort: 1 },
  { question: 'Есть ли доставка по России?', answer: 'Да, отправляем Почтой России и СДЭК по всей стране. Стоимость рассчитывается при оформлении заказа, от 350 ₽. Бесплатно при заказе от 5 000 ₽.', sort: 2 },
  { question: 'В каком состоянии пластинки?', answer: 'Все новые пластинки проверяются на проигрывателе перед отправкой. Бу-товары маркируем по международной системе градаций Goldmine и прикладываем фото состояния.', sort: 3 },
  { question: 'Можно ли вернуть пластинку?', answer: 'Возврат возможен в течение 14 дней, если пластинка не была в употреблении и сохранён товарный вид. Деньги вернём на карту в течение 3 рабочих дней.', sort: 4 },
  { question: 'Как ухаживать за винилом?', answer: 'Храните пластинки вертикально, вдали от батарей и прямого солнца. Чистите перед каждым проигрыванием щёткой из углеродного волокна и используйте внутренние конверты из полиэтилена.', sort: 5 }
];

module.exports = { genres, categories, albums, faqs };
