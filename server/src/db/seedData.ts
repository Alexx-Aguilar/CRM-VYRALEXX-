import {
  Creator, Agency, Brand, Campaign, Collaboration, CalendarEvent,
  PipelineDeal, Contract, PaymentRecord, Task, ChatMessage,
  MediaFile, SystemNotification, SystemSettings
} from '../types/index.js';

export const initialAgencies: Agency[] = [
  {
    id: 'ag-1',
    name: 'Vyral Next Media Group',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=150&auto=format&fit=crop&q=80',
    description: 'Agencia matriz de talentos digitales, producción de contenido hiper-escalable y gestión de marcas Tier 1.',
    country: 'México',
    email: 'contacto@vyralnext.com',
    phone: '+52 55 9182 3400',
    website: 'https://vyralnext.media',
    managerName: 'Alejandro Morales',
    representedCreatorsCount: 18,
    managedCampaignsCount: 34,
    status: 'Activa',
    notes: 'Agencia fundadora de la red VYRALEXX. Especializada en Gaming y Lifestyle.',
    createdAt: '2026-01-10T08:00:00Z'
  },
  {
    id: 'ag-2',
    name: 'HyperNova Talent Agency',
    logo: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=150&auto=format&fit=crop&q=80',
    description: 'Representación exclusiva de creadores de moda de lujo, belleza, tecnología de consumo y streamers de alto impacto.',
    country: 'España',
    email: 'info@hypernovatalent.es',
    phone: '+34 91 445 8820',
    website: 'https://hypernovatalent.es',
    managerName: 'Elena De La Torre',
    representedCreatorsCount: 14,
    managedCampaignsCount: 26,
    status: 'Activa',
    notes: 'Cobertura en Madrid, Barcelona y Miami. Fuerte conexión con marcas de lifestyle.',
    createdAt: '2026-02-15T10:30:00Z'
  },
  {
    id: 'ag-3',
    name: 'Apex Influence Latam',
    logo: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=150&auto=format&fit=crop&q=80',
    description: 'Líder en campañas de fitness, bienestar, deportes electrónicos y tecnología móvil en Colombia, Argentina y Chile.',
    country: 'Colombia',
    email: 'ops@apexinfluence.co',
    phone: '+57 1 744 9012',
    website: 'https://apexinfluence.co',
    managerName: 'Mateo Roldán',
    representedCreatorsCount: 12,
    managedCampaignsCount: 19,
    status: 'Activa',
    notes: 'Especialistas en activación de micro y macro influencers con alto engagement.',
    createdAt: '2026-03-01T12:00:00Z'
  }
];

