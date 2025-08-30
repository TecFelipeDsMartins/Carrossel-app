
import React, { useState } from 'react';
import { CarouselCard } from '../types';
import { LeftArrowIcon, RightArrowIcon, DownloadIcon } from './Icons';

interface CarouselPreviewProps {
  cards: CarouselCard[];
  onBackToEditor: () => void;
}

const CarouselPreview: React.FC<CarouselPreviewProps> = ({ cards, onBackToEditor }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0;
    const newIndex = isFirstSlide ? cards.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const goToNext = () => {
    const isLastSlide = currentIndex === cards.length - 1;
    const newIndex = isLastSlide ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
  };

  const downloadImage = (image: string | null, index: number) => {
    if (!image) return;
    const link = document.createElement('a');
    link.href = image;
    link.download = `carousel-image-${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  const downloadAllImages = () => {
      cards.forEach((card, index) => {
          downloadImage(card.image, index);
      })
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">Carousel Preview</h2>
      <div className="relative w-full max-w-lg aspect-square">
        <div className="overflow-hidden w-full h-full rounded-lg shadow-2xl bg-gray-800">
          {cards.map((card, cardIndex) => (
            <div
              key={card.id}
              className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${cardIndex === currentIndex ? 'opacity-100 z-10' : 'opacity-0'}`}
            >
              {card.image && (
                <img src={card.image} alt={`Slide ${cardIndex + 1}`} className="w-full h-full object-cover" />
              )}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-lg font-medium drop-shadow-lg">{card.text}</p>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={goToPrevious}
          className="absolute top-1/2 -left-4 md:-left-12 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors z-20"
        >
          <LeftArrowIcon className="w-6 h-6" />
        </button>
        <button
          onClick={goToNext}
          className="absolute top-1/2 -right-4 md:-right-12 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors z-20"
        >
          <RightArrowIcon className="w-6 h-6" />
        </button>
      </div>
      <div className="flex mt-4">
        {cards.map((_, index) => (
          <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full mx-1 transition-colors ${currentIndex === index ? 'bg-emerald-400' : 'bg-gray-600'}`}></button>
        ))}
      </div>
      
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <button
          onClick={onBackToEditor}
          className="bg-gray-700 text-white font-bold py-3 px-6 rounded-md hover:bg-gray-600 transition-colors"
        >
          Back to Editor
        </button>
        <button
            onClick={downloadAllImages}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 px-6 rounded-md hover:bg-emerald-500 transition-colors"
        >
            <DownloadIcon className="w-5 h-5"/>
            Download All Images
        </button>
      </div>
    </div>
  );
};

export default CarouselPreview;
