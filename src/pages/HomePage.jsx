import React from 'react';
import HeroSlider from '../components/home/HeroSlider';
import CategoryGrid from '../components/home/CategoryGrid';
import DealOfTheWeek from '../components/home/DealOfTheWeek';
import SmegCarouselShowcase from '../components/home/SmegCarouselShowcase';
import ProductSections from '../components/home/ProductSections';
import HotOfferBanner from '../components/home/HotOfferBanner';

export default function HomePage({ onQuickView, onSelectCategory }) {
  return (
    <>
      <HeroSlider onSelectCategory={onSelectCategory} />
      <CategoryGrid onSelectCategory={onSelectCategory} />
      <SmegCarouselShowcase onQuickView={onQuickView} />
      <DealOfTheWeek onQuickView={onQuickView} onSelectCategory={onSelectCategory} />
      <ProductSections onQuickView={onQuickView} onSelectCategory={onSelectCategory} />
      <HotOfferBanner onSelectCategory={onSelectCategory} />
    </>
  );
}

