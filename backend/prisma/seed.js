const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();


function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloatBetween(min, max) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function getRandomElement(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}


const citiesData = [
  { name: 'Mumbai', basePrice: 18000, region: 'Western' },
  { name: 'Delhi', basePrice: 15000, region: 'Northern' },
  { name: 'Bangalore', basePrice: 12000, region: 'Southern' },
  { name: 'Pune', basePrice: 10000, region: 'Western' },
  { name: 'Hyderabad', basePrice: 9000, region: 'Southern' },
  { name: 'Chennai', basePrice: 8500, region: 'Southern' },
  { name: 'Gurgaon', basePrice: 16000, region: 'Northern' },
  { name: 'Noida', basePrice: 11000, region: 'Northern' },
  { name: 'Kolkata', basePrice: 6500, region: 'Eastern' },
  { name: 'Ahmedabad', basePrice: 7000, region: 'Western' },
];


const localityPrefixes = [
  'South', 'North', 'East', 'West', 'Central',
  'New', 'Old', 'Greater', 'Near', 'Around'
];

const localitySuffixes = [
  'Park', 'View', 'Garden', 'Colony', 'Heights',
  'Heights', 'Enclave', 'Nagar', 'Vihar', 'Extension',
  'Sector', 'Lane', 'Street', 'Avenue', 'Plaza'
];


const societyPrefixes = [
  'Royal', 'Grand', 'Divine', 'Luxury', 'Premier',
  'Elite', 'Sky', 'Green', 'Silver', 'Golden',
  'Pearl', 'Emerald', 'Sapphire', 'Diamond', 'Platinum'
];

const societySuffixes = [
  'Heights', 'Towers', 'Manor', 'Palace', 'Residency',
  'Apartments', 'Villas', 'Enclave', 'Plaza', 'Gardens'
];


const trendComments = [
  'High demand',
  'Stable market',
  'Growing IT hub',
  'Affordable',
  'Upcoming infrastructure',
  'Excellent connectivity',
  'Rapid development',
  'Investment hotspot',
  'Family-friendly',
  'Commercial hub'
];


function generateLocalityName() {
  const prefix = getRandomElement(localityPrefixes);
  const suffix = getRandomElement(localitySuffixes);
  return `${prefix} ${suffix}`;
}


function generateSocietyName() {
  const prefix = getRandomElement(societyPrefixes);
  const suffix = getRandomElement(societySuffixes);
  return `${prefix} ${suffix}`;
}


function generateHistoricData(basePrice) {
  const historicPrices = [
    { year: 2021, price: Math.round(basePrice * 0.75) },
    { year: 2022, price: Math.round(basePrice * 0.85) },
    { year: 2023, price: Math.round(basePrice * 0.95) },
    { year: 2024, price: Math.round(basePrice) }
  ];
  return historicPrices;
}


