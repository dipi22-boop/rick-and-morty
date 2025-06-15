import CharacterListPage from "../components/CharacterListPage";
import { CharacterDetailPage } from "../components/CharacterDetailPage";
import { useState } from 'react';

const Home = () => {
  const [route, setRoute] = useState({ name: 'list', characterId: null });

  const navigate = (name, characterId = null) => {
    setRoute({ name, characterId });
    window.scrollTo(0, 0);
  };
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="text-white">
        {route.name === 'list' && <CharacterListPage onCharacterSelect={(id) => navigate('detail', id)} />}
        {route.name === 'detail' && <CharacterDetailPage characterId={route.characterId} onBack={() => navigate('list')} />}
      </div>
    </div>
  );
};

export default Home;
