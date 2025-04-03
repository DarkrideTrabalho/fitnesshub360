// AvaliacaoSection.tsx
import React from "react";

interface Avaliacao {
  nome: string;
  texto: string;
  nota: number;
  foto: string;
}

const avaliacoes: Avaliacao[] = [
  {
    nome: "João Silva",
    texto: "A plataforma é incrível! Muito fácil de usar e intuitiva.",
    nota: 5,
    foto: "https://gravatar.com/avatar/886366861118f639225ae274b4b9e04b?s=400&d=robohash&r=x",
  },
  {
    nome: "Maria Oliveira",
    texto: "Ótima experiência! O suporte é excelente.",
    nota: 4,
    foto: "https://gravatar.com/avatar/1651bed651d41027d9e64744e0f7e524?s=400&d=retro&r=x",
  },
  {
    nome: "Carlos Pereira",
    texto: "A interface é bonita, mas poderia ter mais funcionalidades.",
    nota: 3,
    foto: "https://gravatar.com/avatar/7353eea3be4b6be36041ce9606b57bb9?s=400&d=robohash&r=x",
  },
];

const Evaluation: React.FC = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900">
            Avaliações da Plataforma
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Veja o que nossos usuários estão dizendo sobre nós.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {avaliacoes.map((avaliacao, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md flex">
              <img
                src={avaliacao.foto}
                alt={avaliacao.nome}
                className="w-16 h-16 rounded-full mr-4"
              />
              <div>
                <h3 className="text-xl font-semibold text-slate-800">
                  {avaliacao.nome}
                </h3>
                <p className="mt-2 text-gray-600">{avaliacao.texto}</p>
                <div className="mt-4">
                  {Array.from({ length: avaliacao.nota }, (_, i) => (
                    <span key={i} className="text-yellow-500">
                      ★
                    </span>
                  ))}
                  {Array.from({ length: 5 - avaliacao.nota }, (_, i) => (
                    <span key={i} className="text-gray-300">
                      ★
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default Evaluation;
