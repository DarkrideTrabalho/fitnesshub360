
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Users, Calendar, CheckCircle, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const features = [
    {
      icon: <Users className="h-5 w-5" />,
      title: "Comunidade Ativa",
      description: "Conecte-se com outros alunos e professores para motivação extra."
    },
    {
      icon: <Calendar className="h-5 w-5" />,
      title: "Aulas Diversificadas",
      description: "Mais de 20 modalidades diferentes para sua rotina nunca ficar monótona."
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Check-in Fácil",
      description: "Registre sua presença no ginásio com apenas um toque."
    }
  ];

  const testimonials = [
    {
      quote: "O app facilitou muito minha vida! Consigo ver todas as aulas e me matricular facilmente.",
      author: "Maria S.",
      role: "Aluna Premium"
    },
    {
      quote: "Como professor, posso gerenciar meus horários e alunos de forma prática e eficiente.",
      author: "João P.",
      role: "Professor de Yoga"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-xl font-bold text-slate-900">
            Fitness<span className="text-primary">Hub</span>
          </div>
          <Link to="/login">
            <Button variant="ghost" className="rounded-full">Entrar</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col">
        {/* Hero Section */}
        <section className="relative py-16 md:py-24 px-4 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl -z-10"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-100 rounded-full blur-3xl -z-10"></div>
          
          <div className="container mx-auto max-w-6xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  Eleve sua jornada fitness
                </h1>
                <p className="mt-6 text-lg text-slate-600 max-w-lg">
                  Gerencie suas aulas, acompanhe seu progresso e conecte-se com uma comunidade motivada em um único aplicativo.
                </p>
                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <Link to="/login">
                    <Button size="lg" className="rounded-full px-8 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                      Começar agora
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 shadow-2xl shadow-slate-200/50">
                  <img
                    src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
                    alt="Fitness Hub"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
                </div>
                
                <motion.div 
                  className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-slate-100"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl">
                      <Calendar className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        50+ Aulas Semanais
                      </p>
                      <p className="text-xs text-slate-500">
                        Para todos os níveis
                      </p>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="absolute -top-6 -left-6 bg-white p-3 rounded-2xl shadow-xl border border-slate-100"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-50 p-2 rounded-xl">
                      <Users className="h-5 w-5 text-emerald-500" />
                    </div>
                    <p className="text-xs font-medium text-slate-900">
                      Comunidade ativa
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-white">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900">
                Projetado para Todos
              </h2>
              <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
                Nossa plataforma se adapta ao seu perfil, seja você aluno, professor ou administrador.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl border border-slate-100 shadow-lg shadow-slate-100/50 hover:shadow-xl transition-all hover:-translate-y-1"
                >
                  <div className="p-3 bg-primary/10 inline-flex rounded-xl mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Testimonials */}
        <section className="py-16 px-4 bg-gradient-to-br from-primary/5 to-slate-50">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-slate-900">
                O que nossos usuários dizem
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {testimonials.map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100"
                >
                  <div className="mb-4 text-amber-500">
                    {"★".repeat(5)}
                  </div>
                  <p className="text-slate-800 italic mb-4">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.author}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-primary rounded-3xl p-8 md:p-12 shadow-2xl shadow-primary/20 relative overflow-hidden"
            >
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-xl"></div>
              
              <div className="relative z-10">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Pronto para transformar sua rotina fitness?
                </h2>
                <p className="text-white/80 mb-8 max-w-xl">
                  Junte-se a milhares de usuários que estão otimizando seus treinos e alcançando resultados extraordinários.
                </p>
                <Link to="/login">
                  <Button size="lg" variant="secondary" className="rounded-full px-8 font-medium shadow-lg">
                    Comece agora
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-900 text-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold mb-4">
                Fitness<span className="text-primary">Hub</span>
              </div>
              <p className="text-slate-400 text-sm">
                A plataforma completa para gerenciar sua experiência fitness.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Links Rápidos</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Sobre nós</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Modalidades</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Professores</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Recursos</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Suporte</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-white mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookies</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-500">
            © 2023 FitnessHub. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