export const initialCreators: Creator[] = [
  {
    id: 'cr-1',
    name: 'Valeria Castro Ruiz',
    artisticName: 'Valeria CyberGlow',
    email: 'valeria@cyberglow.io',
    phone: '+34 622 890 123',
    country: 'España',
    city: 'Barcelona',
    bio: 'Creadora de contenido en tecnología, hardware futurista, setups minimalistas y estilo de vida ciberpunk. Creadora top 5 de YouTube Tech en España.',
    category: 'Gaming & Tech',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    socialProfiles: [
      { platform: 'youtube', handle: '@valeriacyberglow', followers: 1250000, url: 'https://youtube.com', engagementRate: 6.8, avgViews: 420000 },
      { platform: 'instagram', handle: '@valeria.glow', followers: 640000, url: 'https://instagram.com', engagementRate: 5.4, avgViews: 185000 },
      { platform: 'tiktok', handle: '@cyberglow_val', followers: 980000, url: 'https://tiktok.com', engagementRate: 8.9, avgViews: 350000 },
      { platform: 'twitch', handle: 'cyberglow_live', followers: 290000, url: 'https://twitch.tv', engagementRate: 9.2, avgViews: 85000 }
    ],
    rates: {
      instagramReel: 3800,
      instagramStory: 1200,
      tiktokVideo: 4200,
      youtubeDedicated: 9500,
      youtubeIntegration: 5200,
      eventAttendance: 6000
    },
    audience: {
      topCountries: [
        { country: 'España', percentage: 42 },
        { country: 'México', percentage: 28 },
        { country: 'Argentina', percentage: 15 },
        { country: 'Estados Unidos', percentage: 10 }
      ],
      genderSplit: { male: 58, female: 39, other: 3 },
      ageGroups: [
        { range: '18-24', percentage: 48 },
        { range: '25-34', percentage: 38 },
        { range: '35+', percentage: 14 }
      ]
    },
    totalFollowers: 3160000,
    avgEngagementRate: 7.5,
    avgReach: 850000,
    availability: 'Disponible',
    status: 'Activo',
    agencyId: 'ag-2',
    tags: ['Tech', 'Hardware', 'Gaming', 'Setup', 'Cyberpunk'],
    notes: 'Excelente dicción, entregas puntuales y métricas de retención sobresalientes.',
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'cr-2',
    name: 'Sebastián Morales',
    artisticName: 'SebaVibes',
    email: 'seba@sebavibes.com',
    phone: '+52 55 4321 9876',
    country: 'México',
    city: 'Ciudad de México',
    bio: 'Storyteller visual, fotógrafo urbano y entusiasta de la moda streetwear y viajes cinematográficos. Embajador de marcas globales.',
    category: 'Moda & Lifestyle',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    socialProfiles: [
      { platform: 'instagram', handle: '@sebavibes', followers: 1120000, url: 'https://instagram.com', engagementRate: 6.2, avgViews: 390000 },
      { platform: 'tiktok', handle: '@sebavibes_mx', followers: 1850000, url: 'https://tiktok.com', engagementRate: 7.8, avgViews: 620000 },
      { platform: 'youtube', handle: '@SebaVibesVisuals', followers: 480000, url: 'https://youtube.com', engagementRate: 5.1, avgViews: 210000 }
    ],
    rates: {
      instagramReel: 4500,
      instagramStory: 1500,
      tiktokVideo: 5000,
      youtubeDedicated: 8000,
      youtubeIntegration: 4500,
      eventAttendance: 7500
    },
    audience: {
      topCountries: [
        { country: 'México', percentage: 55 },
        { country: 'Colombia', percentage: 18 },
        { country: 'Estados Unidos', percentage: 14 },
        { country: 'Chile', percentage: 8 }
      ],
      genderSplit: { male: 46, female: 52, other: 2 },
      ageGroups: [
        { range: '18-24', percentage: 42 },
        { range: '25-34', percentage: 46 },
        { range: '35+', percentage: 12 }
      ]
    },
    totalFollowers: 3450000,
    avgEngagementRate: 6.4,
    avgReach: 980000,
    availability: 'En proyectos',
    status: 'Activo',
    agencyId: 'ag-1',
    tags: ['Streetwear', 'Viajes', 'Fotografía', 'Lujo', 'Cine'],
    notes: 'Fotografía de nivel profesional editorial. Acepta campañas con contrato de exclusividad en indumentaria.',
    createdAt: '2026-01-20T11:00:00Z'
  },
  {
    id: 'cr-3',
    name: 'Camila Montoya',
    artisticName: 'CamiFit Iron',
    email: 'cami@camifit.co',
    phone: '+57 312 876 5432',
    country: 'Colombia',
    city: 'Medellín',
    bio: 'Atleta híbrida, entrenadora de alto rendimiento, especialista en nutrición deportiva y motivación de hábitos saludables.',
    category: 'Fitness & Nutrición',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    socialProfiles: [
      { platform: 'instagram', handle: '@camifit_iron', followers: 890000, url: 'https://instagram.com', engagementRate: 7.9, avgViews: 310000 },
      { platform: 'tiktok', handle: '@camifitiron', followers: 1450000, url: 'https://tiktok.com', engagementRate: 9.4, avgViews: 580000 },
      { platform: 'youtube', handle: '@CamiFitWorkout', followers: 320000, url: 'https://youtube.com', engagementRate: 6.8, avgViews: 145000 }
    ],
    rates: {
      instagramReel: 3200,
      instagramStory: 950,
      tiktokVideo: 3800,
      youtubeDedicated: 6500,
      youtubeIntegration: 3500,
      eventAttendance: 5000
    },
    audience: {
      topCountries: [
        { country: 'Colombia', percentage: 38 },
        { country: 'México', percentage: 24 },
        { country: 'España', percentage: 18 },
        { country: 'Perú', percentage: 12 }
      ],
      genderSplit: { male: 35, female: 63, other: 2 },
      ageGroups: [
        { range: '18-24', percentage: 35 },
        { range: '25-34', percentage: 52 },
        { range: '35+', percentage: 13 }
      ]
    },
    totalFollowers: 2660000,
    avgEngagementRate: 8.1,
    avgReach: 740000,
    availability: 'Disponible',
    status: 'Activo',
    agencyId: 'ag-3',
    tags: ['Fitness', 'Nutrición', 'Suplementos', 'Salud', 'Crossfit'],
    notes: 'Comunidad altamente comprometida con tasas de conversión del 4.2% en links de afiliados de nutrición.',
    createdAt: '2026-02-01T14:30:00Z'
  },
  {
    id: 'cr-4',
    name: 'Diego Arismendi',
    artisticName: 'KronoPixel',
    email: 'krono@kronopixel.gg',
    phone: '+54 11 5678 1234',
    country: 'Argentina',
    city: 'Buenos Aires',
    bio: 'Streamer de esports, caster oficial y analista de videojuegos competitivos. Creador de sketches de humor gamer.',
    category: 'Gaming & Tech',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    socialProfiles: [
      { platform: 'twitch', handle: 'kronopixel', followers: 780000, url: 'https://twitch.tv', engagementRate: 11.2, avgViews: 220000 },
      { platform: 'tiktok', handle: '@kronopixel', followers: 1600000, url: 'https://tiktok.com', engagementRate: 9.8, avgViews: 710000 },
      { platform: 'youtube', handle: '@KronoPixelClips', followers: 910000, url: 'https://youtube.com', engagementRate: 7.3, avgViews: 410000 },
      { platform: 'twitter', handle: '@KronoPixel', followers: 340000, url: 'https://twitter.com', engagementRate: 4.8, avgViews: 90000 }
    ],
    rates: {
      instagramReel: 2800,
      instagramStory: 800,
      tiktokVideo: 3500,
      youtubeDedicated: 7200,
      youtubeIntegration: 3800,
      eventAttendance: 5500
    },
    audience: {
      topCountries: [
        { country: 'Argentina', percentage: 45 },
        { country: 'Chile', percentage: 22 },
        { country: 'Uruguay', percentage: 14 },
        { country: 'España', percentage: 12 }
      ],
      genderSplit: { male: 78, female: 20, other: 2 },
      ageGroups: [
        { range: '18-24', percentage: 60 },
        { range: '25-34', percentage: 32 },
        { range: '35+', percentage: 8 }
      ]
    },
    totalFollowers: 3630000,
    avgEngagementRate: 8.8,
    avgReach: 1100000,
    availability: 'Disponible',
    status: 'Activo',
    agencyId: 'ag-1',
    tags: ['Esports', 'Gaming', 'Twitch', 'Hardware', 'Humor'],
    notes: 'Ideal para patrocinios de periféricos gamer, bebidas energéticas y monitores.',
    createdAt: '2026-02-10T16:00:00Z'
  },
  {
    id: 'cr-5',
    name: 'Lucía Fernández Ramos',
    artisticName: 'Lucien Beauty Lab',
    email: 'contacto@lucienbeauty.es',
    phone: '+34 93 211 4455',
    country: 'España',
    city: 'Madrid',
    bio: 'Dermatóloga y divulgadora científica de cosmética, skincare, maquillaje editorial y rutinas limpias sin tóxicos.',
    category: 'Belleza & Cuidado Personal',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    socialProfiles: [
      { platform: 'instagram', handle: '@lucienbeautylab', followers: 920000, url: 'https://instagram.com', engagementRate: 8.4, avgViews: 410000 },
      { platform: 'tiktok', handle: '@lucienbeauty', followers: 1350000, url: 'https://tiktok.com', engagementRate: 10.1, avgViews: 690000 },
      { platform: 'youtube', handle: '@LucienSkincareLab', followers: 510000, url: 'https://youtube.com', engagementRate: 7.9, avgViews: 280000 }
    ],
    rates: {
      instagramReel: 4200,
      instagramStory: 1300,
      tiktokVideo: 4800,
      youtubeDedicated: 8900,
      youtubeIntegration: 4900,
      eventAttendance: 6500
    },
    audience: {
      topCountries: [
        { country: 'España', percentage: 48 },
        { country: 'México', percentage: 26 },
        { country: 'Colombia', percentage: 14 },
        { country: 'Chile', percentage: 8 }
      ],
      genderSplit: { male: 12, female: 86, other: 2 },
      ageGroups: [
        { range: '18-24', percentage: 30 },
        { range: '25-34', percentage: 54 },
        { range: '35+', percentage: 16 }
      ]
    },
    totalFollowers: 2780000,
    avgEngagementRate: 8.8,
    avgReach: 890000,
    availability: 'Disponible',
    status: 'Activo',
    agencyId: 'ag-2',
    tags: ['Skincare', 'Belleza', 'Dermatología', 'Ciencia', 'Maquillaje'],
    notes: 'Exige revisión previa de fórmulas cosméticas antes de aceptar campañas. Máxima credibilidad del sector.',
    createdAt: '2026-02-18T10:15:00Z'
  },
  {
    id: 'cr-6',
    name: 'Mateo & Sofía Wander',
    artisticName: 'DosEnRuta',
    email: 'contacto@dosenruta.travel',
    phone: '+52 55 9988 7766',
    country: 'México',
    city: 'Cancún',
    bio: 'Pareja viajera y documentalistas de experiencias exóticas, hoteles boutique, gastronomía de autor y turismo sostenible.',
    category: 'Viajes & Aventura',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    socialProfiles: [
      { platform: 'instagram', handle: '@dosenruta', followers: 780000, url: 'https://instagram.com', engagementRate: 7.2, avgViews: 320000 },
      { platform: 'youtube', handle: '@DosEnRutaExpediciones', followers: 850000, url: 'https://youtube.com', engagementRate: 8.5, avgViews: 540000 },
      { platform: 'tiktok', handle: '@dosenruta_oficial', followers: 690000, url: 'https://tiktok.com', engagementRate: 6.9, avgViews: 290000 }
    ],
    rates: {
      instagramReel: 3600,
      instagramStory: 1100,
      tiktokVideo: 3400,
      youtubeDedicated: 7800,
      youtubeIntegration: 4200,
      eventAttendance: 5000
    },
    audience: {
      topCountries: [
        { country: 'México', percentage: 40 },
        { country: 'España', percentage: 22 },
        { country: 'Estados Unidos', percentage: 20 },
        { country: 'Argentina', percentage: 12 }
      ],
      genderSplit: { male: 42, female: 56, other: 2 },
      ageGroups: [
        { range: '18-24', percentage: 25 },
        { range: '25-34', percentage: 55 },
        { range: '35+', percentage: 20 }
      ]
    },
    totalFollowers: 2320000,
    avgEngagementRate: 7.5,
    avgReach: 790000,
    availability: 'Disponible',
    status: 'Activo',
    agencyId: 'ag-1',
    tags: ['Viajes', 'Aventura', 'Hotelería', 'Gastronomía', 'Drones'],
    notes: 'Cuentan con equipo de drones y cámaras RED. Entregan material en 4K HDR para derechos de uso publicitario.',
    createdAt: '2026-03-02T13:40:00Z'
  }
];

