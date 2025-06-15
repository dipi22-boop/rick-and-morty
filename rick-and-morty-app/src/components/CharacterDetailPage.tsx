import React, { useState } from 'react';
import {
    useQuery,
} from '@tanstack/react-query';
const fetchCharacterById = async (id: number): Promise<Character> => {
    const response = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
};

// --- Character Detail Page Component ---
export function CharacterDetailPage({ characterId, onBack }) {
    const { data: character, isLoading, isError, error } = useQuery<Character, Error>({
        queryKey: ['character', characterId],
        queryFn: () => fetchCharacterById(characterId),
    });

    const DetailItem = ({ label, value }) => (
        <div className="py-2 flex justify-between items-center border-b border-gray-700 last:border-b-0">
            <dt className="text-sm font-medium text-gray-400">{label}</dt>
            <dd className="text-sm text-white font-semibold text-right">{value}</dd>
        </div>
    );
    console.log('character-->',character)
    return (
        <div className="p-4">
            <button
                onClick={onBack}
                className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-cyan-500 flex items-center"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Back to List
            </button>

            {isLoading && (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-b-4 border-cyan-400"></div>
                </div>
            )}
            {isError && <div className="text-center text-red-500 bg-red-900/20 p-4 rounded-md">Error: {error.message}</div>}

            {character && (
                <div className="flex justify-center">
                    <div className="bg-gray-600 rounded-lg max-w-md w-full">
                        <img className="w-full h-auto" src={character.image} alt={character.name} />
                        <div className="p-6">
                            <div className="flex justify-between items-baseline">
                                <h1 className="text-3xl font-bold text-white leading-tight">{character.name}</h1>
                            </div>
                            <div className="mt-4 border-t border-gray-700 pt-4">
                                <dl>
                                    <DetailItem label="Species" value={character.species} />
                                    <DetailItem label="Status" value={character.status} />
                                    <DetailItem label="Gender" value={character.gender} />
                                    <DetailItem label="Appearances" value={`${character.episode.length} episodes`} />
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}