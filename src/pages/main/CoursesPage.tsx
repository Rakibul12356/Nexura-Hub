import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { CourseProgress } from "@/components/common/course-progress";
import { CourseCard } from "@/components/common/CourseCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/formatPrice";
import { Search, ArrowRight, BookOpen, Filter, X } from "lucide-react";
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
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSearchQuery,
  toggleCategoryFilter,
  togglePriceFilter,
  setSortBy,
  clearFilters,
} from "@/store/slices/courseSlice";

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
  const dispatch = useAppDispatch();
  const { courses, categories, filters } = useAppSelector(
    (state) => state.courses
  );

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Search
      if (
        filters.searchQuery &&
        !course.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) &&
        !course.category.toLowerCase().includes(filters.searchQuery.toLowerCase())
      ) {
        return false;
      }
      // Categories
      if (
        filters.selectedCategories.length > 0 &&
        !filters.selectedCategories.some(
          (c) => c.toLowerCase() === course.category.toLowerCase() ||
                 c.toLowerCase() === course.category.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")
        )
      ) {
        return false;
      }
      // Price
      if (filters.selectedPrice.length > 0) {
        if (filters.selectedPrice.includes("free") && course.price > 0 && !filters.selectedPrice.includes("paid")) {
          return false;
        }
        if (filters.selectedPrice.includes("paid") && course.price === 0 && !filters.selectedPrice.includes("free")) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price-asc") return a.price - b.price;
      if (filters.sortBy === "price-desc") return b.price - a.price;
      return 0;
    });
  }, [courses, filters]);

  const renderFilterContent = () => (
    <Accordion defaultValue={["categories", "price"]} type="multiple" className="w-full">
      {/* Categories filter */}
      <AccordionItem value="categories">
        <AccordionTrigger className="py-3 text-sm font-semibold">
          Categories
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          <ul className="space-y-3">
            {categories.map((category) => (
              <li key={category.id} className="flex items-center">
                <Checkbox
                  id={`cat-${category.id}`}
                  checked={filters.selectedCategories.includes(category.value || category.title.toLowerCase())}
                  onCheckedChange={() =>
                    dispatch(toggleCategoryFilter(category.value || category.title.toLowerCase()))
                  }
                />
                <label
                  htmlFor={`cat-${category.id}`}
                  className="ml-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {category.title}
                </label>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>

      {/* Price filter */}
      <AccordionItem value="price">
        <AccordionTrigger className="py-3 text-sm font-semibold">
          Price Range
        </AccordionTrigger>
        <AccordionContent className="pt-2">
          <ul className="space-y-3">
            {PRICE_OPTIONS.map((option) => (
              <li key={option.value} className="flex items-center">
                <Checkbox
                  id={`price-${option.value}`}
                  checked={filters.selectedPrice.includes(option.value)}
                  onCheckedChange={() => dispatch(togglePriceFilter(option.value))}
                />
                <label
                  htmlFor={`price-${option.value}`}
                  className="ml-3 text-sm text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  {option.label}
                </label>
              </li>
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );

  return (
    <section id="courses" className="container space-y-6 py-8">
      {/* Search and Header controls */}
      <div className="flex items-center justify-between border-b pb-6 flex-col gap-4 lg:flex-row">
        <div className="relative h-10 w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search courses by title or topic..."
            value={filters.searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="pl-9 pr-3 text-sm"
          />
        </div>

        <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto">
          <Select
            value={filters.sortBy}
            onValueChange={(val) => dispatch(setSortBy(val))}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
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

          {/* Mobile Filter Sheet */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <SheetHeader>
                  <SheetTitle className="text-left">Filter Courses</SheetTitle>
                </SheetHeader>
                <div className="mt-4">{renderFilterContent()}</div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(filters.selectedCategories.length > 0 ||
        filters.selectedPrice.length > 0 ||
        filters.searchQuery) && (
        <div className="flex items-center gap-2 flex-wrap pt-1">
          <span className="text-xs text-muted-foreground">Active Filters:</span>
          {filters.searchQuery && (
            <Button
              variant="secondary"
              size="sm"
              className="text-xs h-7 rounded-full gap-1"
              onClick={() => dispatch(setSearchQuery(""))}
            >
              Search: "{filters.searchQuery}"
              <X className="w-3 h-3" />
            </Button>
          )}
          {filters.selectedCategories.map((category) => (
            <Button
              key={category}
              variant="secondary"
              size="sm"
              className="text-xs h-7 rounded-full gap-1 text-sky-600"
              onClick={() => dispatch(toggleCategoryFilter(category))}
            >
              {category}
              <X className="w-3 h-3" />
            </Button>
          ))}
          {filters.selectedPrice.map((price) => (
            <Button
              key={price}
              variant="secondary"
              size="sm"
              className="text-xs h-7 rounded-full gap-1 text-sky-600"
              onClick={() => dispatch(togglePriceFilter(price))}
            >
              {price}
              <X className="w-3 h-3" />
            </Button>
          ))}
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 text-destructive hover:text-destructive"
            onClick={() => dispatch(clearFilters())}
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Main Grid & Filters */}
      <section className="pb-24 pt-4">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block space-y-4">
            <h3 className="font-semibold text-base mb-2">Filters</h3>
            {renderFilterContent()}
          </div>

          {/* Courses Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filteredCourses.length}</span> courses
              </p>
            </div>

            {filteredCourses.length === 0 ? (
              <div className="text-center py-16 border rounded-xl bg-card">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                <h3 className="text-lg font-semibold">No courses found</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Try adjusting your search criteria or clearing filters.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={() => dispatch(clearFilters())}
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
};

export default CoursesPage;
