"use client";

import React, { useState } from "react";
import { Search, Star, MapPin, Briefcase, DollarSign } from "lucide-react";

interface Lawyer {
  id: string;
  name: string;
  photo: string;
  specializations: string[];
  experience: number;
  rating: number;
  reviewsCount: number;
  hourlyRate: number;
  location: string;
  bio: string;
  languages: string[];
  availability: boolean;
}

const mockLawyers: Lawyer[] = [
  {
    id: "1",
    name: "Dr. Ahmed Mansour",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed1",
    specializations: ["Tech Contracts", "IP Law", "Data Privacy"],
    experience: 12,
    rating: 4.9,
    reviewsCount: 87,
    hourlyRate: 1500,
    location: "Cairo, Egypt",
    bio: "Specialized in technology law with extensive experience in Egyptian Constitution and tech contracts.",
    languages: ["Arabic", "English"],
    availability: true,
  },
  {
    id: "2",
    name: "Counselor Fatima El-Sayed",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fatima1",
    specializations: ["Commercial Law", "Tech Contracts", "Startups"],
    experience: 8,
    rating: 4.8,
    reviewsCount: 64,
    hourlyRate: 1200,
    location: "Alexandria, Egypt",
    bio: "Expert in commercial law and startup legal matters under Egyptian law.",
    languages: ["Arabic", "English", "French"],
    availability: true,
  },
  {
    id: "3",
    name: "Dr. Omar Khalil",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar1",
    specializations: ["Data Privacy", "Cybercrime Law", "GDPR"],
    experience: 15,
    rating: 5.0,
    reviewsCount: 112,
    hourlyRate: 2000,
    location: "Cairo, Egypt",
    bio: "Leading expert in data protection and cybercrime law in Egypt.",
    languages: ["Arabic", "English"],
    availability: false,
  },
  {
    id: "4",
    name: "Counselor Nour Abdel-Rahman",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nour1",
    specializations: ["IP Law", "Tech Contracts", "Licensing"],
    experience: 10,
    rating: 4.7,
    reviewsCount: 53,
    hourlyRate: 1400,
    location: "Giza, Egypt",
    bio: "Intellectual property specialist with focus on technology licensing.",
    languages: ["Arabic", "English"],
    availability: true,
  },
  {
    id: "5",
    name: "Dr. Karim Mostafa",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim1",
    specializations: ["Tech Contracts", "Commercial Law", "M&A"],
    experience: 18,
    rating: 4.9,
    reviewsCount: 95,
    hourlyRate: 2500,
    location: "Cairo, Egypt",
    bio: "Senior counsel specializing in tech M&A and commercial contracts.",
    languages: ["Arabic", "English"],
    availability: true,
  },
  {
    id: "6",
    name: "Counselor Yasmin Ibrahim",
    photo: "https://api.dicebear.com/7.x/avataaars/svg?seed=Yasmin1",
    specializations: ["Startups", "Tech Contracts", "Employment Law"],
    experience: 6,
    rating: 4.6,
    reviewsCount: 41,
    hourlyRate: 1000,
    location: "Cairo, Egypt",
    bio: "Startup-focused lawyer helping tech companies navigate Egyptian law.",
    languages: ["Arabic", "English"],
    availability: true,
  },
];

export default function MarketplacePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("all");
  const [selectedExperience, setSelectedExperience] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<string>("all");

  const specializations = [
    "Tech Contracts",
    "IP Law",
    "Data Privacy",
    "Commercial Law",
    "Startups",
    "Cybercrime Law",
  ];

  const filteredLawyers = mockLawyers.filter((lawyer) => {
    const matchesSearch =
      lawyer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lawyer.specializations.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesSpecialization =
      selectedSpecialization === "all" ||
      lawyer.specializations.includes(selectedSpecialization);

    const matchesExperience =
      selectedExperience === "all" ||
      (selectedExperience === "0-5" && lawyer.experience <= 5) ||
      (selectedExperience === "6-10" &&
        lawyer.experience >= 6 &&
        lawyer.experience <= 10) ||
      (selectedExperience === "11+" && lawyer.experience >= 11);

    const matchesRating =
      selectedRating === "all" ||
      (selectedRating === "4+" && lawyer.rating >= 4) ||
      (selectedRating === "4.5+" && lawyer.rating >= 4.5);

    return (
      matchesSearch &&
      matchesSpecialization &&
      matchesExperience &&
      matchesRating
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Hero Section */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Find Your Tech Lawyer
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Connect with specialized lawyers for contract review, generation,
            and legal consultation
          </p>

          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by name or specialization..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 sticky top-8">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Filters
              </h2>

              {/* Specialization Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Specialization
                </label>
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Specializations</option>
                  {specializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
              </div>

              {/* Experience Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Experience
                </label>
                <select
                  value={selectedExperience}
                  onChange={(e) => setSelectedExperience(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Experience</option>
                  <option value="0-5">0-5 years</option>
                  <option value="6-10">6-10 years</option>
                  <option value="11+">11+ years</option>
                </select>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rating
                </label>
                <select
                  value={selectedRating}
                  onChange={(e) => setSelectedRating(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                >
                  <option value="all">All Ratings</option>
                  <option value="4+">4+ Stars</option>
                  <option value="4.5+">4.5+ Stars</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSelectedSpecialization("all");
                  setSelectedExperience("all");
                  setSelectedRating("all");
                  setSearchQuery("");
                }}
                className="w-full px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
              >
                Clear Filters
              </button>
            </div>
          </aside>

          {/* Lawyers Grid */}
          <main className="flex-1">
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {filteredLawyers.length} lawyer
              {filteredLawyers.length !== 1 ? "s" : ""} found
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredLawyers.map((lawyer) => (
                <div
                  key={lawyer.id}
                  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 hover:shadow-lg transition"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <img
                      src={lawyer.photo}
                      alt={lawyer.name}
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {lawyer.name}
                      </h3>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 text-sm font-medium text-gray-900 dark:text-white">
                            {lawyer.rating}
                          </span>
                          <span className="ml-1 text-sm text-gray-500 dark:text-gray-400">
                            ({lawyer.reviewsCount} reviews)
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {lawyer.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-4 h-4" />
                          {lawyer.experience} years
                        </div>
                      </div>
                    </div>
                    {lawyer.availability && (
                      <span className="px-2 py-1 text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/20 dark:text-green-400 rounded-full">
                        Available
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-2">
                    {lawyer.bio}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {lawyer.specializations.map((spec) => (
                      <span
                        key={spec}
                        className="px-3 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-800">
                    <div className="flex items-center gap-1 text-gray-900 dark:text-white font-semibold">
                      <DollarSign className="w-4 h-4" />
                      {lawyer.hourlyRate} EGP/hr
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition">
                        View Profile
                      </button>
                      <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition">
                        Contact
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredLawyers.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">
                  No lawyers found matching your criteria. Try adjusting your
                  filters.
                </p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
