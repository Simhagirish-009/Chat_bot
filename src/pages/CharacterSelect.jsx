import { useNavigate } from "react-router-dom";
import kakashiImg from "../assets/Kakashi1.jpg";
import narutoImg from "../assets/Naruto2.png";
import sasukeImg from "../assets/Sasuke1.jpg";
import sanemiImg from "../assets/Sanemi.jpg";
import rengokuImg from "../assets/Rengoku1.jpeg";
import tanjiroImg from "../assets/Tanjiro.jpg";
import shinobuImg from "../assets/Shinobu.jpg";
import itachiImg from "../assets/Itachi.jpg";

const characters = [
  { name: "Naruto Uzumaki", img: narutoImg },
  { name: "Sasuke Uchiha", img: sasukeImg },
  { name: "Kakashi Hatake", img: kakashiImg },
  { name: "Itachi Uchiha", img: itachiImg },
  { name: "Sanemi Shinazugawa", img: sanemiImg },
  { name: "Kyojuro Rengoku", img: rengokuImg },
  { name: "Tanjiro Kamado", img: tanjiroImg },
  { name: "Shinobu Kocho", img: shinobuImg },
];

export default function CharacterSelect() {
  const navigate = useNavigate();

  const handleSelect = (char) => {
    navigate("/charchat", { state: { character: char } });
  };

  return (
    <div className="py-10 px-4">
      <h2 className="text-center text-3xl font-bold mb-8">
        Select Your Character
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {characters.map((char) => (
          <div
            key={char.name}
            className="bg-white shadow-lg rounded-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300 cursor-pointer"
            onClick={() => handleSelect(char)}
          >
            <img
              src={char.img}
              alt={char.name}
              className="w-full h-60 object-contain bg-gray-100"
            />

            <div className="p-4 text-center">
              <h3 className="font-semibold text-lg mb-2">{char.name}</h3>

              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
                Chat
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
