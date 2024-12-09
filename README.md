## CURSO FORMAÇÃO 2W AMBIENTAL PRO
### PROJETO WEBGIS FINAL MODELO

Esse repositório é um modelo para o projeto final do curso de Formação 2W (WebGIS e WebApps) da Ambiental Pro. A proposta é introduzir práticas com git, aplicando tecnologias estudadas no curso como Leaflet, Flask e Geoserver. O código faz requests em uma base do Geoserver do IBGE, onde renderiza 3 layers bases como Municípios, Estados e Regiões do Brasil. Durante a aula final, o código deve ser desenvolvido e registrado suas alterações utilizando o git.

#### Clonar repositório

* Com o comando `git clone`, clone o repositório 

`git clone https://github.com/SAD-69/ambiental-webgis.git`

#### Configuração
* Crie um ambiente virtual Python (de preferência na versão 3.10 ou superior), e instale as bibliotecas inseridas no requirements.txt

```bash
python -m venv venv
```

```bash
./venv/Scripts/activate

pip install -r requirements.txt
```

#### Execução

* Via terminal, ou por um editor de código, execute o arquivo app.py com o interpretador Python

```bash
python app.py
```

* Em seguida, abra a página http://127.0.0.1:5000/ e deve estar pronto para visualização.