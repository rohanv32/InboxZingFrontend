const mockData = [
    // United States - Business - English
    {
      title: "US Federal Reserve Hikes Interest Rates Again",
      source: "Reuters",
      summary: "The Federal Reserve raised interest rates by 0.25% to combat inflation in the US economy.",
      country: "us",
      category: "business",
      language: "en"
    },
    {
      title: "Amazon Expands Business with New Logistics Hubs",
      source: "Bloomberg",
      summary: "Amazon is investing in new logistics hubs to streamline its business operations in North America.",
      country: "us",
      category: "business",
      language: "en"
    },
    {
      title: "US Stock Market Hits Record High Amid Tech Surge",
      source: "Wall Street Journal",
      summary: "The US stock market reached a new high as technology stocks saw significant growth.",
      country: "us",
      category: "business",
      language: "en"
    },
    {
      title: "Inflation Worries Impact Small Businesses Across the US",
      source: "CNBC",
      summary: "Rising costs have become a major concern for small business owners in the US.",
      country: "us",
      category: "business",
      language: "en"
    },
    {
      title: "Walmart Expands Same-Day Delivery Services",
      source: "Business Insider",
      summary: "Walmart has announced expanded same-day delivery options to compete with other retailers.",
      country: "us",
      category: "business",
      language: "en"
    },

    // United States - Technology - English
    {
      title: "Tech Giants Face Antitrust Regulations",
      source: "The Verge",
      summary: "Major tech companies in the US may face new antitrust regulations amid government scrutiny.",
      country: "us",
      category: "technology",
      language: "en"
    },
    {
      title: "New AI Breakthrough in Machine Learning Announced",
      source: "TechCrunch",
      summary: "Researchers have unveiled a new machine learning model with enhanced capabilities.",
      country: "us",
      category: "technology",
      language: "en"
    },
    {
      title: "Silicon Valley Pushes for Renewable Energy",
      source: "The Guardian",
      summary: "Tech companies in Silicon Valley are increasing investments in renewable energy projects.",
      country: "us",
      category: "technology",
      language: "en"
    },
    {
      title: "5G Technology Revolutionizes Mobile Communication",
      source: "CNET",
      summary: "The rollout of 5G technology is changing the way people communicate and access the internet.",
      country: "us",
      category: "technology",
      language: "en"
    },
    {
      title: "Cybersecurity Threats on the Rise in 2024",
      source: "Wired",
      summary: "Experts warn that cybersecurity threats are increasing as more devices connect to the internet.",
      country: "us",
      category: "technology",
      language: "en"
    },

    // United States - Health - English
    {
      title: "COVID-19 Vaccine Rollout Continues in the US",
      source: "CNN",
      summary: "The US government is accelerating the distribution of COVID-19 vaccines nationwide.",
      country: "us",
      category: "health",
      language: "en"
    },
    {
      title: "New Health Guidelines Released by CDC",
      source: "The Washington Post",
      summary: "The CDC has issued new health guidelines to address seasonal flu prevention.",
      country: "us",
      category: "health",
      language: "en"
    },
    {
      title: "Mental Health Awareness Campaign Launches Nationwide",
      source: "NBC News",
      summary: "A new campaign aims to raise awareness about mental health issues and available resources.",
      country: "us",
      category: "health",
      language: "en"
    },
    {
      title: "Breakthrough in Alzheimer's Research Announced",
      source: "Nature",
      summary: "Researchers have made significant strides in understanding Alzheimer's disease and its treatment.",
      country: "us",
      category: "health",
      language: "en"
    },
    {
      title: "Nutrition Guidelines Updated for 2024",
      source: "USDA",
      summary: "The USDA has released updated nutrition guidelines focusing on healthier eating habits.",
      country: "us",
      category: "health",
      language: "en"
    },

    // Canada - Business - English
    {
      title: "Canadian Dollar Rises as Oil Prices Surge",
      source: "Financial Post",
      summary: "Oil price increases have strengthened the Canadian dollar, impacting international trade.",
      country: "ca",
      category: "business",
      language: "en"
    },
    {
      title: "Canada Announces Tax Reforms for Small Businesses",
      source: "CBC News",
      summary: "The Canadian government is introducing new tax reforms to support small businesses.",
      country: "ca",
      category: "business",
      language: "en"
    },
    {
      title: "Toronto Housing Market Shows Signs of Recovery",
      source: "The Globe and Mail",
      summary: "The housing market in Toronto is starting to rebound after a period of stagnation.",
      country: "ca",
      category: "business",
      language: "en"
    },
    {
      title: "Canadian Tech Sector Sees Record Investments",
      source: "TechCrunch",
      summary: "Investment in the Canadian technology sector reached new heights this year, boosting innovation.",
      country: "ca",
      category: "business",
      language: "en"
    },
    {
      title: "Canada's Trade Relations with Asia Strengthen",
      source: "Financial Times",
      summary: "Trade agreements with Asian countries are enhancing Canada's economic prospects.",
      country: "ca",
      category: "business",
      language: "en"
    },

    // Canada - Technology - English
    {
      title: "Canadian Tech Startups Gain Global Attention",
      source: "The Star",
      summary: "Canadian startups are making waves in the tech industry with innovative solutions.",
      country: "ca",
      category: "technology",
      language: "en"
    },
    {
      title: "AI Innovations from Canada Lead the Way",
      source: "MIT Technology Review",
      summary: "Canadian researchers are at the forefront of AI advancements, impacting multiple industries.",
      country: "ca",
      category: "technology",
      language: "en"
    },
    {
      title: "Canada's Cybersecurity Landscape Evolves",
      source: "CBC News",
      summary: "As threats increase, Canada is enhancing its cybersecurity measures to protect its citizens.",
      country: "ca",
      category: "technology",
      language: "en"
    },
    {
      title: "5G Expansion in Canada: What to Expect",
      source: "MobileSyrup",
      summary: "The rollout of 5G technology across Canada is set to transform communication.",
      country: "ca",
      category: "technology",
      language: "en"
    },
    {
      title: "Quantum Computing: Canada's Investment in the Future",
      source: "Financial Post",
      summary: "Canada is investing heavily in quantum computing research and development.",
      country: "ca",
      category: "technology",
      language: "en"
    },

    // Canada - Health - English
    {
      title: "Canada's Healthcare System Faces New Challenges",
      source: "The Globe and Mail",
      summary: "The Canadian healthcare system is facing various challenges, including staffing shortages.",
      country: "ca",
      category: "health",
      language: "en"
    },
    {
      title: "New Guidelines for Mental Health Support in Canada",
      source: "CBC News",
      summary: "Health authorities in Canada are promoting new guidelines for mental health support.",
      country: "ca",
      category: "health",
      language: "en"
    },
    {
      title: "COVID-19 Cases Decline Across Canada",
      source: "CTV News",
      summary: "The number of COVID-19 cases in Canada continues to decline as vaccination efforts ramp up.",
      country: "ca",
      category: "health",
      language: "en"
    },
    {
      title: "Canada Invests in Indigenous Health Initiatives",
      source: "The Star",
      summary: "The Canadian government is investing in health initiatives aimed at Indigenous communities.",
      country: "ca",
      category: "health",
      language: "en"
    },
    {
      title: "Health Canada Approves New Drug for Diabetes",
      source: "Global News",
      summary: "A new diabetes medication has been approved by Health Canada, promising better management.",
      country: "ca",
      category: "health",
      language: "en"
    },

    // United Kingdom - Business - English
    {
      title: "UK Economy Shows Signs of Recovery Post-Brexit",
      source: "The Guardian",
      summary: "Economic indicators suggest the UK is recovering from the effects of Brexit.",
      country: "gb",
      category: "business",
      language: "en"
    },
    {
      title: "Retail Sector Adapts to Changing Consumer Behaviors",
      source: "BBC News",
      summary: "UK retailers are shifting strategies to accommodate new consumer preferences.",
      country: "gb",
      category: "business",
      language: "en"
    },
    {
      title: "UK Government Launches New Business Grants",
      source: "Financial Times",
      summary: "A new initiative aims to provide grants to small businesses across the UK.",
      country: "gb",
      category: "business",
      language: "en"
    },
    {
      title: "Tech Investments Surge in the UK Market",
      source: "TechRadar",
      summary: "Investments in UK technology companies have surged as the market shows promise.",
      country: "gb",
      category: "business",
      language: "en"
    },
    {
      title: "UK Construction Industry Faces Labor Shortage",
      source: "Construction News",
      summary: "The construction industry in the UK is struggling with a significant labor shortage.",
      country: "gb",
      category: "business",
      language: "en"
    },

    // United Kingdom - Technology - English
    {
      title: "UK Startups Innovate with Sustainable Solutions",
      source: "TechCrunch",
      summary: "UK-based startups are leading the way in sustainable technology innovations.",
      country: "gb",
      category: "technology",
      language: "en"
    },
    {
      title: "5G Rollout in the UK: What You Need to Know",
      source: "Wired",
      summary: "The rollout of 5G technology is progressing in the UK, with major implications for connectivity.",
      country: "gb",
      category: "technology",
      language: "en"
    },
    {
      title: "UK Cybersecurity Strategies Under Review",
      source: "The Independent",
      summary: "The UK government is reviewing its cybersecurity strategies to address new threats.",
      country: "gb",
      category: "technology",
      language: "en"
    },
    {
      title: "Artificial Intelligence Developments in the UK",
      source: "The Times",
      summary: "The UK is investing heavily in AI research, positioning itself as a global leader.",
      country: "gb",
      category: "technology",
      language: "en"
    },
    {
      title: "Blockchain Technology Gains Traction in UK Businesses",
      source: "Forbes",
      summary: "More UK businesses are adopting blockchain technology for improved transparency.",
      country: "gb",
      category: "technology",
      language: "en"
    },

    // United Kingdom - Health - English
    {
      title: "NHS Launches New Health Campaign for Mental Wellbeing",
      source: "Sky News",
      summary: "The NHS has launched a campaign focusing on mental health and wellbeing.",
      country: "gb",
      category: "health",
      language: "en"
    },
    {
      title: "COVID-19 Vaccination Rates Increase in the UK",
      source: "BBC News",
      summary: "Vaccination rates for COVID-19 are steadily increasing across the UK.",
      country: "gb",
      category: "health",
      language: "en"
    },
    {
      title: "Health Reforms Proposed in the UK Parliament",
      source: "The Guardian",
      summary: "New health reforms are being proposed in Parliament to improve healthcare services.",
      country: "gb",
      category: "health",
      language: "en"
    },
    {
      title: "Research Shows Benefits of Physical Activity on Mental Health",
      source: "The Lancet",
      summary: "New research highlights the positive impact of physical activity on mental health.",
      country: "gb",
      category: "health",
      language: "en"
    },
    {
      title: "UK Government Funds New Health Initiatives",
      source: "The Independent",
      summary: "The UK government is funding new health initiatives to improve public health outcomes.",
      country: "gb",
      category: "health",
      language: "en"
    },

    // France - Business - French
    {
      title: "L'économie française montre des signes de reprise",
      source: "Le Monde",
      summary: "Les indicateurs économiques suggèrent que la France se remet des effets de la pandémie.",
      country: "fr",
      category: "business",
      language: "fr"
    },
    {
      title: "Le marché immobilier français en plein essor",
      source: "Les Echos",
      summary: "Le marché immobilier en France connaît une forte demande malgré la crise économique.",
      country: "fr",
      category: "business",
      language: "fr"
    },
    {
      title: "Les petites entreprises françaises bénéficient de subventions gouvernementales",
      source: "France 24",
      summary: "Le gouvernement français a mis en place de nouvelles subventions pour soutenir les petites entreprises.",
      country: "fr",
      category: "business",
      language: "fr"
    },
    {
      title: "La France attire les investissements étrangers",
      source: "Capital",
      summary: "La France est devenue une destination attrayante pour les investissements étrangers grâce à ses réformes.",
      country: "fr",
      category: "business",
      language: "fr"
    },
    {
      title: "Les grandes entreprises françaises adoptent des stratégies durables",
      source: "Le Figaro",
      summary: "De plus en plus d'entreprises françaises intègrent la durabilité dans leurs modèles économiques.",
      country: "fr",
      category: "business",
      language: "fr"
    },

    // France - Technology - French
    {
      title: "Les startups françaises innovent dans le secteur technologique",
      source: "Tech à la une",
      summary: "Les startups en France développent des solutions technologiques révolutionnaires.",
      country: "fr",
      category: "technology",
      language: "fr"
    },
    {
      title: "L'IA en France: un avenir prometteur",
      source: "Le Journal du Net",
      summary: "La France investit massivement dans l'intelligence artificielle pour stimuler l'innovation.",
      country: "fr",
      category: "technology",
      language: "fr"
    },
    {
      title: "La cybersécurité en France: défis et solutions",
      source: "L'Express",
      summary: "La France renforce ses mesures de cybersécurité face à la montée des menaces.",
      country: "fr",
      category: "technology",
      language: "fr"
    },
    {
      title: "5G: la France se prépare à son déploiement",
      source: "Le Parisien",
      summary: "Le déploiement de la technologie 5G en France devrait transformer les communications.",
      country: "fr",
      category: "technology",
      language: "fr"
    },
    {
      title: "L'innovation technologique en France: un moteur de croissance",
      source: "Les Echos",
      summary: "Les entreprises françaises investissent dans des technologies innovantes pour stimuler la croissance.",
      country: "fr",
      category: "technology",
      language: "fr"
    },

    // France - Health - French
    {
      title: "La France fait face à de nouveaux défis de santé publique",
      source: "Le Monde",
      summary: "Le système de santé français doit faire face à des défis importants, y compris les pénuries de personnel.",
      country: "fr",
      category: "health",
      language: "fr"
    },
    {
      title: "Les campagnes de vaccination COVID-19 se poursuivent en France",
      source: "France Info",
      summary: "Le gouvernement français accélère la distribution des vaccins COVID-19.",
      country: "fr",
      category: "health",
      language: "fr"
    },
    {
      title: "Nouvelles lignes directrices sur la santé mentale en France",
      source: "Le Parisien",
      summary: "Les autorités sanitaires françaises lancent de nouvelles lignes directrices pour le soutien en santé mentale.",
      country: "fr",
      category: "health",
      language: "fr"
    },
    {
      title: "La recherche sur la santé révèle des avancées",
      source: "Le Figaro",
      summary: "Les chercheurs français font des progrès significatifs dans le traitement des maladies chroniques.",
      country: "fr",
      category: "health",
      language: "fr"
    },
    {
      title: "Initiatives de santé pour les populations marginalisées en France",
      source: "France 24",
      summary: "Le gouvernement français investit dans des initiatives de santé visant à aider les populations marginalisées.",
      country: "fr",
      category: "health",
      language: "fr"
    },
];

export default mockData;