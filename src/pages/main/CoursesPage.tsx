import React, { useMemo, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CourseCard } from "@/components/common/CourseCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useCoursesQuery, useCategoriesQuery } from "@/hooks/queries/useCoursesQuery";

const SORT_OPTIONS = [
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Most Popular", value: "popular" },
];

const PRICE_OPTIONS = [
  { label: "Free ($0)", value: "free" },
  { label: "Paid ($1 - $100)", value: "paid" },
];

export const CoursesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { data: courses = [], isLoading, isError } = useCoursesQuery();
  const { data: categories = [] } = useCategoriesQuery();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("");

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    const searchParam = searchParams.get("search");

    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [searchParams]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  };

  const togglePrice = (p: string) => {
    setSelectedPrice((prev) =>
      prev.includes(p) ? prev.filter((item) => item !== p) : [...prev, p]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategories([]);
    setSelectedPrice([]);
    setSortBy("");
  };

  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // Search
        if (
          searchQuery &&
          !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !(course.category || "").toLowerCase().includes(searchQuery.toLowerCase())
        ) {
          return false;
        }
        // Categories
        if (
          selectedCategories.length > 0 &&
          !selectedCategories.some(
            (c) =>
              c.toLowerCase() === (course.category || "").toLowerCase() ||
              c.toLowerCase() === (course.category || "").toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")
          )
        ) {
          return false;
        }
        // Price
        if (selectedPrice.length > 0) {
          if (selectedPrice.includes("free") && course.price > 0 && !selectedPrice.includes("paid")) {
            return false;
          }
          if (selectedPrice.includes("paid") && course.price === 0 && !selectedPrice.includes("free")) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
        return 0;
      });
  }, [courses, searchQuery, selectedCategories, selectedPrice, sortBy]);

  const renderFilterContent = () => (
    <Accordion defaultValue={["categories", "price"]} type="multiple" className="w-full">
      {/* Categories filter */}
      <AccordionItem value="categories">
        <AccordionTrigger className="text-sm font-semibold">Categories</AccordionTrigger>
        <AccordionContent className="pt-1">
          <div className="space-y-3">
            {categories.map((category) => {
              const catValue = category.value || category.title;
              return (
                <div key={category.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`cat-${category.id}`}
                    checked={selectedCategories.includes(catValue)}
                    onCheckedChange={() => toggleCategory(catValue)}
                  />
                  <label
                    htmlFor={`cat-${category.id}`}
                    className="text-sm font-medium leading-none cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category.label || category.title}
                  </label>
                </div>
              );
            })}
          </div>
        </AccordionContent>
      </AccordionItem>

      {/* Price filter */}
      <AccordionItem value="price">
        <AccordionTrigger className="text-sm font-semibold">Price</AccordionTrigger>
        <AccordionContent className="pt-1">
          <div className="space-y-3">
            {PRICE_OPTIONS.map((price) => (
              <div key={price.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`price-${price.value}`}
                  checked={selectedPrice.includes(price.value)}
                  onCheckedChange={() => togglePrice(price.value)}
                />
                <label
                  htmlFor={`price-${price.value}`}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {price.label}
                </label>
              </div>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <div className="container py-8 space-y-8">
      {/* Search and Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Explore All Courses</h1>
          <p className="text-muted-foreground mt-1">
            Discover top-rated software engineering, web development, and design courses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1 md:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10 text-sm bg-muted/30"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Sort Select */}
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-44 h-10 text-sm">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {SORT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          {/* Mobile Filter Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden h-10 w-10 shrink-0">
                <Filter className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader>
                <SheetTitle className="text-left">Filter Courses</SheetTitle>
              </SheetHeader>
              <div className="py-4">{renderFilterContent()}</div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Active Filter Tags */}
      {(selectedCategories.length > 0 || selectedPrice.length > 0 || searchQuery) && (
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <span className="text-xs text-muted-foreground font-medium mr-1">Active Filters:</span>
          {selectedCategories.map((cat) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-sky-500/10 text-sky-600 dark:bg-sky-950/40 font-medium"
            >
              {cat}
              <X className="h-3 w-3 cursor-pointer" onClick={() => toggleCategory(cat)} />
            </span>
          ))}
          {selectedPrice.map((p) => (
            <span
              key={p}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs bg-emerald-500/10 text-emerald-600 dark:bg-emerald-950/40 font-medium"
            >
              {p}
              <X className="h-3 w-3 cursor-pointer" onClick={() => togglePrice(p)} />
            </span>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-xs text-destructive hover:bg-destructive/10 h-7 px-2"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Main Grid: Filters (Desktop 3 Cols) & Course Cards (9 Cols) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block md:col-span-3 border p-5 rounded-2xl bg-card shadow-xs sticky top-24">
          <div className="flex items-center justify-between pb-3 mb-2 border-b">
            <h3 className="font-bold text-sm">Filters</h3>
            {(selectedCategories.length > 0 || selectedPrice.length > 0) && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-destructive hover:underline font-medium"
              >
                Reset
              </button>
            )}
          </div>
          {renderFilterContent()}
        </div>

        {/* Course Grid Area */}
        <div className="md:col-span-9 w-full">
          {isLoading ? (
            <div className="py-16 text-center text-muted-foreground">Loading courses...</div>
          ) : isError ? (
            <div className="py-16 text-center space-y-3 bg-muted/20 rounded-2xl border">
              <h3 className="font-bold text-lg">Could not load courses</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                The catalog API is unavailable right now. Please try again in a moment.
              </p>
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-muted/20 rounded-2xl border">
              <h3 className="font-bold text-lg">No courses match your criteria</h3>
              <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                Try clearing your search query or adjusting your category and price filters.
              </p>
              <Button variant="outline" size="sm" onClick={clearAllFilters}>
                Clear All Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