export const initialBrands: Brand[] = [
  {
    id: 'br-1',
    name: 'CyberPulse Audio & Wearables',
    logo: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=150&auto=format&fit=crop&q=80',
    industry: 'Tecnología y Audio',
    country: 'Estados Unidos',
    contactName: 'Marcus Vance',
    email: 'm.vance@cyberpulse.tech',
    phone: '+1 415 555 0192',
    website: 'https://cyberpulse.tech',
    estimatedBudget: 120000,
    accountManager: 'Alejandro Morales',
    status: 'Cliente activo',
    campaignsCount: 4,
    notes: 'Marca de auriculares inalámbricos con cancelación de ruido híbrida y DAC Hi-Res para creadores y streamers.',
    createdAt: '2026-01-12T09:00:00Z'
  },
  {
    id: 'br-2',
    name: 'Luminary Skincare Lab',
    logo: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=150&auto=format&fit=crop&q=80',
    industry: 'Cosmética y Cuidado Personal',
    country: 'Francia',
    contactName: 'Chloé Dubois',
    email: 'chloe.dubois@luminaryskin.fr',
    phone: '+33 1 42 68 55 00',
    website: 'https://luminaryskin.fr',
    estimatedBudget: 85000,
    accountManager: 'Elena De La Torre',
    status: 'Cliente activo',
    campaignsCount: 3,
    notes: 'Línea de sueros antiedad y cremas hidratantes con péptidos marinos sustentables. Campañas con foco en dermatólogas.',
    createdAt: '2026-01-25T11:20:00Z'
  },
  {
    id: 'br-3',
    name: 'NovaVolt Energy & Nutrition',
    logo: 'https://images.unsplash.com/photo-1622484216853-f77b73c4d7b2?w=150&auto=format&fit=crop&q=80',
    industry: 'Bebidas y Nutrición Deportiva',
    country: 'México',
    contactName: 'Santiago Herrero',
    email: 'santiago@novavolt.mx',
    phone: '+52 55 8765 4321',
    website: 'https://novavoltenergy.com',
    estimatedBudget: 95000,
    accountManager: 'Mateo Roldán',
    status: 'Cliente activo',
    campaignsCount: 5,
    notes: 'Bebidas isotónicas sin azúcar con electrolitos y nootrópicos naturales para concentración gamer y rendimiento fitness.',
    createdAt: '2026-02-05T14:00:00Z'
  },
  {
    id: 'br-4',
    name: 'Aetheria Streetwear Syndicate',
    logo: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=150&auto=format&fit=crop&q=80',
    industry: 'Moda y Lifestyle',
    country: 'España',
    contactName: 'Marta Solano',
    email: 'marta@aetheriabrand.com',
    phone: '+34 91 320 8910',
    website: 'https://aetheriabrand.com',
    estimatedBudget: 60000,
    accountManager: 'Elena De La Torre',
    status: 'Negociación',
    campaignsCount: 2,
    notes: 'Prendas sostenibles de corte oversized inspiradas en arquitectura brutalista y futurismo.',
    createdAt: '2026-02-14T16:45:00Z'
  },
  {
    id: 'br-5',
    name: 'Skyward Expeditions & Resorts',
    logo: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=150&auto=format&fit=crop&q=80',
    industry: 'Turismo y Hospitalidad',
    country: 'Costa Rica',
    contactName: 'Daniel Alvarado',
    email: 'dalvarado@skywardresorts.com',
    phone: '+506 2200 4500',
    website: 'https://skywardresorts.com',
    estimatedBudget: 110000,
    accountManager: 'Alejandro Morales',
    status: 'Prospecto',
    campaignsCount: 1,
    notes: 'Cadena de eco-lodges de lujo en Costa Rica, Colombia y México orientada a nómadas digitales y lunas de miel.',
    createdAt: '2026-03-05T09:30:00Z'
  }
];

