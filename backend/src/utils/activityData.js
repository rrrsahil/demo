const activities = [
  // Adventure
  { activityName: 'River Rafting', category: 'Adventure', cost: 1500, duration: '3-4 hours', description: 'Thrilling white water rafting experience through rapids.', rating: 4.8 },
  { activityName: 'Bungee Jumping', category: 'Adventure', cost: 3500, duration: '2-3 hours', description: 'Leap of faith from a high platform into the abyss.', rating: 4.9 },
  { activityName: 'Paragliding', category: 'Adventure', cost: 2500, duration: '30-45 mins', description: 'Soar through the skies with stunning aerial views.', rating: 4.7 },
  { activityName: 'Trekking', category: 'Adventure', cost: 800, duration: 'Full Day', description: 'Guided trek through scenic mountain trails.', rating: 4.6 },
  { activityName: 'Zip Lining', category: 'Adventure', cost: 1200, duration: '1-2 hours', description: 'Fly through the forest canopy at high speed.', rating: 4.5 },

  // Culture
  { activityName: 'Heritage Walking Tour', category: 'Culture', cost: 500, duration: '3 hours', description: 'Guided walk through historic lanes and monuments.', rating: 4.5 },
  { activityName: 'Museum Visit', category: 'Culture', cost: 300, duration: '2-3 hours', description: 'Explore art, history and science exhibits.', rating: 4.3 },
  { activityName: 'Cultural Dance Show', category: 'Culture', cost: 800, duration: '2 hours', description: 'Traditional folk dance and music performance.', rating: 4.4 },
  { activityName: 'Temple Tour', category: 'Culture', cost: 0, duration: '2 hours', description: 'Visit sacred temples and spiritual sites.', rating: 4.6 },
  { activityName: 'Art Gallery Visit', category: 'Culture', cost: 200, duration: '1-2 hours', description: 'Contemporary and traditional art collections.', rating: 4.2 },

  // Food
  { activityName: 'Street Food Walk', category: 'Food', cost: 600, duration: '2-3 hours', description: 'Guided tour of local street food hotspots.', rating: 4.9 },
  { activityName: 'Cooking Class', category: 'Food', cost: 1500, duration: '3 hours', description: 'Learn to cook authentic local cuisine.', rating: 4.7 },
  { activityName: 'Food Market Tour', category: 'Food', cost: 400, duration: '2 hours', description: 'Explore bustling local food markets.', rating: 4.5 },
  { activityName: 'Fine Dining Experience', category: 'Food', cost: 3000, duration: '2-3 hours', description: 'Curated multi-course meal at a top restaurant.', rating: 4.6 },
  { activityName: 'Spice Farm Tour', category: 'Food', cost: 700, duration: '2 hours', description: 'Visit exotic spice farms and taste fresh spices.', rating: 4.4 },

  // Nature
  { activityName: 'Wildlife Safari', category: 'Nature', cost: 3000, duration: 'Full Day', description: 'Jeep safari through national parks to spot wildlife.', rating: 4.8 },
  { activityName: 'Boat Ride', category: 'Nature', cost: 400, duration: '1 hour', description: 'Scenic boat ride through backwaters or lakes.', rating: 4.5 },
  { activityName: 'Sunrise Hike', category: 'Nature', cost: 500, duration: '4-5 hours', description: 'Early morning hike to witness a breathtaking sunrise.', rating: 4.9 },
  { activityName: 'Waterfall Visit', category: 'Nature', cost: 200, duration: '2 hours', description: 'Trek to and swim near stunning waterfalls.', rating: 4.7 },
  { activityName: 'Bird Watching', category: 'Nature', cost: 600, duration: '3 hours', description: 'Guided bird watching in natural habitats.', rating: 4.3 },

  // Shopping
  { activityName: 'Local Bazaar Shopping', category: 'Shopping', cost: 2000, duration: '2-3 hours', description: 'Browse colorful local markets for souvenirs.', rating: 4.4 },
  { activityName: 'Handicraft Workshop', category: 'Shopping', cost: 800, duration: '2 hours', description: 'Create your own local handicraft souvenir.', rating: 4.5 },
  { activityName: 'Night Market Visit', category: 'Shopping', cost: 1500, duration: '2-3 hours', description: 'Shop at vibrant night markets for deals and food.', rating: 4.6 },

  // Relaxation
  { activityName: 'Spa & Ayurveda Treatment', category: 'Relaxation', cost: 2500, duration: '2-3 hours', description: 'Rejuvenating traditional ayurvedic massage.', rating: 4.8 },
  { activityName: 'Yoga Session', category: 'Relaxation', cost: 500, duration: '1-2 hours', description: 'Guided yoga and meditation in serene settings.', rating: 4.7 },
  { activityName: 'Beach Relaxation', category: 'Relaxation', cost: 0, duration: 'Full Day', description: 'Unwind on beautiful sandy beaches.', rating: 4.5 },
  { activityName: 'Sunset Cruise', category: 'Relaxation', cost: 1800, duration: '2 hours', description: 'Cruise along scenic waters at sunset.', rating: 4.8 },

  // Nightlife
  { activityName: 'Rooftop Bar', category: 'Nightlife', cost: 2000, duration: '3 hours', description: 'Drinks and views from a trendy rooftop venue.', rating: 4.5 },
  { activityName: 'Night Aarti / Cultural Event', category: 'Nightlife', cost: 0, duration: '1 hour', description: 'Witness the mesmerizing evening aarti ceremony.', rating: 4.9 },
  { activityName: 'Live Music Night', category: 'Nightlife', cost: 1000, duration: '3 hours', description: 'Enjoy live local music and performances.', rating: 4.4 },
];

module.exports = activities;
