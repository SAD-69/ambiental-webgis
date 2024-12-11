# Manual de Comandos Básicos do Git

## Configuração Inicial

### Configurar nome de usuário
```bash
git config --global user.name "Seu Nome"
```

### Configurar e-mail de usuário
```bash
git config --global user.email "seuemail@exemplo.com"
```

### Verificar configurações atuais
```bash
git config --list
```

---

## Inicialização de Repositório

### Criar um novo repositório
```bash
git init
```

### Clonar um repositório existente
```bash
git clone <URL-do-repositório>
```

---

## Controle de Versão Básico

### Verificar status do repositório
```bash
git status
```

### Adicionar arquivos ao staging
```bash
git add <arquivo>
```
Adicionar todos os arquivos:
```bash
git add .
```

### Confirmar alterações (commit)
```bash
git commit -m "Mensagem do commit"
```

### Verificar histórico de commits
```bash
git log
```

### Ver histórico de commits de forma resumida
```bash
git log --oneline
```

---

## Trabalhando com Branches

### Criar uma nova branch
```bash
git branch <nome-da-branch>
```

### Trocar para outra branch
```bash
git checkout <nome-da-branch>
```

### Criar e trocar para uma nova branch
```bash
git checkout -b <nome-da-branch>
```

### Listar branches
```bash
git branch
```

### Mesclar uma branch à branch atual
```bash
git merge <nome-da-branch>
```

### Deletar uma branch
```bash
git branch -d <nome-da-branch>
```

---

## Repositórios Remotos

### Adicionar um repositório remoto
```bash
git remote add origin <URL-do-repositório>
```

### Ver repositórios remotos configurados
```bash
git remote -v
```

### Enviar alterações para o repositório remoto
```bash
git push origin <nome-da-branch>
```

### Puxar alterações do repositório remoto
```bash
git pull origin <nome-da-branch>
```

---

## Resolver Conflitos

### Mostrar diferenças entre arquivos
```bash
git diff
```

### Após resolver conflitos, adicionar arquivos e fazer commit
```bash
git add <arquivo>
git commit -m "Resolvendo conflitos"
```

---

## Comandos Diversos

### Desfazer alterações antes de adicionar ao staging
```bash
git checkout -- <arquivo>
```

### Remover arquivos do staging
```bash
git reset <arquivo>
```

### Reverter o último commit (mantendo alterações no staging)
```bash
git reset --soft HEAD~1
```

### Reverter o último commit (removendo alterações)
```bash
git reset --hard HEAD~1
```
repositório e do sistema de arquivos
```bash
git rm <arquivo>
```

---

## Dicas Úteis

- Utilize `git help <comando>` para obter ajuda sobre qualquer comando Git.
- Sempre use mensagens de commit claras e descritivas.
- Antes de fazer um push, certifique-se de que sua branch está atualizada com o remoto usando `git pull`.

---

Este manual cobre os comandos básicos e mais utilizados no Git. Para operações mais avançadas, consulte a [documentação oficial do Git](https://git-scm.com/doc).