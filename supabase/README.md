# FitnessHub - Configuração do Banco de Dados

Este repositório contém os scripts de configuração para a estrutura do banco de dados do aplicativo FitnessHub no Supabase.

## Estrutura de Arquivos

- `config.toml` - Configuração do projeto Supabase
- `init_tables.sql` - Script para criar a estrutura inicial do banco de dados (tabelas, triggers, índices)
- `seed_data.sql` - Script para popular o banco de dados com dados iniciais
- `check_integrity.sql` - Script para verificar e corrigir a integridade dos dados

## Como Usar

1. Configure o projeto no Supabase e atualize o `project_id` no arquivo `config.toml`
2. Execute o script `init_tables.sql` para criar a estrutura do banco de dados
3. Execute o script `seed_data.sql` para popular o banco de dados com dados iniciais
4. Use o script `check_integrity.sql` periodicamente para verificar e corrigir a integridade dos dados

## Modelo de Dados

O sistema possui as seguintes entidades principais:

- **Admin Profiles**: Perfis de administradores do sistema
- **Teacher Profiles**: Perfis de professores com suas especialidades
- **Student Profiles**: Perfis de alunos com detalhes de associação
- **Classes**: Aulas oferecidas pelos professores
- **Enrollments**: Matrículas dos alunos nas aulas
- **Vacations**: Períodos de férias dos professores

## Recursos Implementados

- Triggers para atualização automática do timestamp `updated_at`
- Triggers para manter o contador de matrículas (`enrolled_count`) sincronizado
- Índices para melhorar a performance de consultas comuns
- Restrições de integridade para garantir a validade dos dados
- Seed data para desenvolvimento e testes

## Credenciais de Teste

Todos os usuários de teste têm a senha: `password`

- Admin: admin@fitnesshub.com
- Professores: john@fitnesshub.com, sarah@fitnesshub.com, carlos@fitnesshub.com
- Alunos: mike@example.com, lisa@example.com, alex@example.com, emma@example.com