async function main() {
  console.log('🌱 Starting database seed...\n');

  try {
    
    await prisma.societyInsight.deleteMany();
    await prisma.localityInsight.deleteMany();
    await prisma.cityInsight.deleteMany();

    console.log('✓ Cleared existing data\n');

    
    console.log('📍 Creating cities...');
    const cityInsertData = citiesData.map((city) => ({
      city: city.name,
      avgPriceSqFt: randomBetween(
        Math.round(city.basePrice * 0.8),
        Math.round(city.basePrice * 1.2)
      ),
      oneYearGrowth: randomFloatBetween(-3.0, 12.0),
      demandIndex: randomBetween(50, 100),
    }));

    const createdCities = await prisma.$transaction(
      cityInsertData.map((data) =>
        prisma.cityInsight.create({ data })
      )
    );

    console.log(`✓ Created ${createdCities.length} cities\n`);

    
    console.log('🏘️  Creating localities...');
    const localitiesPerCity = 4;
    const localityInsertData = [];
    const usedLocalitiesByCity = new Map(); 

    for (const city of createdCities) {
      if (!usedLocalitiesByCity.has(city.city)) {
        usedLocalitiesByCity.set(city.city, new Set());
      }
      const usedSet = usedLocalitiesByCity.get(city.city);
      for (let i = 0; i < localitiesPerCity; i++) {
        let name;
        let attempts = 0;
        do {
          name = generateLocalityName();
          attempts++;
          if (attempts > 10) {
            
            name = `${city.city} Locality ${i + 1}`;
            break;
          }
        } while (usedSet.has(name));
        usedSet.add(name);

        const localityPrice = randomBetween(
          Math.round(city.avgPriceSqFt * 0.75),
          Math.round(city.avgPriceSqFt * 1.25)
        );

        localityInsertData.push({
          city: city.city,
          locality: name,
          avgPriceSqFt: localityPrice,
          oneYearGrowth: randomFloatBetween(-2.0, 9.0),
          trendComment: getRandomElement(trendComments),
        });
      }
    }

    const createdLocalities = await prisma.$transaction(
      localityInsertData.map((data) =>
        prisma.localityInsight.create({ data })
      )
    );

    console.log(`✓ Created ${createdLocalities.length} localities\n`);

    
    console.log('🏢 Creating societies...');
    const societiesPerLocality = 3;
    const societyInsertData = [];
    const usedSocietiesByLocality = new Map(); 

    for (const locality of createdLocalities) {
      const key = `${locality.city}|${locality.locality}`;
      if (!usedSocietiesByLocality.has(key)) {
        usedSocietiesByLocality.set(key, new Set());
      }
      const usedSet = usedSocietiesByLocality.get(key);
      for (let i = 0; i < societiesPerLocality; i++) {
        let societyName;
        let attempts = 0;
        do {
          societyName = generateSocietyName();
          attempts++;
          if (attempts > 10) {
            societyName = `${locality.locality} Society ${i + 1}`;
            break;
          }
        } while (usedSet.has(societyName));
        usedSet.add(societyName);

        const societyPrice = randomBetween(
          Math.round(locality.avgPriceSqFt * 0.8),
          Math.round(locality.avgPriceSqFt * 1.2)
        );

        societyInsertData.push({
          city: locality.city,
          locality: locality.locality,
          society: societyName,
          avgPriceSqFt: societyPrice,
          oneYearGrowth: randomFloatBetween(0, 12.0),
          historicData: generateHistoricData(societyPrice),
        });
      }
    }

    const createdSocieties = await prisma.$transaction(
      societyInsertData.map((data) =>
        prisma.societyInsight.create({ data })
      )
    );

    console.log(`✓ Created ${createdSocieties.length} societies\n`);

    console.log('✅ Database seed completed successfully!\n');
    console.log('📊 Summary:');
    console.log(`   Cities:      ${createdCities.length}`);
    console.log(`   Localities:  ${createdLocalities.length}`);
    console.log(`   Societies:   ${createdSocieties.length}`);
    console.log(`   Total:       ${createdCities.length + createdLocalities.length + createdSocieties.length} records\n`);

    
    console.log('🏗  Seeding sample properties (if none exist)...');
    const existingPropertyCount = await prisma.property.count();
    if (existingPropertyCount === 0) {
      
      let agentUser = await prisma.user.findFirst({ where: { role: 'agent' } });
      if (!agentUser) {
        agentUser = await prisma.user.create({ data: { name: 'Seed Agent', email: `agent_seed_${Date.now()}@example.com`, password: '$2a$10$seedseedseedseedseedseedseedseedseedseedse', role: 'agent' } });
      }

      const sampleProperties = [
        { id: 'MUMSEED1', city: 'Mumbai', locality: 'Bandra', type: '2BHK', price: '1.5Cr', pricePerUnit: 250000, area: '600 sqft', demand: 90, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', description: 'Luxurious 2BHK apartment in prime Bandra location.' },
        { id: 'MUMSEED2', city: 'Mumbai', locality: 'Andheri', type: '1BHK', price: '80L', pricePerUnit: 180000, area: '450 sqft', demand: 85, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', description: 'Cozy 1BHK near Andheri metro station.' },
        { id: 'MUMSEED3', city: 'Mumbai', locality: 'Worli', type: '3BHK', price: '2.5Cr', pricePerUnit: 280000, area: '900 sqft', demand: 95, image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=400', description: 'Sea-facing premium 3BHK in Worli.' },
        { id: 'MUMSEED4', city: 'Mumbai', locality: 'Dadar', type: 'Villa', price: '3Cr', pricePerUnit: 300000, area: '1000 sqft', demand: 80, image: 'https://images.unsplash.com/photo-1516683487411-3606a36ecc64?w=400', description: 'Spacious villa in central Dadar.' },
        { id: 'BLRSEED1', city: 'Bangalore', locality: 'Koramangala', type: '3BHK', price: '2Cr', pricePerUnit: 260000, area: '800 sqft', demand: 88, image: 'https://images.unsplash.com/photo-1516683487411-3606a36ecc64?w=400', description: 'Modern 3BHK in IT hub Koramangala.' },
        { id: 'BLRSEED2', city: 'Bangalore', locality: 'Whitefield', type: '2BHK', price: '1.2Cr', pricePerUnit: 200000, area: '600 sqft', demand: 87, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', description: 'Elegant 2BHK near tech parks.' },
        { id: 'BLRSEED3', city: 'Bangalore', locality: 'Indiranagar', type: '1BHK', price: '70L', pricePerUnit: 160000, area: '440 sqft', demand: 82, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', description: 'Compact 1BHK in vibrant Indiranagar.' },
        { id: 'BLRSEED4', city: 'Bangalore', locality: 'HSR Layout', type: '2BHK', price: '1.1Cr', pricePerUnit: 195000, area: '565 sqft', demand: 86, image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=400', description: 'Well-connected 2BHK in HSR Layout.' },
        { id: 'DELSEED1', city: 'Delhi', locality: 'South Delhi', type: 'Villa', price: '3Cr', pricePerUnit: 300000, area: '1000 sqft', demand: 92, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', description: 'Premium villa in South Delhi.' },
        { id: 'DELSEED2', city: 'Delhi', locality: 'Gurgaon', type: '2BHK', price: '1.8Cr', pricePerUnit: 270000, area: '670 sqft', demand: 89, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', description: 'Corporate hub apartment in Gurgaon.' },
        { id: 'DELSEED3', city: 'Delhi', locality: 'Noida', type: '3BHK', price: '2.2Cr', pricePerUnit: 260000, area: '850 sqft', demand: 88, image: 'https://images.unsplash.com/photo-1516683487411-3606a36ecc64?w=400', description: 'Spacious 3BHK in Noida Expressway.' },
        { id: 'DELSEED4', city: 'Delhi', locality: 'Dwarka', type: '1BHK', price: '60L', pricePerUnit: 150000, area: '400 sqft', demand: 83, image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=400', description: 'Affordable 1BHK near metro.' },
        { id: 'PUNSEED1', city: 'Pune', locality: 'Hinjewadi', type: '2BHK', price: '90L', pricePerUnit: 185000, area: '486 sqft', demand: 87, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', description: 'Tech park vicinity 2BHK apartment.' },
        { id: 'PUNSEED2', city: 'Pune', locality: 'Kalyani Nagar', type: '3BHK', price: '1.5Cr', pricePerUnit: 210000, area: '715 sqft', demand: 89, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', description: 'Upscale 3BHK in Kalyani Nagar.' },
        { id: 'PUNSEED3', city: 'Pune', locality: 'Wakad', type: '1BHK', price: '60L', pricePerUnit: 150000, area: '400 sqft', demand: 84, image: 'https://images.unsplash.com/photo-1516683487411-3606a36ecc64?w=400', description: 'Budget-friendly 1BHK in Wakad.' },
        { id: 'HYDSEED1', city: 'Hyderabad', locality: 'Jubilee Hills', type: '2BHK', price: '1.3Cr', pricePerUnit: 210000, area: '620 sqft', demand: 90, image: 'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=400', description: 'Premium 2BHK in Jubilee Hills.' },
        { id: 'HYDSEED2', city: 'Hyderabad', locality: 'HITEC City', type: '3BHK', price: '1.8Cr', pricePerUnit: 230000, area: '780 sqft', demand: 91, image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400', description: 'IT corridor 3BHK apartment.' },
        { id: 'HYDSEED3', city: 'Hyderabad', locality: 'Madhapur', type: '1BHK', price: '65L', pricePerUnit: 155000, area: '420 sqft', demand: 85, image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400', description: 'Convenient 1BHK near tech companies.' }
      ];

      await prisma.$transaction(
        sampleProperties.map(p => prisma.property.create({ data: { ...p, sellerId: agentUser.id } }))
      );
      console.log(`✓ Created ${sampleProperties.length} sample properties`);
    } else {
      console.log('✓ Properties already exist, skipping property seed');
    }

  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  }
}


main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
