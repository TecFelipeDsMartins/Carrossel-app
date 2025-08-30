
import React, { useState } from 'react';
import { CarouselCard } from '../types';
import { MagicWandIcon, TrashIcon, Loader, EditIcon } from './Icons';
import ImageEditorModal from './ImageEditorModal';

interface CarouselCardProps {
  card: CarouselCard;
  index: number;
  onTextChange: (id: number, text: string) => void;
  onGenerate: (id: number) => void;
  onRemove: (id: number) => void;
  onImageUpdate: (id: number, image: string) => void;
}

const CarouselCardComponent: React.FC<CarouselCardProps> = ({ card, index, onTextChange, onGenerate, onRemove, onImageUpdate }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  
  return (
    <div className="bg-gray-800 p-5 rounded-lg shadow-lg relative transition-all duration-300 hover:shadow-emerald-900/30">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
                <label htmlFor={`card-text-${card.id}`} className="block text-sm font-medium text-gray-300 mb-2">
                    Card {index + 1} Content
                </label>
                <textarea
                    id={`card-text-${card.id}`}
                    rows={6}
                    className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 p-3 focus:ring-emerald-500 focus:border-emerald-500 transition"
                    placeholder="e.g., A futuristic city skyline at sunset..."
                    value={card.text}
                    onChange={(e) => onTextChange(card.id, e.target.value)}
                />
                 <div className="mt-3 flex gap-2">
                    <button
                        onClick={() => onGenerate(card.id)}
                        disabled={!card.text || card.isGenerating}
                        className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-500 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-emerald-500"
                    >
                        {card.isGenerating ? <Loader className="w-5 h-5"/> : <MagicWandIcon className="w-5 h-5" />}
                        {card.isGenerating ? 'Generating...' : 'Generate Image'}
                    </button>
                    {index > 0 && (
                        <button
                            onClick={() => onRemove(card.id)}
                            className="p-2 text-gray-400 bg-gray-700 rounded-md hover:bg-red-500 hover:text-white transition-colors"
                            aria-label="Remove card"
                        >
                            <TrashIcon className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex items-center justify-center bg-gray-700/50 rounded-md aspect-square relative group">
                {card.isGenerating && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/80 rounded-md z-10">
                        <Loader className="w-10 h-10 text-emerald-400" />
                        <p className="text-sm mt-2">Creating magic...</p>
                    </div>
                )}
                {card.error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-900/80 rounded-md p-4 text-center">
                        <p className="text-sm text-red-200">{card.error}</p>
                    </div>
                )}
                {card.image && !card.isGenerating && (
                    <>
                        <img src={card.image} alt={`Generated for card ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <button 
                                onClick={() => setIsEditorOpen(true)}
                                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white font-semibold py-2 px-4 rounded-md hover:bg-white/30 transition-colors"
                            >
                                <EditIcon className="w-5 h-5" />
                                Edit
                            </button>
                        </div>
                    </>
                )}
                {!card.image && !card.isGenerating && (
                     <div className="text-gray-500 text-center p-4">
                        <MagicWandIcon className="w-12 h-12 mx-auto mb-2" />
                        <p className="text-sm">Your generated image will appear here.</p>
                    </div>
                )}
            </div>
        </div>
        {isEditorOpen && card.image && (
          <ImageEditorModal 
            isOpen={isEditorOpen}
            onClose={() => setIsEditorOpen(false)}
            baseImage={card.image}
            onImageUpdate={(newImage) => onImageUpdate(card.id, newImage)}
          />
        )}
    </div>
  );
};

export default CarouselCardComponent;