export const initialCampaigns: Campaign[] = [
  {
    id: 'cp-1',
    name: 'CyberPulse Titan Wireless — Global Launch',
    brandId: 'br-1',
    brandName: 'CyberPulse Audio & Wearables',
    agencyId: 'ag-1',
    agencyName: 'Vyral Next Media Group',
    description: 'Lanzamiento masivo de los auriculares estrella CyberPulse Titan con audio espacial, latencia ultra-baja y cancelación inteligente.',
    objectives: 'Generar 15M de impresiones, posicionar el producto como el estándar gamer/tech en Latam y España, y lograr 40K clics a la preventa.',
    budget: 45000,
    spentBudget: 32500,
    startDate: '2026-03-01',
    endDate: '2026-04-15',
    platforms: ['YouTube', 'Instagram', 'TikTok', 'Twitch'],
    creatorIds: ['cr-1', 'cr-4'],
    deliverables: [
      {
        id: 'del-101',
        creatorId: 'cr-1',
        creatorName: 'Valeria CyberGlow',
        type: 'YouTube Video Dedicado 4K',
        quantity: 1,
        dueDate: '2026-03-12',
        status: 'Publicado',
        publishUrl: 'https://youtube.com/watch?v=demo-cyberpulse'
      },
      {
        id: 'del-102',
        creatorId: 'cr-1',
        creatorName: 'Valeria CyberGlow',
        type: 'Instagram Reels & Stories',
        quantity: 2,
        dueDate: '2026-03-18',
        status: 'Publicado',
        publishUrl: 'https://instagram.com/reel/demo-glow'
      },
      {
        id: 'del-103',
        creatorId: 'cr-4',
        creatorName: 'KronoPixel',
        type: 'Twitch Stream Sponsor & TikTok Clíp',
        quantity: 3,
        dueDate: '2026-03-25',
        status: 'En producción'
      }
    ],
    managerName: 'Alejandro Morales',
    status: 'En ejecución',
    metrics: {
      impressions: 8940000,
      reach: 5200000,
      engagements: 742000,
      clicks: 34100,
      conversions: 2480,
      roi: 3.8
    },
    createdAt: '2026-02-15T10:00:00Z'
  },
  {
    id: 'cp-2',
    name: 'Luminary Oceanic Radiance Serum — Spring Campaign',
    brandId: 'br-2',
    brandName: 'Luminary Skincare Lab',
    agencyId: 'ag-2',
    agencyName: 'HyperNova Talent Agency',
    description: 'Campaña científica de educación dermocosmética sobre barrera cutánea con dermatólogas e influencers de skincare certificado.',
    objectives: 'Fomentar confianza clínica en la formulación marina, conseguir 8M de reproducciones en TikTok e Instagram Reels.',
    budget: 35000,
    spentBudget: 28000,
    startDate: '2026-03-10',
    endDate: '2026-04-20',
    platforms: ['Instagram', 'TikTok', 'YouTube'],
    creatorIds: ['cr-5'],
    deliverables: [
      {
        id: 'del-201',
        creatorId: 'cr-5',
        creatorName: 'Lucien Beauty Lab',
        type: 'TikTok Demostración con microscopio de piel',
        quantity: 2,
        dueDate: '2026-03-15',
        status: 'Publicado',
        publishUrl: 'https://tiktok.com/@demo-luminary'
      },
      {
        id: 'del-202',
        creatorId: 'cr-5',
        creatorName: 'Lucien Beauty Lab',
        type: 'YouTube Deep Dive Rutina Skincare',
        quantity: 1,
        dueDate: '2026-03-28',
        status: 'En revisión'
      }
    ],
    managerName: 'Elena De La Torre',
    status: 'En ejecución',
    metrics: {
      impressions: 4850000,
      reach: 3100000,
      engagements: 430000,
      clicks: 19800,
      conversions: 1840,
      roi: 4.1
    },
    createdAt: '2026-02-28T14:00:00Z'
  },
  {
    id: 'cp-3',
    name: 'NovaVolt Focus Rush — Gamer & CrossFit Activation',
    brandId: 'br-3',
    brandName: 'NovaVolt Energy & Nutrition',
    agencyId: 'ag-3',
    agencyName: 'Apex Influence Latam',
    description: 'Posicionamiento de la bebida energética sin azúcar para maratones de entrenamiento físico y sesiones intensas de stream.',
    objectives: 'Crecimiento de share of voice en TikTok en jóvenes 18-30 años y generación de contenido generado por usuarios con hashtag challenge.',
    budget: 42000,
    spentBudget: 15000,
    startDate: '2026-03-20',
    endDate: '2026-05-10',
    platforms: ['TikTok', 'Instagram', 'Twitch'],
    creatorIds: ['cr-3', 'cr-4'],
    deliverables: [
      {
        id: 'del-301',
        creatorId: 'cr-3',
        creatorName: 'CamiFit Iron',
        type: 'Instagram Reels Rutina HIIT + Bebida',
        quantity: 3,
        dueDate: '2026-03-29',
        status: 'Aprobado'
      },
      {
        id: 'del-302',
        creatorId: 'cr-4',
        creatorName: 'KronoPixel',
        type: 'Twitch Overlay & Desafío en vivo',
        quantity: 2,
        dueDate: '2026-04-05',
        status: 'En producción'
      }
    ],
    managerName: 'Mateo Roldán',
    status: 'Planificación',
    metrics: {
      impressions: 1200000,
      reach: 890000,
      engagements: 98000,
      clicks: 5400,
      conversions: 320,
      roi: 2.9
    },
    createdAt: '2026-03-08T11:30:00Z'
  },
  {
    id: 'cp-4',
    name: 'Aetheria Brutalist Capsule — Autumn Showcase',
    brandId: 'br-4',
    brandName: 'Aetheria Streetwear Syndicate',
    agencyId: 'ag-1',
    agencyName: 'Vyral Next Media Group',
    description: 'Exposición fotográfica y reels cinematográficos presentando la nueva colección de sudaderas y pantalones técnicos.',
    objectives: 'Consolidar la marca en comunidades de moda alternativa y elevar el ticket promedio mediante códigos promocionales exclusivos.',
    budget: 28000,
    spentBudget: 28000,
    startDate: '2026-01-10',
    endDate: '2026-02-28',
    platforms: ['Instagram', 'TikTok'],
    creatorIds: ['cr-2'],
    deliverables: [
      {
        id: 'del-401',
        creatorId: 'cr-2',
        creatorName: 'SebaVibes',
        type: 'Lookbook Editorial Video 4K & 4 Fotos',
        quantity: 1,
        dueDate: '2026-01-28',
        status: 'Publicado',
        publishUrl: 'https://instagram.com/reel/demo-aetheria'
      }
    ],
    managerName: 'Alejandro Morales',
    status: 'Finalizada',
    metrics: {
      impressions: 5600000,
      reach: 3900000,
      engagements: 480000,
      clicks: 28500,
      conversions: 3100,
      roi: 4.8
    },
    createdAt: '2026-01-05T09:00:00Z'
  }
];

