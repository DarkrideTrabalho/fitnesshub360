
# Instruções para Configurar o Supabase

Este diretório contém scripts SQL para configurar e popular o banco de dados Supabase para o FitnessHub. Siga as instruções abaixo para configurar seu projeto Supabase corretamente.

## 1. Estrutura de Tabelas

O arquivo `init_tables.sql` contém todas as definições das tabelas, políticas RLS (Row Level Security) e funções necessárias para o aplicativo. Execute este script primeiro.

## 2. Dados Iniciais

O arquivo `seed_data.sql` contém dados de exemplo para que você possa começar a usar o aplicativo imediatamente. Execute este script depois de configurar as tabelas.

## Como Executar os Scripts no Supabase

1. Acesse o painel de controle do seu projeto Supabase
2. Clique em "SQL Editor" no menu lateral
3. Crie um novo script (New Query)
4. Copie e cole o conteúdo de `init_tables.sql`
5. Execute o script (Run)
6. Repita os passos 3-5 para o arquivo `seed_data.sql`

## Usuários de Teste

Após executar os scripts, os seguintes usuários estarão disponíveis para teste:

**Admin:**
- Email: admin@fitnesshub.com
- Senha: password

**Professores:**
- Email: john@fitnesshub.com
- Email: sarah@fitnesshub.com
- Email: carlos@fitnesshub.com
- Senha: password (mesma para todos)

**Alunos:**
- Email: mike@example.com
- Email: lisa@example.com
- Email: alex@example.com
- Email: emma@example.com
- Senha: password (mesma para todos)

## Notas Importantes

- As senhas usadas nestes scripts são apenas para fins de demonstração. Em um ambiente de produção, use senhas fortes e únicas.
- As políticas RLS estão configuradas para proteger os dados, permitindo que os usuários vejam apenas os dados que têm permissão para acessar.
- A função `handle_new_user` cria automaticamente um perfil de aluno para novos usuários que se registram.
