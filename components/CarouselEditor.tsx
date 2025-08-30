
import React, { useState, useCallback, useEffect } from 'react';
import { CarouselCard } from '../types';
import * as geminiService from '../services/geminiService';
import CarouselCardComponent from './CarouselCard';
import { PlusIcon, EyeIcon, Loader } from './Icons';

interface CarouselEditorProps {
  baseImage: string;
  cards: CarouselCard[];
  setCards: React.Dispatch<React.SetStateAction<CarouselCard[]>>;
  onPreview: () => void;
}

const CarouselEditor: React.FC<CarouselEditorProps> = ({ baseImage, cards, setCards, onPreview }) => {
  const [styleDescription, setStyleDescription] = useState<string | null>(null);
  const [isDescribingStyle, setIsDescribingStyle] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const analyzeStyle = useCallback(async () => {
    setIsDescribingStyle(true);
    setError(null);
    try {
      const description = await geminiService.describeImageStyle(baseImage);
      setStyleDescription(description);
    } catch (e) {
      console.error(e);
      setError('Failed to analyze image style. Please try a different image.');
    } finally {
      setIsDescribingStyle(false);
    }
  }, [baseImage]);

  useEffect(() => {
    analyzeStyle();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [baseImage]);

  const addCard = () => {
    setCards(prev => [...prev, { id: Date.now(), text: '', image: null, isGenerating: false, error: null }]);
  };

  const updateCardText = (id: number, text: string) => {
    setCards(prev => prev.map(card => card.id === id ? { ...card, text } : card));
  };

  const removeCard = (id: number) => {
    setCards(prev => prev.filter(card => card.id !== id));
  };

  const generateImage = async (id: number) => {
    if (!styleDescription) return;

    const card = cards.find(c => c.id === id);
    if (!card || !card.text) return;

    setCards(prev => prev.map(c => c.id === id ? { ...c, isGenerating: true, error: null } : c));

    try {
      const generatedImage = await geminiService.generateStyledImage(card.text, styleDescription);
      setCards(prev => prev.map(c => c.id === id ? { ...c, image: generatedImage, isGenerating: false } : c));
    } catch (e) {
      console.error(e);
      const errorMessage = e instanceof Error ? e.message : 'An unknown error occurred.';
      setCards(prev => prev.map(c => c.id === id ? { ...c, isGenerating: false, error: `Generation failed: ${errorMessage}` } : c));
    }
  };

  const updateCardImage = (id: number, image: string) => {
    setCards(prev => prev.map(c => c.id === id ? { ...c, image } : c));
  };

  const canPreview = cards.length > 0 && cards.every(card => card.image && !card.isGenerating);


  if (isDescribingStyle) {
    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <Loader className="w-12 h-12 text-emerald-400" />
            <h3 className="mt-4 text-xl font-semibold">Analyzing Image Style...</h3>
            <p className="text-gray-400 mt-2">The AI is learning the artistic essence of your image.</p>
        </div>
    );
  }

  if (error) {
     return <div className="text-center p-8 text-red-400 bg-red-900/20 rounded-lg">{error}</div>
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-1 lg:sticky top-8 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold border-b border-gray-600 pb-3 mb-4">Style Reference</h3>
          <img src={baseImage} alt="Base style reference" className="rounded-md w-full object-cover" />
          <div className="mt-4">
              <h4 className="font-semibold text-emerald-300">AI Style Analysis:</h4>
              <p className="text-sm text-gray-300 mt-2 bg-gray-700 p-3 rounded-md max-h-40 overflow-y-auto">
                {styleDescription || "Analyzing..."}
              </p>
          </div>
          <button
              onClick={onPreview}
              disabled={!canPreview}
              className="mt-6 w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-3 px-4 rounded-md hover:bg-emerald-500 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500"
            >
              <EyeIcon className="w-5 h-5" />
              Preview Carousel
            </button>
            {!canPreview && <p className="text-xs text-center mt-2 text-gray-400">Generate an image for every card to enable preview.</p>}
        </div>

        <div className="lg:col-span-2 space-y-6">
          {cards.map((card, index) => (
            <CarouselCardComponent
              key={card.id}
              card={card}
              index={index}
              onTextChange={updateCardText}
              onGenerate={generateImage}
              onRemove={removeCard}
              onImageUpdate={updateCardImage}
            />
          ))}
          <button
            onClick={addCard}
            className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-600 text-gray-400 hover:border-emerald-500 hover:text-emerald-400 transition-colors py-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500"
          >
            <PlusIcon className="w-5 h-5" />
            Add Another Card
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarouselEditor;
