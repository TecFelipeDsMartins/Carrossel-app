
import React, { useState } from 'react';
import { AppState, CarouselCard } from './types';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import CarouselEditor from './components/CarouselEditor';
import CarouselPreview from './components/CarouselPreview';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.START);
  const [baseImage, setBaseImage] = useState<string | null>(null);
  const [cards, setCards] = useState<CarouselCard[]>([]);

  const handleImageUpload = (imageDataUrl: string) => {
    setBaseImage(imageDataUrl);
    setCards([{ id: Date.now(), text: '', image: null, isGenerating: false, error: null }]);
    setAppState(AppState.EDITING);
  };
  
  const handleStartOver = () => {
    setBaseImage(null);
    setCards([]);
    setAppState(AppState.START);
  };

  const renderContent = () => {
    switch (appState) {
      case AppState.START:
        return <ImageUploader onImageUpload={handleImageUpload} />;
      case AppState.EDITING:
        if (!baseImage) {
           handleStartOver();
           return null;
        }
        return (
          <CarouselEditor 
            baseImage={baseImage} 
            cards={cards} 
            setCards={setCards} 
            onPreview={() => setAppState(AppState.PREVIEW)}
          />
        );
      case AppState.PREVIEW:
        return (
          <CarouselPreview 
            cards={cards} 
            onBackToEditor={() => setAppState(AppState.EDITING)} 
          />
        );
      default:
        return <ImageUploader onImageUpload={handleImageUpload} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
      <Header onStartOver={handleStartOver} showStartOver={appState !== AppState.START}/>
      <main className="p-4 sm:p-6 lg:p-8">
        {renderContent()}
      </main>
      <footer className="text-center p-4 text-xs text-gray-500">
        <p>Powered by Gemini API. Designed for an amazing user experience.</p>
      </footer>
    </div>
  );
};

export default App;
