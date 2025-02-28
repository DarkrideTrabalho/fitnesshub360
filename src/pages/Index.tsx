
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, MessageSquare, Image, ChevronLeft, ChevronRight } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Atualize com seu token público do Mapbox - apenas para uso no front-end
mapboxgl.accessToken = "pk.eyJ1IjoiZXhhbXBsZXVzZXIiLCJhIjoiY2xoNnFiaWdhMDJraTNlcGMweGYzZjRkdCJ9.VoJA7XizmYMXmTiLAjCWxQ";

const carouselImages = [
  {
    url: "https://images.unsplash.com/photo-1534258936925-c58bed479fcb",
    title: "Equipamentos modernos",
    description: "Nossa academia conta com equipamentos de última geração"
  },
  {
    url: "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2",
    title: "Aulas personalizadas",
    description: "Profissionais qualificados para atender suas necessidades"
  },
  {
    url: "https://images.unsplash.com/photo-1599901860904-17e6ed7083a0",
    title: "Ambiente inspirador",
    description: "Espaço pensado para seu bem-estar e motivação"
  }
];

const Index = () => {
  const navigate = useNavigate();
  const { userProfile, isLoading } = useAuth();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState([
    { sender: "system", text: "Olá! Como podemos ajudar você hoje?" },
    { sender: "system", text: "Experimente perguntar sobre nossas aulas ou planos." }
  ]);

  // Efeito para redirecionamento após login
  useEffect(() => {
    if (!isLoading) {
      if (userProfile) {
        // Redirecionar com base no papel do usuário
        switch (userProfile.role) {
          case "admin":
            navigate("/admin");
            break;
          case "teacher":
            navigate("/teacher");
            break;
          case "student":
            navigate("/student");
            break;
          default:
            navigate("/login");
        }
      }
    }
  }, [userProfile, isLoading, navigate]);

  // Efeito para inicializar o mapa
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [-9.1393, 38.7223], // Lisboa, Portugal
      zoom: 12
    });

    // Adicionar marcador para Lisboa
    new mapboxgl.Marker({ color: "#f43f5e" })
      .setLngLat([-9.1393, 38.7223])
      .setPopup(
        new mapboxgl.Popup({ offset: 25 })
          .setHTML('<h3 class="text-sm font-bold">FitnessHub Lisboa</h3><p class="text-xs">Sua academia em Lisboa!</p>')
      )
      .addTo(map.current);

    // Adicionar controles de navegação
    map.current.addControl(
      new mapboxgl.NavigationControl(),
      'top-right'
    );

    // Limpeza
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Função para avançar o carrossel
  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % carouselImages.length);
  };

  // Função para voltar no carrossel
  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  // Configuração do carrossel automático
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Função para enviar mensagem
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    // Adiciona mensagem do usuário
    setMessages((prev) => [...prev, { sender: "user", text: messageInput }]);
    
    // Simula uma resposta do sistema após 1 segundo
    setTimeout(() => {
      setMessages((prev) => [
        ...prev, 
        { 
          sender: "system", 
          text: "Obrigado pelo seu contato! Um de nossos atendentes retornará em breve." 
        }
      ]);
    }, 1000);
    
    setMessageInput("");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 sticky top-0 z-30">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-xl font-bold text-slate-900">
              Fitness<span className="text-primary">Hub</span>
            </span>
          </div>
          <nav>
            <Button
              variant="default"
              size="sm"
              onClick={() => navigate("/login")}
            >
              Entrar
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section com Carrossel */}
      <section className="relative h-[70vh] bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
        {/* Overlay com texto */}
        <div className="absolute inset-0 z-10 flex items-center">
          <div className="container mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-white max-w-3xl mx-auto"
            >
              Gerencie sua academia de forma simples e eficiente
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-6 text-xl text-slate-200 max-w-2xl mx-auto"
            >
              Plataforma completa para administradores, professores e alunos, tudo em um só lugar.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-10"
            >
              <Button size="lg" onClick={() => navigate("/login")}>
                Começar agora
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Carrossel de Imagens */}
        <div className="absolute inset-0 z-0">
          {carouselImages.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === activeSlide ? "opacity-70" : "opacity-0"
              }`}
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover"
              />
            </div>
          ))}

          {/* Controles do carrossel */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Indicadores do carrossel */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === activeSlide ? "bg-white" : "bg-white/40"
                }`}
                onClick={() => setActiveSlide(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Nossas Funcionalidades</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              O FitnessHub oferece um conjunto completo de ferramentas para gerenciar
              todos os aspectos da sua academia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-2xl p-8 shadow-sm border border-slate-100"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Gestão de Aulas</h3>
              <p className="text-slate-600">
                Gerencie facilmente todas as aulas, horários e instrutores em um só lugar.
                Acompanhe a frequência e o progresso dos alunos.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-2xl p-8 shadow-sm border border-slate-100"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Comunicação Integrada</h3>
              <p className="text-slate-600">
                Mantenha todos informados com nosso sistema de mensagens integrado.
                Envie avisos, atualizações e feedback pessoal.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-2xl p-8 shadow-sm border border-slate-100"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Múltiplas Unidades</h3>
              <p className="text-slate-600">
                Gerencie várias unidades da sua academia com facilidade.
                Tenha uma visão completa de todas as suas localizações.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mapa Section */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">Nossa Localização</h2>
            <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
              Visite nossa unidade principal em Lisboa, Portugal. Estamos estrategicamente
              localizados para melhor atender nossos clientes.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 h-[400px]"
          >
            <div ref={mapContainer} className="w-full h-full" />
          </motion.div>

          <div className="mt-8 text-center">
            <p className="text-slate-600">
              <MapPin className="inline-block mr-2 text-primary" size={18} />
              Av. da Liberdade 110, 1250-146 Lisboa, Portugal
            </p>
          </div>
        </div>
      </section>

      {/* Messaging Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900">Fale Conosco</h2>
              <p className="mt-4 text-lg text-slate-600">
                Tire suas dúvidas, solicite informações ou agende uma visita.
                Estamos aqui para ajudar.
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="bg-slate-50 rounded-2xl p-6 shadow-sm border border-slate-100"
            >
              <div className="flex flex-col h-[350px]">
                <div className="flex-1 overflow-y-auto mb-4 p-4 bg-white rounded-lg">
                  {messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`mb-4 flex ${
                        msg.sender === "user" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          msg.sender === "user"
                            ? "bg-primary text-white"
                            : "bg-slate-200 text-slate-800"
                        }`}
                      >
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Digite sua mensagem..."
                    className="flex-1 rounded-lg border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Button type="submit" variant="default" size="sm">
                    Enviar
                  </Button>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/90 to-primary">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Pronto para transformar sua academia?
          </h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10">
            Junte-se a milhares de academias que já utilizam o FitnessHub para 
            otimizar suas operações e melhorar a experiência dos alunos.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="bg-white text-primary hover:bg-white/90"
            onClick={() => navigate("/login")}
          >
            Comece agora gratuitamente
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 text-slate-400">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">FitnessHub</h3>
              <p className="text-sm">
                A plataforma completa para gerenciamento de academias. Simples, eficiente e moderna.
              </p>
            </div>
            <div>
              <h4 className="text-white text-base font-medium mb-4">Produto</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-base font-medium mb-4">Empresa</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Sobre nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Carreiras</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-base font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Termos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">&copy; {new Date().getFullYear()} FitnessHub. Todos os direitos reservados.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