export const initialCollaborations: Collaboration[] = [
  {
    id: 'col-1',
    campaignId: 'cp-1',
    campaignName: 'CyberPulse Titan Wireless — Global Launch',
    brandId: 'br-1',
    brandName: 'CyberPulse Audio & Wearables',
    creatorId: 'cr-1',
    creatorName: 'Valeria Castro Ruiz',
    creatorArtisticName: 'Valeria CyberGlow',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    proposalDetails: 'Review a fondo del producto en YouTube con prueba de audio binaural y un Reel dinámico mostrando el setup.',
    agreedFee: 12500,
    deliverablesText: '1x YouTube Integración 90s + 2x Instagram Reels + 3x Stories con swipe-up',
    publicationDate: '2026-03-15',
    status: 'Publicada',
    notes: 'Resultados superaron el KPI inicial por un 140% en reproducciones y retención.',
    linkReview: 'https://youtube.com/watch?v=valeria-titan-review',
    createdAt: '2026-02-20T11:00:00Z'
  },
  {
    id: 'col-2',
    campaignId: 'cp-1',
    campaignName: 'CyberPulse Titan Wireless — Global Launch',
    brandId: 'br-1',
    brandName: 'CyberPulse Audio & Wearables',
    creatorId: 'cr-4',
    creatorName: 'Diego Arismendi',
    creatorArtisticName: 'KronoPixel',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    proposalDetails: 'Uso en directo de los auriculares durante el torneo de Valorant en Twitch y clip resumen en TikTok con humor.',
    agreedFee: 7800,
    deliverablesText: '2x Menciones patrocinadas en Twitch de 4 horas + 1x TikTok Clíp cómico',
    publicationDate: '2026-03-25',
    status: 'En producción',
    notes: 'Producto ya entregado en domicilio en Buenos Aires. Esperando guion final.',
    createdAt: '2026-02-22T15:30:00Z'
  },
  {
    id: 'col-3',
    campaignId: 'cp-2',
    campaignName: 'Luminary Oceanic Radiance Serum — Spring Campaign',
    brandId: 'br-2',
    brandName: 'Luminary Skincare Lab',
    creatorId: 'cr-5',
    creatorName: 'Lucía Fernández Ramos',
    creatorArtisticName: 'Lucien Beauty Lab',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    proposalDetails: 'Desglose clínico de los ingredientes marinos y prueba del sérum ante luz polarizada para demostrar hidratación.',
    agreedFee: 11000,
    deliverablesText: '1x YouTube Análisis dermatológico + 2x TikToks de rutina diaria',
    publicationDate: '2026-03-28',
    status: 'En negociación',
    notes: 'La creadora solicitó ajustes en los reclamos cosméticos para cumplir normativa sanitaria europea.',
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'col-4',
    campaignId: 'cp-3',
    campaignName: 'NovaVolt Focus Rush — Gamer & CrossFit Activation',
    brandId: 'br-3',
    brandName: 'NovaVolt Energy & Nutrition',
    creatorId: 'cr-3',
    creatorName: 'Camila Montoya',
    creatorArtisticName: 'CamiFit Iron',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    proposalDetails: 'Entrenamiento de fuerza en vivo en Instagram con botellero térmico de NovaVolt y sorteo de 3 packs anuales.',
    agreedFee: 6500,
    deliverablesText: '2x Reels HIIT + 1x Carrusel explicativo de ingredientes y cafeína natural',
    publicationDate: '2026-04-02',
    status: 'Aprobada',
    notes: 'Contrato firmado por ambas partes el 10 de marzo.',
    createdAt: '2026-03-05T12:00:00Z'
  },
  {
    id: 'col-5',
    campaignId: 'cp-4',
    campaignName: 'Aetheria Brutalist Capsule — Autumn Showcase',
    brandId: 'br-4',
    brandName: 'Aetheria Streetwear Syndicate',
    creatorId: 'cr-2',
    creatorName: 'Sebastián Morales',
    creatorArtisticName: 'SebaVibes',
    creatorAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80',
    proposalDetails: 'Sesión cinematográfica urbana en Tokyo y CDMX mostrando la versatilidad climática de las prendas.',
    agreedFee: 14000,
    deliverablesText: '1x Video Cine 4K Reels + 5x Fotos alta resolución para catálogo',
    publicationDate: '2026-02-14',
    status: 'Completada',
    notes: 'Campaña cerrada con felicitaciones del cliente por el impacto estético.',
    linkReview: 'https://instagram.com/reel/demo-seba-aetheria',
    createdAt: '2026-01-10T14:00:00Z'
  }
];

