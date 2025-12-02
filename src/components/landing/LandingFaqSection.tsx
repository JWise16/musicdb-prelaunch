/**
 * Landing Page FAQ Section
 * FAQ accordion with smooth animations
 */

import { useState, useRef, useEffect } from 'react';

interface FaqItem {
  question: string;
  answer: string;
}

interface FaqAccordionItemProps {
  item: FaqItem;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const FaqAccordionItem = ({ item, index, isExpanded, onToggle }: FaqAccordionItemProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [item.answer]);

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-4 md:py-5 lg:py-6 text-left text-lg sm:text-xl md:text-2xl font-medium text-black hover:text-gray-800 transition-colors"
        aria-expanded={isExpanded}
        aria-controls={`faq-answer-${index}`}
      >
        <span className="pr-4">{item.question}</span>
        <span 
          className={`ml-4 text-2xl md:text-3xl flex-shrink-0 transition-transform duration-300 ${
            isExpanded ? 'rotate-45' : 'rotate-0'
          }`}
        >
          +
        </span>
      </button>
      <div
        id={`faq-answer-${index}`}
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{ 
          maxHeight: isExpanded ? `${contentHeight}px` : '0px',
          opacity: isExpanded ? 1 : 0
        }}
      >
        <div 
          ref={contentRef}
          className="pb-4 md:pb-5 lg:pb-6 text-black text-base sm:text-lg md:text-xl leading-relaxed whitespace-pre-line"
        >
          {item.answer}
        </div>
      </div>
    </div>
  );
};

export const LandingFaqSection = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const faqItems: FaqItem[] = [
    {
      question: "Is my data private?",
      answer: "Your data is secure and belongs to you. We don't share it with external partners or use it for anything other than powering your venue's operations. What happens in your MusicDB stays in your MusicDB."
    },
    {
      question: "What support is offered to customers?",
      answer: "We build custom solutions for each venue, making our tool work for you - not the other way around. Our team can support you in migrating your current calendar onto our platform, and customers always have a direct line of contact to the founding team."
    },
    {
      question: "How is MusicDB different than other tools on the market?",
      answer: "Three things set us apart:\n\nBuilt-in discovery tools. Our competitors don't have this. Research any artist with streaming stats, social metrics, and live performance history. Track what shows are happening around you on an interactive map to avoid conflicts. Share events across the platform to help venues fill gaps and support each other. We're helping you book smarter, not just manage what you've already booked.\n\nCleaner UI (we're biased). We've obsessed over making MusicDB intuitive and pleasant to use. When you're in the tool multiple times a day, design matters.\n\nNo fluff. Competitors have gotten bloated with features most indie venues don't need. We focus on doing the essential things exceptionally well."
    }
  ];

  return (
    <section id="faq" className="pt-8 md:pt-12 lg:pt-16 pb-20">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        {/* FAQ Pill */}
        <div className="flex justify-center mb-6 md:mb-8">
          <div className="bg-blue-100 text-blue-800 px-6 py-2.5 md:px-7 md:py-3.5 rounded-full font-medium text-lg md:text-xl">
            FAQ
          </div>
        </div>
        
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-8 md:mb-10 lg:mb-12 text-center">
          Questions? We've Got Answers
        </h2>
        
        <div className="space-y-3 md:space-y-4 max-w-4xl mx-auto">
          {faqItems.map((item, index) => (
            <FaqAccordionItem
              key={index}
              item={item}
              index={index}
              isExpanded={expandedFaq === index}
              onToggle={() => toggleFaq(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

