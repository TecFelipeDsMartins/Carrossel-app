
import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import * as geminiService from '../services/geminiService';
import { Loader, MagicWandIcon, CloseIcon } from './Icons';

interface ImageEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  baseImage: string;
  onImageUpdate: (newImage: string) => void;
}

const ImageEditorModal: React.FC<ImageEditorModalProps> = ({ isOpen, onClose, baseImage, onImageUpdate }) => {
  const [prompt, setPrompt] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);

  const handleEdit = async () => {
    if (!prompt) return;
    setIsEditing(true);
    setError(null);
    try {
      const newImage = await geminiService.editImage(editedImage || baseImage, prompt);
      setEditedImage(newImage);
      setPrompt(''); // Clear prompt after successful edit
    } catch (e) {
      console.error(e);
      setError('Failed to edit image. Please try again.');
    } finally {
      setIsEditing(false);
    }
  };

  const handleSave = () => {
    if (editedImage) {
      onImageUpdate(editedImage);
    }
    onClose();
  };
  
  const handleClose = () => {
      setEditedImage(null);
      setError(null);
      setPrompt('');
      onClose();
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-white flex justify-between items-center">
                  <span>Edit Image with AI</span>
                  <button onClick={handleClose} className="p-1 rounded-full hover:bg-gray-700 transition-colors">
                    <CloseIcon className="w-5 h-5 text-gray-400"/>
                  </button>
                </Dialog.Title>
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative aspect-square bg-gray-700/50 rounded-md">
                        <img src={editedImage || baseImage} alt="Image to edit" className="w-full h-full object-cover rounded-md" />
                        {isEditing && (
                             <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800/80 rounded-md z-10">
                                <Loader className="w-10 h-10 text-emerald-400" />
                                <p className="text-sm mt-2 text-white">Applying changes...</p>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm text-gray-400 mb-2">Describe the change you want to make:</p>
                        <textarea
                            rows={4}
                            className="w-full bg-gray-700 border border-gray-600 rounded-md text-gray-200 p-3 focus:ring-emerald-500 focus:border-emerald-500 transition"
                            placeholder="e.g., Add a small cat in the bottom right corner."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                        <button
                            onClick={handleEdit}
                            disabled={!prompt || isEditing}
                            className="mt-3 w-full flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-500 transition-all disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            {isEditing ? <Loader className="w-5 h-5"/> : <MagicWandIcon className="w-5 h-5" />}
                            Apply Edit
                        </button>
                        {error && <p className="text-xs mt-2 text-red-400">{error}</p>}

                    </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-700 px-4 py-2 text-sm font-medium text-gray-200 hover:bg-gray-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800"
                    onClick={handleClose}
                  >
                    Cancel
                  </button>
                   <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-800 disabled:bg-gray-500 disabled:cursor-not-allowed"
                    onClick={handleSave}
                    disabled={!editedImage}
                  >
                    Save Changes
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ImageEditorModal;