export const initialCalendarEvents: CalendarEvent[] = [
  {
    id: 'ev-1',
    title: 'Publicación: YouTube Review CyberPulse Titan',
    description: 'Valeria CyberGlow publica el video oficial con enlaces trackeados de afiliados.',
    eventType: 'entrega_contenido',
    startDate: '2026-03-24T18:00:00Z',
    endDate: '2026-03-24T19:00:00Z',
    relatedType: 'Campaign',
    relatedId: 'cp-1',
    allDay: false,
    color: '#22D3EE',
    createdAt: '2026-03-01T08:00:00Z'
  },
  {
    id: 'ev-2',
    title: 'Reunión de alineación: Luminary Skincare Q2',
    description: 'Revisión de guiones de Lucrecia y aprobación de mockups de envases.',
    eventType: 'reunión',
    startDate: '2026-03-26T15:30:00Z',
    endDate: '2026-03-26T16:30:00Z',
    relatedType: 'Brand',
    relatedId: 'br-2',
    allDay: false,
    color: '#8B5CF6',
    createdAt: '2026-03-02T10:00:00Z'
  },
  {
    id: 'ev-3',
    title: 'Vencimiento Pago: CyberPulse Primera Cuota',
    description: 'Transferencia programada de la marca CyberPulse por $22,500 USD.',
    eventType: 'fecha_pago',
    startDate: '2026-03-30T09:00:00Z',
    endDate: '2026-03-30T10:00:00Z',
    relatedType: 'Payment',
    relatedId: 'pay-1',
    allDay: true,
    color: '#10B981',
    createdAt: '2026-03-05T11:00:00Z'
  },
  {
    id: 'ev-4',
    title: 'Twitch Sponsor Stream: KronoPixel x NovaVolt',
    description: 'Torneo de 4 horas con overlay patrocinado e interactivo de la bebida energizante.',
    eventType: 'campaña',
    startDate: '2026-04-05T20:00:00Z',
    endDate: '2026-04-06T00:00:00Z',
    relatedType: 'Campaign',
    relatedId: 'cp-3',
    allDay: false,
    color: '#F59E0B',
    createdAt: '2026-03-10T14:00:00Z'
  },
  {
    id: 'ev-5',
    title: 'Vencimiento Contrato: Exclusividad SebaVibes',
    description: 'Renovación o cese del acuerdo de representación de Sebastián Morales.',
    eventType: 'vencimiento_contrato',
    startDate: '2026-04-18T10:00:00Z',
    endDate: '2026-04-18T11:00:00Z',
    relatedType: 'Contract',
    relatedId: 'ct-2',
    allDay: true,
    color: '#EF4444',
    createdAt: '2026-03-12T09:00:00Z'
  }
];

export const initialPipelineDeals: PipelineDeal[] = [
  {
    id: 'dl-1',
    title: 'Campaña Global Verano 2026 — Skyward Resorts',
    brandId: 'br-5',
    brandName: 'Skyward Expeditions & Resorts',
    contactName: 'Daniel Alvarado',
    contactEmail: 'dalvarado@skywardresorts.com',
    dealValue: 75000,
    probability: 40,
    expectedCloseDate: '2026-04-10',
    stage: 'primer_contacto',
    owner: 'Alejandro Morales',
    source: 'Referido comercial',
    notes: 'Buscan 6 creadores de viajes y fotografía para tours en resorts de Costa Rica y Tulum.',
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'dl-2',
    title: 'Lanzamiento Colección Streetwear Fall/Winter',
    brandId: 'br-4',
    brandName: 'Aetheria Streetwear Syndicate',
    contactName: 'Marta Solano',
    contactEmail: 'marta@aetheriabrand.com',
    dealValue: 45000,
    probability: 70,
    expectedCloseDate: '2026-04-02',
    stage: 'negociacion',
    owner: 'Elena De La Torre',
    source: 'Cliente recurrente',
    notes: 'Propuesta enviada por $45K. Solicitan incluir 2 influencers adicionales de TikTok España.',
    createdAt: '2026-02-25T14:30:00Z'
  },
  {
    id: 'dl-3',
    title: 'Sponsorship Anual Esports Series — CyberPulse',
    brandId: 'br-1',
    brandName: 'CyberPulse Audio & Wearables',
    contactName: 'Marcus Vance',
    contactEmail: 'm.vance@cyberpulse.tech',
    dealValue: 180000,
    probability: 90,
    expectedCloseDate: '2026-03-28',
    stage: 'propuesta_enviada',
    owner: 'Alejandro Morales',
    source: 'Inbound comercial',
    notes: 'Contrato marco para patrocinios mensuales durante todo el año 2026.',
    createdAt: '2026-02-18T16:00:00Z'
  },
  {
    id: 'dl-4',
    title: 'Activación Fitness & Suplementos — ProAthletics Labs',
    brandId: 'br-3',
    brandName: 'NovaVolt Energy & Nutrition',
    contactName: 'Santiago Herrero',
    contactEmail: 'santiago@novavolt.mx',
    dealValue: 52000,
    probability: 100,
    expectedCloseDate: '2026-03-15',
    stage: 'ganado',
    owner: 'Mateo Roldán',
    source: 'Networking evento',
    notes: 'Ganado. Contrato firmado y anticipo del 50% depositado.',
    createdAt: '2026-02-10T12:00:00Z'
  },
  {
    id: 'dl-5',
    title: 'Expansión Mercado Mexicano — Nordic Clean Drink',
    brandId: 'br-3',
    brandName: 'Nordic Organic Beverages',
    contactName: 'Freja Lindqvist',
    contactEmail: 'freja@nordicclean.se',
    dealValue: 30000,
    probability: 25,
    expectedCloseDate: '2026-04-30',
    stage: 'nuevo_prospecto',
    owner: 'Mateo Roldán',
    source: 'Campaña LinkedIn',
    notes: 'Interés inicial tras webinar de ROI de influencer marketing.',
    createdAt: '2026-03-08T09:00:00Z'
  }
];

