import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { MapPin, Star, Clock, Navigation, Phone, Globe } from 'lucide-react';

interface Gym {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: string;
  hours: string;
  phone?: string;
  website?: string;
  amenities: string[];
  isOpen: boolean;
}

export function GymLocatorSection() {
  const { toast } = useToast();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const [nearbyGyms, setNearbyGyms] = useState<Gym[]>([
    {
      id: '1',
      name: 'FitLife Fitness Center',
      address: '123 Main Street, Downtown',
      rating: 4.8,
      distance: '0.5 mi',
      hours: 'Open 24/7',
      phone: '+1 (555) 123-4567',
      website: 'https://fitlife.com',
      amenities: ['Cardio', 'Weights', 'Classes', 'Pool'],
      isOpen: true,
    },
    {
      id: '2',
      name: 'PowerHouse Gym',
      address: '456 Oak Avenue, Midtown',
      rating: 4.6,
      distance: '1.2 mi',
      hours: '5AM - 11PM',
      phone: '+1 (555) 234-5678',
      website: 'https://powerhouse.com',
      amenities: ['CrossFit', 'Strength', 'Boxing', 'Sauna'],
      isOpen: true,
    },
    {
      id: '3',
      name: 'Zen Yoga Studio',
      address: '789 Wellness Way, Uptown',
      rating: 4.9,
      distance: '0.8 mi',
      hours: '6AM - 10PM',
      phone: '+1 (555) 345-6789',
      website: 'https://zenyoga.com',
      amenities: ['Yoga', 'Pilates', 'Meditation', 'Massage'],
      isOpen: true,
    },
    {
      id: '4',
      name: 'Iron Temple Gym',
      address: '321 Muscle Street, East Side',
      rating: 4.4,
      distance: '2.1 mi',
      hours: '4AM - 12AM',
      phone: '+1 (555) 456-7890',
      amenities: ['Powerlifting', 'Bodybuilding', 'Personal Training'],
      isOpen: false,
    },
    {
      id: '5',
      name: 'Aqua Fitness Center',
      address: '654 Pool Lane, North End',
      rating: 4.7,
      distance: '1.8 mi',
      hours: '5AM - 10PM',
      phone: '+1 (555) 567-8901',
      amenities: ['Swimming', 'Water Aerobics', 'Spa', 'Cardio'],
      isOpen: true,
    },
    {
      id: '6',
      name: 'Elite Sports Complex',
      address: '987 Champion Drive, Sports District',
      rating: 4.5,
      distance: '3.2 mi',
      hours: '6AM - 11PM',
      phone: '+1 (555) 678-9012',
      amenities: ['Basketball', 'Tennis', 'Racquetball', 'Fitness'],
      isOpen: true,
    },
  ]);

  const getCurrentLocation = () => {
    setLoading(true);
    
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support location services.",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        toast({
          title: "Location found!",
          description: "Finding gyms near your location...",
        });
        
        // In a real app, this would call Google Maps API with the user's location
        // For now, we'll simulate finding nearby gyms
        setTimeout(() => {
          setLoading(false);
          toast({
            title: "Gyms found!",
            description: `Found ${nearbyGyms.length} gyms near you.`,
          });
        }, 1500);
      },
      (error) => {
        setLoading(false);
        let errorMessage = "Could not get your location.";
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location services.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable.";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out.";
            break;
        }
        
        toast({
          title: "Location Error",
          description: errorMessage,
          variant: "destructive",
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  };

  const getAmenityColor = (amenity: string) => {
    const colors: { [key: string]: string } = {
      'Cardio': 'bg-electric/20 text-electric',
      'Weights': 'bg-purple-500/20 text-purple-400',
      'Classes': 'bg-neon-green/20 text-neon-green',
      'Pool': 'bg-blue-500/20 text-blue-400',
      'CrossFit': 'bg-red-500/20 text-red-400',
      'Strength': 'bg-purple-500/20 text-purple-400',
      'Boxing': 'bg-orange-500/20 text-orange-400',
      'Yoga': 'bg-green-500/20 text-green-400',
      'Pilates': 'bg-purple-500/20 text-purple-400',
      'Meditation': 'bg-blue-500/20 text-blue-400',
      'Powerlifting': 'bg-red-600/20 text-red-400',
      'Bodybuilding': 'bg-orange-600/20 text-orange-400',
      'Swimming': 'bg-cyan-500/20 text-cyan-400',
      'Basketball': 'bg-orange-500/20 text-orange-400',
      'Tennis': 'bg-green-600/20 text-green-400',
    };
    return colors[amenity] || 'bg-gray-500/20 text-gray-400';
  };

  return (
    <section className="py-20 bg-gradient-to-b from-dark-bg to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Find <span className="gradient-text">Nearby Gyms</span>
          </h2>
          <p className="text-xl text-gray-300">Discover the best fitness facilities near you</p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Map Container */}
          <Card className="glass-effect">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Gym Locations</CardTitle>
                <Button 
                  onClick={getCurrentLocation}
                  disabled={loading}
                  className="bg-electric text-dark-bg hover:shadow-lg transition-all"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 mr-2 animate-spin rounded-full border-2 border-dark-bg border-t-transparent"></div>
                      Finding...
                    </>
                  ) : (
                    <>
                      <Navigation className="w-4 h-4 mr-2" />
                      Use My Location
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Interactive Map Placeholder */}
              <div className="bg-gray-800 rounded-xl h-64 lg:h-80 flex items-center justify-center relative overflow-hidden">
                {/* Simulated map background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-green-900/50"></div>
                
                {/* Map content */}
                <div className="relative z-10 text-center">
                  <MapPin className="w-12 h-12 text-electric mx-auto mb-4" />
                  <p className="text-gray-300 mb-2">Interactive map with gym locations</p>
                  <p className="text-sm text-gray-400">
                    {userLocation 
                      ? `Showing gyms near ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`
                      : "Click 'Use My Location' to find nearby gyms"
                    }
                  </p>
                </div>
                
                {/* Simulated gym pins */}
                <div className="absolute top-1/4 left-1/3 w-3 h-3 bg-electric rounded-full animate-ping"></div>
                <div className="absolute top-1/2 right-1/4 w-3 h-3 bg-neon-green rounded-full animate-ping" style={{animationDelay: '0.5s'}}></div>
                <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-purple-500 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
                <div className="absolute top-3/4 right-1/3 w-3 h-3 bg-orange-500 rounded-full animate-ping" style={{animationDelay: '1.5s'}}></div>
              </div>
              
              <p className="text-xs text-gray-500 mt-2 text-center">
                🗺️ In production, this would integrate with Google Maps API
              </p>
            </CardContent>
          </Card>
          
          {/* Gym List */}
          <div className="space-y-4">
            <h3 className="text-xl font-semibold mb-4">Recommended Gyms</h3>
            
            <div className="space-y-4 max-h-96 lg:max-h-[480px] overflow-y-auto pr-2">
              {nearbyGyms.map((gym) => (
                <Card key={gym.id} className="glass-effect hover:bg-gray-800/50 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h4 className="font-semibold text-lg">{gym.name}</h4>
                          {gym.isOpen && (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                              Open
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-gray-400 text-sm mb-2 flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {gym.address}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-sm mb-3">
                          <div className="flex items-center text-yellow-400">
                            <Star className="w-4 h-4 mr-1 fill-current" />
                            <span>{gym.rating}</span>
                          </div>
                          <div className="flex items-center text-electric">
                            <MapPin className="w-4 h-4 mr-1" />
                            <span>{gym.distance}</span>
                          </div>
                          <div className="flex items-center text-neon-green">
                            <Clock className="w-4 h-4 mr-1" />
                            <span>{gym.hours}</span>
                          </div>
                        </div>
                        
                        {/* Contact Info */}
                        {(gym.phone || gym.website) && (
                          <div className="flex items-center space-x-4 text-xs text-gray-400 mb-3">
                            {gym.phone && (
                              <div className="flex items-center">
                                <Phone className="w-3 h-3 mr-1" />
                                <span>{gym.phone}</span>
                              </div>
                            )}
                            {gym.website && (
                              <div className="flex items-center">
                                <Globe className="w-3 h-3 mr-1" />
                                <a 
                                  href={gym.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="hover:text-electric transition-colors"
                                >
                                  Website
                                </a>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Amenities */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {gym.amenities.map((amenity, index) => (
                            <Badge 
                              key={index} 
                              variant="outline"
                              className={`text-xs ${getAmenityColor(amenity)} border-current`}
                            >
                              {amenity}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="ml-4 flex flex-col space-y-2">
                        <Button 
                          size="sm"
                          className="bg-electric text-dark-bg hover:shadow-lg transition-all"
                        >
                          View Details
                        </Button>
                        <Button 
                          size="sm"
                          variant="outline"
                          className="neon-border hover:bg-glass-bg transition-all text-xs"
                        >
                          Get Directions
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
