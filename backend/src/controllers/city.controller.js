const City = require('../models/city.model');
const asyncHandler = require('../utils/asyncHandler');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all cities (with optional search and filter)
// @route   GET /api/cities
// @access  Private
const getCities = asyncHandler(async (req, res, next) => {
  const { search, country } = req.query;
  const query = {};

  if (search) {
    query.name = { $regex: search, $options: 'i' };
  }
  if (country && country !== 'All') {
    query.country = country;
  }

  const cities = await City.find(query).sort({ name: 1 });
  
  // Extract unique countries for the filter dropdown
  const allCities = await City.find();
  const countries = [...new Set(allCities.map(c => c.country))].sort();

  res.status(200).json(new ApiResponse(200, { cities, countries }, 'Cities retrieved successfully'));
});

// @desc    Seed some initial cities
// @route   POST /api/cities/seed
// @access  Private (Admin ideally, but just Private for now)
const seedCities = asyncHandler(async (req, res, next) => {
  await City.deleteMany({}); // clear existing
  
  const sampleCities = [
    {
      name: 'Paris',
      country: 'France',
      description: 'The City of Light draws millions of visitors every year with its unforgettable ambiance.',
      popularActivities: ['Eiffel Tower', 'Louvre Museum', 'Seine River Cruise'],
      avgDailyCost: 15000,
      tags: ['Romance', 'Culture', 'Food']
    },
    {
      name: 'Tokyo',
      country: 'Japan',
      description: 'A bustling metropolis that seamlessly blends the ultramodern with the traditional.',
      popularActivities: ['Shibuya Crossing', 'Senso-ji Temple', 'Tsukiji Outer Market'],
      avgDailyCost: 12000,
      tags: ['Culture', 'Food', 'Shopping']
    },
    {
      name: 'Bali',
      country: 'Indonesia',
      description: 'An Indonesian island known for its forested volcanic mountains, iconic rice paddies, beaches and coral reefs.',
      popularActivities: ['Uluwatu Temple', 'Ubud Monkey Forest', 'Seminyak Beach'],
      avgDailyCost: 5000,
      tags: ['Nature', 'Relaxation', 'Culture']
    },
    {
      name: 'Dubai',
      country: 'UAE',
      description: 'A city and emirate in the United Arab Emirates known for luxury shopping, ultramodern architecture and a lively nightlife scene.',
      popularActivities: ['Burj Khalifa', 'Dubai Mall', 'Desert Safari'],
      avgDailyCost: 20000,
      tags: ['Luxury', 'Shopping', 'Adventure']
    },
    {
      name: 'New York City',
      country: 'USA',
      description: 'The Big Apple is known for its iconic skyline, diverse culture, and bustling streets.',
      popularActivities: ['Central Park', 'Statue of Liberty', 'Times Square'],
      avgDailyCost: 25000,
      tags: ['Culture', 'Shopping', 'Nightlife']
    },
    {
      name: 'Rome',
      country: 'Italy',
      description: 'Italy’s capital, is a sprawling, cosmopolitan city with nearly 3,000 years of globally influential art, architecture and culture.',
      popularActivities: ['Colosseum', 'Pantheon', 'Trevi Fountain'],
      avgDailyCost: 14000,
      tags: ['History', 'Culture', 'Food']
    }
  ];

  const cities = await City.insertMany(sampleCities);
  res.status(201).json(new ApiResponse(201, { count: cities.length, cities }, 'Sample cities seeded successfully'));
});

module.exports = { getCities, seedCities };