export const initialContracts: Contract[] = [
  {
    id: 'ct-1',
    title: 'Acuerdo de Patrocinio CyberPulse Titan Launch',
    contractType: 'Patrocinio de marca',
    partyType: 'Marca',
    partyId: 'br-1',
    partyName: 'CyberPulse Audio & Wearables',
    status: 'Firmado',
    value: 45000,
    startDate: '2026-03-01',
    endDate: '2026-04-30',
    fileName: 'Contrato_CyberPulse_Titan_2026.pdf',
    fileSize: '2.4 MB',
    notes: 'Cláusula de exclusividad en categoría audio durante el periodo activo.',
    createdAt: '2026-02-28T11:00:00Z'
  },
  {
    id: 'ct-2',
    title: 'Contrato de Representación Exclusiva — SebaVibes',
    contractType: 'Representación de creador',
    partyType: 'Creador',
    partyId: 'cr-2',
    partyName: 'Sebastián Morales (SebaVibes)',
    status: 'Firmado',
    value: 120000,
    startDate: '2025-04-18',
    endDate: '2026-04-18',
    fileName: 'Representacion_SebaVibes_2025_2026.pdf',
    fileSize: '1.8 MB',
    notes: 'Comisión de agencia estipulada al 20% sobre facturación bruta de marcas.',
    createdAt: '2025-04-15T09:00:00Z'
  },
  {
    id: 'ct-3',
    title: 'Acuerdo Marco Confidencialidad (NDA) — Skyward Resorts',
    contractType: 'Acuerdo de confidencialidad (NDA)',
    partyType: 'Marca',
    partyId: 'br-5',
    partyName: 'Skyward Expeditions & Resorts',
    status: 'En revisión',
    value: 0,
    startDate: '2026-03-10',
    endDate: '2027-03-10',
    fileName: 'NDA_Skyward_Resorts_VYRALEXX.pdf',
    fileSize: '850 KB',
    notes: 'Revisión por departamento legal previa al envío de cotizaciones detalladas.',
    createdAt: '2026-03-09T15:00:00Z'
  },
  {
    id: 'ct-4',
    title: 'Acuerdo de Servicios de Contenido — Luminary Skincare',
    contractType: 'Servicios de agencia',
    partyType: 'Marca',
    partyId: 'br-2',
    partyName: 'Luminary Skincare Lab',
    status: 'Firmado',
    value: 35000,
    startDate: '2026-03-01',
    endDate: '2026-05-01',
    fileName: 'Contrato_Luminary_Oceanic_2026.pdf',
    fileSize: '3.1 MB',
    notes: 'Incluye derechos de pauta digital paga (whitelisting) por 90 días.',
    createdAt: '2026-02-26T14:00:00Z'
  }
];

export const initialPayments: PaymentRecord[] = [
  {
    id: 'pay-1',
    invoiceNumber: 'INV-2026-0042',
    concept: 'Anticipo 50% Campaña CyberPulse Titan Launch',
    entityType: 'Marca',
    entityId: 'br-1',
    entityName: 'CyberPulse Audio & Wearables',
    campaignId: 'cp-1',
    campaignName: 'CyberPulse Titan Wireless — Global Launch',
    amount: 22500,
    type: 'Cobro',
    status: 'Pagado',
    issueDate: '2026-03-01',
    dueDate: '2026-03-15',
    paidDate: '2026-03-12',
    paymentMethod: 'Transferencia SWIFT / Wire',
    notes: 'Comprobante de banco recibido y verificado.',
    createdAt: '2026-03-01T10:00:00Z'
  },
  {
    id: 'pay-2',
    invoiceNumber: 'INV-2026-0043',
    concept: 'Honorarios YouTube Video Review — Valeria CyberGlow',
    entityType: 'Creador',
    entityId: 'cr-1',
    entityName: 'Valeria Castro Ruiz',
    campaignId: 'cp-1',
    campaignName: 'CyberPulse Titan Wireless — Global Launch',
    amount: 12500,
    type: 'Pago',
    status: 'Pendiente',
    issueDate: '2026-03-16',
    dueDate: '2026-03-30',
    paymentMethod: 'Transferencia Bancaria SEPA',
    notes: 'Pago condicionado a la entrega del informe de métricas de las primeras 72 horas.',
    createdAt: '2026-03-16T11:00:00Z'
  },
  {
    id: 'pay-3',
    invoiceNumber: 'INV-2026-0038',
    concept: 'Liquidación Total Campaña Aetheria Streetwear',
    entityType: 'Marca',
    entityId: 'br-4',
    entityName: 'Aetheria Streetwear Syndicate',
    campaignId: 'cp-4',
    campaignName: 'Aetheria Brutalist Capsule — Autumn Showcase',
    amount: 28000,
    type: 'Cobro',
    status: 'Pagado',
    issueDate: '2026-01-15',
    dueDate: '2026-02-15',
    paidDate: '2026-02-10',
    paymentMethod: 'Transferencia SEPA',
    notes: 'Liquidado en su totalidad con bonus por conversión adicional.',
    createdAt: '2026-01-15T09:00:00Z'
  },
  {
    id: 'pay-4',
    invoiceNumber: 'INV-2026-0045',
    concept: 'Primer Pago Campaña NovaVolt Energy Activation',
    entityType: 'Marca',
    entityId: 'br-3',
    entityName: 'NovaVolt Energy & Nutrition',
    campaignId: 'cp-3',
    campaignName: 'NovaVolt Focus Rush — Gamer & CrossFit Activation',
    amount: 21000,
    type: 'Cobro',
    status: 'Pendiente',
    issueDate: '2026-03-10',
    dueDate: '2026-03-28',
    paymentMethod: 'SPEI México',
    notes: 'Recordatorio enviado al departamento contable el 20 de marzo.',
    createdAt: '2026-03-10T15:00:00Z'
  },
  {
    id: 'pay-5',
    invoiceNumber: 'INV-2026-0046',
    concept: 'Pago Creadora CamiFit Iron — Anticipo Campaña',
    entityType: 'Creador',
    entityId: 'cr-3',
    entityName: 'Camila Montoya',
    campaignId: 'cp-3',
    campaignName: 'NovaVolt Focus Rush — Gamer & CrossFit Activation',
    amount: 3250,
    type: 'Pago',
    status: 'Pagado',
    issueDate: '2026-03-11',
    dueDate: '2026-03-20',
    paidDate: '2026-03-18',
    paymentMethod: 'PayPal / Wise',
    notes: '50% de anticipo entregado.',
    createdAt: '2026-03-11T16:00:00Z'
  }
];

