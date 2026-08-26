import { Hotspot } from "@/types";

export const fallbackHotspots: Record<string, Hotspot[]> = {
  // Mysuru (approx 12.2958, 76.6394)
  "dest-mysuru": [
    {
      id: "hs-my-1", name: "Chamundi Hill Bull Statue", category: "attraction", coordinates: [12.2743, 76.6664], rating: 4.6, ratingCount: 1543, budgetLevel: 1, openNow: true, distanceKm: 3.5,
      description: "Iconic Nandi statue on the way to Chamundeshwari Temple."
    },
    {
      id: "hs-my-2", name: "Mylari Dosa", category: "restaurant", coordinates: [12.3082, 76.6661], rating: 4.8, ratingCount: 3200, budgetLevel: 1, openNow: true, distanceKm: 2.1,
      description: "Famous local spot for authentic soft Mylari dosas."
    },
    {
      id: "hs-my-3", name: "Devaraja Market", category: "shopping", coordinates: [12.3087, 76.6508], rating: 4.4, ratingCount: 890, budgetLevel: 1, openNow: true, distanceKm: 1.5,
      description: "Vibrant local market for silk, spices, and flowers."
    },
    {
      id: "hs-my-4", name: "Rail Museum", category: "museum", coordinates: [12.3168, 76.6433], rating: 4.3, ratingCount: 520, budgetLevel: 1, openNow: false, distanceKm: 2.2,
      description: "Vintage locomotives and railway history."
    },
    {
      id: "hs-my-5", name: "St. Philomena's Cathedral", category: "attraction", coordinates: [12.3207, 76.6586], rating: 4.6, ratingCount: 12000, budgetLevel: 1, openNow: true, distanceKm: 3.2,
      description: "Majestic neo-Gothic Catholic cathedral."
    },
    {
      id: "hs-my-6", name: "Karanji Lake", category: "park", coordinates: [12.3023, 76.6713], rating: 4.5, ratingCount: 8500, budgetLevel: 1, openNow: true, distanceKm: 3.8,
      description: "Nature park with India's largest walk-through aviary."
    },
    {
      id: "hs-my-7", name: "Jaganmohan Palace", category: "museum", coordinates: [12.3054, 76.6514], rating: 4.3, ratingCount: 6500, budgetLevel: 2, openNow: true, distanceKm: 1.2,
      description: "Art gallery housed in a former royal palace."
    },
    {
      id: "hs-my-8", name: "GRS Fantasy Park", category: "attraction", coordinates: [12.3551, 76.6346], rating: 4.3, ratingCount: 15200, budgetLevel: 3, openNow: true, distanceKm: 6.7,
      description: "Amusement and water park."
    },
    {
      id: "hs-my-9", name: "Hotel RRR", category: "restaurant", coordinates: [12.3075, 76.6558], rating: 4.4, ratingCount: 11000, budgetLevel: 2, openNow: true, distanceKm: 2.0,
      description: "Famous for Andhra-style biryani served on banana leaves."
    },
    {
      id: "hs-my-10", name: "Pelican Pub", category: "nightlife", coordinates: [12.3274, 76.6435], rating: 4.2, ratingCount: 3500, budgetLevel: 2, openNow: true, distanceKm: 3.7,
      description: "Popular laid-back local pub."
    },
    {
      id: "hs-my-11", name: "Mysore Zoo", category: "attraction", coordinates: [12.3015, 76.6644], rating: 4.5, ratingCount: 35000, budgetLevel: 1, openNow: true, distanceKm: 3.0,
      description: "One of the oldest and most popular zoos in India."
    },
    {
      id: "hs-my-12", name: "Sand Museum", category: "museum", coordinates: [12.3010, 76.6852], rating: 4.2, ratingCount: 8200, budgetLevel: 1, openNow: true, distanceKm: 5.1,
      description: "Museum featuring intricate sand sculptures."
    },
    {
      id: "hs-my-13", name: "Forum Centre City", category: "shopping", coordinates: [12.3168, 76.6578], rating: 4.4, ratingCount: 18000, budgetLevel: 3, openNow: true, distanceKm: 3.1,
      description: "Modern shopping mall with multiplex and food court."
    },
    {
      id: "hs-my-14", name: "Depth N Green", category: "restaurant", coordinates: [12.3229, 76.6267], rating: 4.6, ratingCount: 1400, budgetLevel: 2, openNow: true, distanceKm: 3.4,
      description: "Cozy cafe with healthy, organic vegetarian food."
    },
    {
      id: "hs-my-15", name: "Kukkarahalli Lake", category: "park", coordinates: [12.3086, 76.6346], rating: 4.5, ratingCount: 9200, budgetLevel: 1, openNow: true, distanceKm: 1.5,
      description: "Scenic lake popular for morning walks and bird watching."
    },
  ],

  // Bengaluru (approx 12.9716, 77.5946)
  "dest-bengaluru": [
    {
      id: "hs-bl-1", name: "Vidyarthi Bhavan", category: "restaurant", coordinates: [12.9439, 77.5738], rating: 4.7, ratingCount: 12000, budgetLevel: 1, openNow: true, distanceKm: 3.8,
      description: "Legendary South Indian vegetarian restaurant."
    },
    {
      id: "hs-bl-2", name: "Visvesvaraya Museum", category: "museum", coordinates: [12.9754, 77.5959], rating: 4.5, ratingCount: 4100, budgetLevel: 2, openNow: true, distanceKm: 0.5,
      description: "Interactive industrial and technological museum."
    },
    {
      id: "hs-bl-3", name: "Lalbagh Botanical Garden", category: "park", coordinates: [12.9507, 77.5848], rating: 4.6, ratingCount: 9500, budgetLevel: 1, openNow: true, distanceKm: 2.5,
      description: "Historic garden with a famous glass house."
    },
    {
      id: "hs-bl-4", name: "UB City", category: "shopping", coordinates: [12.9716, 77.5960], rating: 4.4, ratingCount: 2200, budgetLevel: 4, openNow: true, distanceKm: 0.2,
      description: "Luxury shopping and fine dining mall."
    },
    {
      id: "hs-bl-5", name: "Toit Brewpub", category: "nightlife", coordinates: [12.9791, 77.6406], rating: 4.8, ratingCount: 18000, budgetLevel: 3, openNow: true, distanceKm: 5.1,
      description: "Popular craft brewery in Indiranagar."
    },
    {
      id: "hs-bl-6", name: "Cubbon Park", category: "park", coordinates: [12.9768, 77.5948], rating: 4.7, ratingCount: 48000, budgetLevel: 1, openNow: true, distanceKm: 0.6,
      description: "Expansive green park in the heart of the city."
    },
    {
      id: "hs-bl-7", name: "Bangalore Palace", category: "attraction", coordinates: [12.9988, 77.5921], rating: 4.4, ratingCount: 32000, budgetLevel: 2, openNow: true, distanceKm: 3.0,
      description: "Tudor-style royal palace offering audio tours."
    },
    {
      id: "hs-bl-8", name: "Commercial Street", category: "shopping", coordinates: [12.9822, 77.6083], rating: 4.3, ratingCount: 25000, budgetLevel: 2, openNow: true, distanceKm: 1.9,
      description: "Bustling street market for clothes and accessories."
    },
    {
      id: "hs-bl-9", name: "MTR (Mavalli Tiffin Room)", category: "restaurant", coordinates: [12.9546, 77.5843], rating: 4.4, ratingCount: 19000, budgetLevel: 2, openNow: true, distanceKm: 2.2,
      description: "Historic eatery famous for Rava Idli and filter coffee."
    },
    {
      id: "hs-bl-10", name: "National Gallery of Modern Art", category: "museum", coordinates: [12.9892, 77.5888], rating: 4.6, ratingCount: 5200, budgetLevel: 1, openNow: true, distanceKm: 2.0,
      description: "Premier art museum in a colonial-era mansion."
    },
    {
      id: "hs-bl-11", name: "Wonderla Amusement Park", category: "attraction", coordinates: [12.8343, 77.4011], rating: 4.6, ratingCount: 65000, budgetLevel: 3, openNow: true, distanceKm: 26.0,
      description: "Massive amusement park with thrilling rides."
    },
    {
      id: "hs-bl-12", name: "Byg Brewski", category: "nightlife", coordinates: [12.9068, 77.6784], rating: 4.5, ratingCount: 24000, budgetLevel: 3, openNow: true, distanceKm: 11.5,
      description: "Asia's largest brewpub."
    },
    {
      id: "hs-bl-13", name: "ISKCON Temple", category: "attraction", coordinates: [13.0098, 77.5511], rating: 4.7, ratingCount: 42000, budgetLevel: 1, openNow: true, distanceKm: 6.3,
      description: "Massive, ornate Hare Krishna temple."
    },
    {
      id: "hs-bl-14", name: "Brahmin's Coffee Bar", category: "restaurant", coordinates: [12.9515, 77.5684], rating: 4.7, ratingCount: 16000, budgetLevel: 1, openNow: true, distanceKm: 3.6,
      description: "Iconic standing-room-only spot for idlis and coffee."
    },
    {
      id: "hs-bl-15", name: "Phoenix Marketcity", category: "shopping", coordinates: [12.9969, 77.6953], rating: 4.5, ratingCount: 88000, budgetLevel: 3, openNow: true, distanceKm: 11.2,
      description: "One of the largest shopping malls in Bangalore."
    },
  ],

  // Goa (approx 15.2993, 74.1240)
  "dest-goa": [
    {
      id: "hs-go-1", name: "Basilica of Bom Jesus", category: "attraction", coordinates: [15.5009, 73.9116], rating: 4.7, ratingCount: 8200, budgetLevel: 1, openNow: true, distanceKm: 24.5,
      description: "UNESCO World Heritage church in Old Goa."
    },
    {
      id: "hs-go-2", name: "Curlies Beach Shack", category: "restaurant", coordinates: [15.5786, 73.7432], rating: 4.3, ratingCount: 6100, budgetLevel: 2, openNow: true, distanceKm: 42.1,
      description: "Famous beach shack at Anjuna Beach."
    },
    {
      id: "hs-go-3", name: "Dudhsagar Falls", category: "attraction", coordinates: [15.3144, 74.3143], rating: 4.8, ratingCount: 3500, budgetLevel: 2, openNow: true, distanceKm: 32.0,
      description: "Spectacular four-tiered waterfall."
    },
    {
      id: "hs-go-4", name: "Tito's Lane", category: "nightlife", coordinates: [15.5529, 73.7533], rating: 4.2, ratingCount: 4500, budgetLevel: 3, openNow: false, distanceKm: 39.5,
      description: "Bustling nightlife hub in Baga."
    },
    {
      id: "hs-go-5", name: "Aguada Fort", category: "attraction", coordinates: [15.4920, 73.7737], rating: 4.5, ratingCount: 32000, budgetLevel: 1, openNow: true, distanceKm: 35.0,
      description: "17th-century Portuguese fort and lighthouse."
    },
    {
      id: "hs-go-6", name: "Thalassa", category: "restaurant", coordinates: [15.6143, 73.7371], rating: 4.4, ratingCount: 14000, budgetLevel: 4, openNow: true, distanceKm: 46.5,
      description: "Greek taverna with stunning sunset views."
    },
    {
      id: "hs-go-7", name: "Anjuna Flea Market", category: "shopping", coordinates: [15.5786, 73.7408], rating: 4.2, ratingCount: 8500, budgetLevel: 2, openNow: false, distanceKm: 42.0,
      description: "Vibrant Wednesday market for souvenirs and clothes."
    },
    {
      id: "hs-go-8", name: "Museum of Christian Art", category: "museum", coordinates: [15.5034, 73.9135], rating: 4.4, ratingCount: 950, budgetLevel: 2, openNow: true, distanceKm: 24.8,
      description: "Museum showcasing Indo-Portuguese Christian art."
    },
    {
      id: "hs-go-9", name: "Bhagwan Mahavir Wildlife Sanctuary", category: "park", coordinates: [15.3499, 74.2589], rating: 4.3, ratingCount: 4100, budgetLevel: 1, openNow: true, distanceKm: 26.5,
      description: "Large sanctuary in the Western Ghats."
    },
    {
      id: "hs-go-10", name: "Club Cubana", category: "nightlife", coordinates: [15.5746, 73.7631], rating: 4.5, ratingCount: 12000, budgetLevel: 4, openNow: false, distanceKm: 41.5,
      description: "Famous 'nightclub in the sky' with a pool."
    },
    {
      id: "hs-go-11", name: "Fontainhas", category: "attraction", coordinates: [15.4981, 73.8322], rating: 4.6, ratingCount: 8200, budgetLevel: 1, openNow: true, distanceKm: 29.5,
      description: "Colorful Latin Quarter in Panjim."
    },
    {
      id: "hs-go-12", name: "Gunpowder", category: "restaurant", coordinates: [15.5929, 73.7997], rating: 4.5, ratingCount: 6400, budgetLevel: 3, openNow: true, distanceKm: 41.8,
      description: "Popular South Indian restaurant in Assagao."
    },
    {
      id: "hs-go-13", name: "Naval Aviation Museum", category: "museum", coordinates: [15.3789, 73.8335], rating: 4.6, ratingCount: 5600, budgetLevel: 1, openNow: true, distanceKm: 31.0,
      description: "Military aviation museum near the airport."
    },
    {
      id: "hs-go-14", name: "Palolem Beach", category: "park", coordinates: [15.0099, 74.0232], rating: 4.6, ratingCount: 22000, budgetLevel: 1, openNow: true, distanceKm: 34.0,
      description: "Beautiful crescent-shaped beach in South Goa."
    },
    {
      id: "hs-go-15", name: "Mackie's Saturday Night Bazaar", category: "shopping", coordinates: [15.5684, 73.7601], rating: 4.3, ratingCount: 4200, budgetLevel: 2, openNow: false, distanceKm: 40.5,
      description: "Lively night market with food, music, and stalls."
    }
  ],

  // Mumbai (approx 19.0760, 72.8777)
  "dest-mumbai": [
    {
      id: "hs-mu-1", name: "Marine Drive", category: "attraction", coordinates: [18.9440, 72.8229], rating: 4.8, ratingCount: 15000, budgetLevel: 1, openNow: true, distanceKm: 15.2,
      description: "Iconic C-shaped boulevard along the coast."
    },
    {
      id: "hs-mu-2", name: "Leopold Cafe", category: "restaurant", coordinates: [18.9230, 72.8315], rating: 4.4, ratingCount: 5200, budgetLevel: 2, openNow: true, distanceKm: 17.5,
      description: "Historic cafe in Colaba."
    },
    {
      id: "hs-mu-3", name: "CSMVS Museum", category: "museum", coordinates: [18.9269, 72.8327], rating: 4.6, ratingCount: 3400, budgetLevel: 2, openNow: true, distanceKm: 17.1,
      description: "Premier art and history museum."
    },
    {
      id: "hs-mu-4", name: "Colaba Causeway", category: "shopping", coordinates: [18.9157, 72.8258], rating: 4.5, ratingCount: 4100, budgetLevel: 1, openNow: true, distanceKm: 18.2,
      description: "Street shopping hub for clothes and antiques."
    },
    {
      id: "hs-mu-5", name: "Gateway of India", category: "attraction", coordinates: [18.9220, 72.8347], rating: 4.6, ratingCount: 88000, budgetLevel: 1, openNow: true, distanceKm: 17.6,
      description: "Iconic monument built in the early 20th century."
    },
    {
      id: "hs-mu-6", name: "Sanjay Gandhi National Park", category: "park", coordinates: [19.2147, 72.9106], rating: 4.4, ratingCount: 42000, budgetLevel: 1, openNow: true, distanceKm: 15.8,
      description: "Massive protected area within the city."
    },
    {
      id: "hs-mu-7", name: "Trishna", category: "restaurant", coordinates: [18.9276, 72.8313], rating: 4.5, ratingCount: 5100, budgetLevel: 4, openNow: true, distanceKm: 17.0,
      description: "Renowned fine dining restaurant for seafood."
    },
    {
      id: "hs-mu-8", name: "High Street Phoenix", category: "shopping", coordinates: [18.9944, 72.8248], rating: 4.6, ratingCount: 38000, budgetLevel: 3, openNow: true, distanceKm: 10.6,
      description: "One of the largest shopping malls in India."
    },
    {
      id: "hs-mu-9", name: "Nehru Science Centre", category: "museum", coordinates: [18.9892, 72.8143], rating: 4.5, ratingCount: 16000, budgetLevel: 1, openNow: true, distanceKm: 11.6,
      description: "Interactive science museum."
    },
    {
      id: "hs-mu-10", name: "Toto's Garage", category: "nightlife", coordinates: [19.0621, 72.8291], rating: 4.4, ratingCount: 8200, budgetLevel: 2, openNow: true, distanceKm: 5.3,
      description: "Popular grunge-themed pub in Bandra."
    },
    {
      id: "hs-mu-11", name: "Elephanta Caves", category: "attraction", coordinates: [18.9633, 72.9315], rating: 4.5, ratingCount: 22000, budgetLevel: 2, openNow: true, distanceKm: 13.8,
      description: "Ancient cave temples on an island (ferry required)."
    },
    {
      id: "hs-mu-12", name: "Hanging Gardens", category: "park", coordinates: [18.9566, 72.8052], rating: 4.2, ratingCount: 14000, budgetLevel: 1, openNow: true, distanceKm: 15.2,
      description: "Terraced gardens with sunset views over the Arabian Sea."
    },
    {
      id: "hs-mu-13", name: "Britannia & Co.", category: "restaurant", coordinates: [18.9351, 72.8378], rating: 4.3, ratingCount: 6300, budgetLevel: 2, openNow: true, distanceKm: 16.2,
      description: "Iconic Parsi cafe known for Berry Pulao."
    },
    {
      id: "hs-mu-14", name: "Crawford Market", category: "shopping", coordinates: [18.9472, 72.8340], rating: 4.3, ratingCount: 28000, budgetLevel: 1, openNow: true, distanceKm: 14.9,
      description: "Historic wholesale market building."
    },
    {
      id: "hs-mu-15", name: "Aer", category: "nightlife", coordinates: [18.9950, 72.8197], rating: 4.6, ratingCount: 4200, budgetLevel: 4, openNow: true, distanceKm: 10.8,
      description: "Rooftop lounge at the Four Seasons with panoramic views."
    }
  ],

  // New Delhi (approx 28.6139, 77.2090)
  "dest-delhi": [
    {
      id: "hs-de-1", name: "Karim's", category: "restaurant", coordinates: [28.6517, 77.2346], rating: 4.4, ratingCount: 10500, budgetLevel: 2, openNow: true, distanceKm: 5.1,
      description: "Historic Mughlai cuisine near Jama Masjid."
    },
    {
      id: "hs-de-2", name: "National Museum", category: "museum", coordinates: [28.6119, 77.2193], rating: 4.6, ratingCount: 2200, budgetLevel: 2, openNow: true, distanceKm: 1.1,
      description: "Rich collection of Indian art and history."
    },
    {
      id: "hs-de-3", name: "Lodhi Gardens", category: "park", coordinates: [28.5933, 77.2197], rating: 4.7, ratingCount: 7800, budgetLevel: 1, openNow: true, distanceKm: 2.7,
      description: "Historical park with 15th-century tombs."
    },
    {
      id: "hs-de-4", name: "Connaught Place", category: "shopping", coordinates: [28.6304, 77.2177], rating: 4.6, ratingCount: 12000, budgetLevel: 3, openNow: true, distanceKm: 2.1,
      description: "Circular commercial and architectural hub."
    },
    {
      id: "hs-de-5", name: "India Gate", category: "attraction", coordinates: [28.6129, 77.2295], rating: 4.6, ratingCount: 135000, budgetLevel: 1, openNow: true, distanceKm: 2.0,
      description: "Iconic war memorial archway."
    },
    {
      id: "hs-de-6", name: "Qutub Minar", category: "attraction", coordinates: [28.5245, 77.1855], rating: 4.6, ratingCount: 110000, budgetLevel: 2, openNow: true, distanceKm: 10.3,
      description: "Tallest brick minaret in the world."
    },
    {
      id: "hs-de-7", name: "Indian Accent", category: "restaurant", coordinates: [28.5910, 77.2386], rating: 4.8, ratingCount: 5200, budgetLevel: 4, openNow: true, distanceKm: 4.0,
      description: "Award-winning fine dining Indian restaurant."
    },
    {
      id: "hs-de-8", name: "Chandni Chowk", category: "shopping", coordinates: [28.6505, 77.2303], rating: 4.3, ratingCount: 65000, budgetLevel: 1, openNow: true, distanceKm: 4.6,
      description: "One of India's oldest and busiest markets."
    },
    {
      id: "hs-de-9", name: "National Gallery of Modern Art", category: "museum", coordinates: [28.6096, 77.2346], rating: 4.6, ratingCount: 5200, budgetLevel: 1, openNow: true, distanceKm: 2.5,
      description: "Premier gallery housing modern Indian art."
    },
    {
      id: "hs-de-10", name: "Hauz Khas Village", category: "nightlife", coordinates: [28.5535, 77.1936], rating: 4.4, ratingCount: 42000, budgetLevel: 3, openNow: true, distanceKm: 6.9,
      description: "Historic village turned trendy nightlife and boutique hub."
    },
    {
      id: "hs-de-11", name: "Red Fort", category: "attraction", coordinates: [28.6562, 77.2410], rating: 4.5, ratingCount: 125000, budgetLevel: 2, openNow: true, distanceKm: 5.7,
      description: "Historic fort complex from the Mughal era."
    },
    {
      id: "hs-de-12", name: "Bukhara", category: "restaurant", coordinates: [28.5973, 77.1736], rating: 4.6, ratingCount: 6100, budgetLevel: 4, openNow: true, distanceKm: 4.1,
      description: "World-famous rustic dining experience at ITC Maurya."
    },
    {
      id: "hs-de-13", name: "Dilli Haat", category: "shopping", coordinates: [28.5727, 77.2074], rating: 4.4, ratingCount: 45000, budgetLevel: 2, openNow: true, distanceKm: 4.6,
      description: "Open-air food plaza and craft bazaar."
    },
    {
      id: "hs-de-14", name: "Sunder Nursery", category: "park", coordinates: [28.5919, 77.2432], rating: 4.7, ratingCount: 15000, budgetLevel: 1, openNow: true, distanceKm: 4.2,
      description: "Beautifully restored 16th-century heritage park."
    },
    {
      id: "hs-de-15", name: "Kitty Su", category: "nightlife", coordinates: [28.6315, 77.2273], rating: 4.3, ratingCount: 5600, budgetLevel: 4, openNow: true, distanceKm: 2.6,
      description: "High-end nightclub at The Lalit hotel."
    }
  ],

  // Agra (approx 27.1767, 78.0081)
  "dest-agra": [
    {
      id: "hs-ag-1", name: "Agra Fort", category: "attraction", coordinates: [27.1795, 78.0211], rating: 4.7, ratingCount: 9100, budgetLevel: 2, openNow: true, distanceKm: 1.3,
      description: "Historic red sandstone fort of the Mughals."
    },
    {
      id: "hs-ag-2", name: "Pinch of Spice", category: "restaurant", coordinates: [27.1601, 78.0436], rating: 4.5, ratingCount: 3100, budgetLevel: 3, openNow: true, distanceKm: 4.2,
      description: "Highly rated North Indian fine dining."
    },
    {
      id: "hs-ag-3", name: "Mehtab Bagh", category: "park", coordinates: [27.1797, 78.0427], rating: 4.4, ratingCount: 2600, budgetLevel: 1, openNow: true, distanceKm: 3.5,
      description: "Garden complex with sunset views of the Taj."
    },
    {
      id: "hs-ag-4", name: "Sadar Bazaar", category: "shopping", coordinates: [27.1627, 78.0094], rating: 4.1, ratingCount: 1200, budgetLevel: 2, openNow: true, distanceKm: 1.6,
      description: "Popular local market for leather goods and sweets."
    },
    {
      id: "hs-ag-5", name: "Taj Mahal", category: "attraction", coordinates: [27.1751, 78.0421], rating: 4.8, ratingCount: 220000, budgetLevel: 3, openNow: true, distanceKm: 3.4,
      description: "Iconic ivory-white marble mausoleum."
    },
    {
      id: "hs-ag-6", name: "Fatehpur Sikri", category: "attraction", coordinates: [27.0945, 77.6679], rating: 4.6, ratingCount: 45000, budgetLevel: 2, openNow: true, distanceKm: 34.8,
      description: "Well-preserved red sandstone ghost city."
    },
    {
      id: "hs-ag-7", name: "Dasaprakash", category: "restaurant", coordinates: [27.1585, 78.0163], rating: 4.2, ratingCount: 4200, budgetLevel: 2, openNow: true, distanceKm: 2.2,
      description: "Popular spot for authentic South Indian thalis."
    },
    {
      id: "hs-ag-8", name: "Kinari Bazaar", category: "shopping", coordinates: [27.1868, 78.0162], rating: 4.0, ratingCount: 8900, budgetLevel: 1, openNow: true, distanceKm: 1.4,
      description: "Narrow streets packed with crafts, spices, and jewelry."
    },
    {
      id: "hs-ag-9", name: "Tomb of Itimad-ud-Daulah", category: "attraction", coordinates: [27.1929, 78.0310], rating: 4.6, ratingCount: 12000, budgetLevel: 2, openNow: true, distanceKm: 2.9,
      description: "Often called the 'Baby Taj'."
    },
    {
      id: "hs-ag-10", name: "Taj Nature Walk", category: "park", coordinates: [27.1706, 78.0519], rating: 4.3, ratingCount: 3100, budgetLevel: 1, openNow: true, distanceKm: 4.4,
      description: "Forest reserve offering unique views of the Taj Mahal."
    },
    {
      id: "hs-ag-11", name: "Peshawri", category: "restaurant", coordinates: [27.1593, 78.0440], rating: 4.6, ratingCount: 2100, budgetLevel: 4, openNow: true, distanceKm: 4.1,
      description: "Luxury dining at ITC Mughal."
    },
    {
      id: "hs-ag-12", name: "Akbar's Tomb", category: "attraction", coordinates: [27.2206, 77.9505], rating: 4.5, ratingCount: 16000, budgetLevel: 2, openNow: true, distanceKm: 7.6,
      description: "The tomb of the Mughal Emperor Akbar."
    },
    {
      id: "hs-ag-13", name: "Mughal Museum", category: "museum", coordinates: [27.1622, 78.0538], rating: 4.2, ratingCount: 450, budgetLevel: 2, openNow: true, distanceKm: 4.9,
      description: "New museum detailing Mughal history and culture."
    },
    {
      id: "hs-ag-14", name: "Kalakriti Cultural Centre", category: "nightlife", coordinates: [27.1565, 78.0505], rating: 4.4, ratingCount: 3800, budgetLevel: 3, openNow: true, distanceKm: 4.8,
      description: "Venue for 'Mohabbat the Taj' evening show."
    },
    {
      id: "hs-ag-15", name: "Subhash Emporium", category: "shopping", coordinates: [27.1581, 78.0163], rating: 4.5, ratingCount: 650, budgetLevel: 3, openNow: true, distanceKm: 2.2,
      description: "Renowned shop for marble inlay work and handicrafts."
    }
  ]
};

// Also support matching by lat/lng roughly if destination ID doesn't exactly match
export function getFallbackHotspotsByLocation(lat: number, lng: number): Hotspot[] {
  // Simple heuristic: find the closest city center based on our known demo cities
  const cities = [
    { id: "dest-mysuru", coords: [12.2958, 76.6394] },
    { id: "dest-bengaluru", coords: [12.9716, 77.5946] },
    { id: "dest-goa", coords: [15.2993, 74.1240] },
    { id: "dest-mumbai", coords: [19.0760, 72.8777] },
    { id: "dest-delhi", coords: [28.6139, 77.2090] },
    { id: "dest-agra", coords: [27.1767, 78.0081] }
  ];

  let closestId = cities[0].id;
  let minDistance = Infinity;

  for (const city of cities) {
    const dLat = city.coords[0] - lat;
    const dLng = city.coords[1] - lng;
    const distSq = dLat * dLat + dLng * dLng;
    if (distSq < minDistance) {
      minDistance = distSq;
      closestId = city.id;
    }
  }

  // Ensure we only return fallback if it's reasonably close (within ~1 degree)
  if (minDistance < 1.0) {
    return fallbackHotspots[closestId] || [];
  }
  return [];
}