export const initialTasks: Task[] = [
  {
    id: 'tsk-1',
    title: 'Revisión final de guion y planos para YouTube CyberPulse',
    description: 'Comprobar que Valeria menciona el código VYRAL15 y muestra la app complementaria.',
    assignee: 'Alejandro Morales',
    priority: 'Alta',
    status: 'completada',
    dueDate: '2026-03-11',
    campaignId: 'cp-1',
    campaignName: 'CyberPulse Titan Wireless — Global Launch',
    completedAt: '2026-03-11T18:00:00Z',
    createdAt: '2026-03-08T10:00:00Z'
  },
  {
    id: 'tsk-2',
    title: 'Enviar muestras de producto NovaVolt a domicilio de KronoPixel',
    description: 'Coordinar envío exprés a Buenos Aires con 12 latas de Focus Rush sabor Arándano Eléctrico.',
    assignee: 'Mateo Roldán',
    priority: 'Media',
    status: 'en_progreso',
    dueDate: '2026-03-25',
    campaignId: 'cp-3',
    campaignName: 'NovaVolt Focus Rush — Gamer & CrossFit Activation',
    createdAt: '2026-03-12T11:00:00Z'
  },
  {
    id: 'tsk-3',
    title: 'Preparar reporte quincenal en PDF para directorio de Luminary',
    description: 'Consolidar impresiones de TikTok, CTR de enlaces y engagement rate de los videos de Lucrecia.',
    assignee: 'Elena De La Torre',
    priority: 'Alta',
    status: 'por_hacer',
    dueDate: '2026-03-27',
    campaignId: 'cp-2',
    campaignName: 'Luminary Oceanic Radiance Serum — Spring Campaign',
    createdAt: '2026-03-14T14:00:00Z'
  },
  {
    id: 'tsk-4',
    title: 'Actualizar tarifas de creadores en base a métricas de febrero',
    description: 'Revisar CPMs de Valeria y CamiFit tras el incremento del 15% en followers.',
    assignee: 'Alejandro Morales',
    priority: 'Baja',
    status: 'por_hacer',
    dueDate: '2026-04-01',
    createdAt: '2026-03-15T09:00:00Z'
  },
  {
    id: 'tsk-5',
    title: 'Redactar borrador de adenda para exclusividad con SebaVibes',
    description: 'Ampliar el acuerdo de representación por 12 meses con bono por desempeño.',
    assignee: 'Elena De La Torre',
    priority: 'Alta',
    status: 'en_revision',
    dueDate: '2026-03-29',
    createdAt: '2026-03-16T12:00:00Z'
  }
];

export const initialMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    channelId: 'general',
    senderName: 'Alejandro Morales',
    senderRole: 'Superadministrador',
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    message: '¡Equipo! El video review de Valeria para CyberPulse superó las 350K vistas en las primeras 24 horas. El cliente está encantado.',
    timestamp: '2026-03-22T10:15:00Z',
    isInternal: true
  },
  {
    id: 'msg-2',
    channelId: 'general',
    senderName: 'Elena De La Torre',
    senderRole: 'Directora de Cuentas',
    senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    message: 'Excelente noticia. Además, los reportes de Luminary ya están en un 80% listos para la exportación ejecutiva.',
    timestamp: '2026-03-22T10:20:00Z',
    isInternal: true
  },
  {
    id: 'msg-3',
    channelId: 'general',
    senderName: 'Mateo Roldán',
    senderRole: 'Líder Latam',
    senderAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    message: 'Ya despachamos el stock promocional para KronoPixel en Argentina. Debería llegar el miércoles a tiempo para el stream.',
    timestamp: '2026-03-22T11:05:00Z',
    isInternal: true
  }
];

export const initialFiles: MediaFile[] = [
  {
    id: 'fl-1',
    name: 'MediaKit_Oficial_ValeriaGlow_2026.pdf',
    category: 'Media Kits',
    size: '8.4 MB',
    fileType: 'PDF',
    url: '#',
    uploadedBy: 'Valeria Castro',
    relatedCampaign: 'CyberPulse Titan Wireless',
    createdAt: '2026-02-10T10:00:00Z'
  },
  {
    id: 'fl-2',
    name: 'CyberPulse_Titan_BrandBook_AssetPack.zip',
    category: 'Creativos',
    size: '142 MB',
    fileType: 'ZIP',
    url: '#',
    uploadedBy: 'Marcus Vance',
    relatedCampaign: 'CyberPulse Titan Wireless',
    createdAt: '2026-02-15T12:00:00Z'
  },
  {
    id: 'fl-3',
    name: 'Reporte_Q1_Resultados_Campanas_VYRALEXX.pdf',
    category: 'Reportes',
    size: '4.2 MB',
    fileType: 'PDF',
    url: '#',
    uploadedBy: 'Elena De La Torre',
    createdAt: '2026-03-15T16:00:00Z'
  },
  {
    id: 'fl-4',
    name: 'Factura_INV_2026_0042_CyberPulse.pdf',
    category: 'Facturas',
    size: '340 KB',
    fileType: 'PDF',
    url: '#',
    uploadedBy: 'Alejandro Morales',
    createdAt: '2026-03-01T10:30:00Z'
  }
];

export const initialNotifications: SystemNotification[] = [
  {
    id: 'notif-1',
    title: 'Nuevo entregable publicado',
    message: 'Valeria CyberGlow publicó el Instagram Reel acordado para CyberPulse Titan.',
    type: 'exito',
    read: false,
    link: '/campaigns',
    createdAt: '2026-03-23T08:30:00Z'
  },
  {
    id: 'notif-2',
    title: 'Vencimiento de pago próximo',
    message: 'La factura INV-2026-0045 de NovaVolt por $21,000 USD vence en 5 días.',
    type: 'alerta',
    read: false,
    link: '/payments',
    createdAt: '2026-03-23T07:15:00Z'
  },
  {
    id: 'notif-3',
    title: 'Nueva propuesta en CRM',
    message: 'Skyward Resorts avanzó a etapa de primer contacto por un valor de $75,000 USD.',
    type: 'info',
    read: true,
    link: '/pipeline',
    createdAt: '2026-03-22T14:00:00Z'
  },
  {
    id: 'notif-4',
    title: 'Contrato firmado digitalmente',
    message: 'Luminary Skincare Lab ha firmado el acuerdo de servicios de contenido.',
    type: 'exito',
    read: true,
    link: '/contracts',
    createdAt: '2026-03-21T18:20:00Z'
  }
];

export const initialSettings: SystemSettings = {
  companyName: 'VYRALEXX Global Network Inc.',
  currency: 'USD ($)',
  timezone: 'America/Mexico_City (GMT-6)',
  language: 'Español (ES)',
  notificationsEnabled: true,
  apiIntegrations: {
    instagram: true,
    tiktok: true,
    youtube: true,
    metaAds: false
  }
};
