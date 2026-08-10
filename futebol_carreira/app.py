from flask import Flask, render_template, request, session
from models.player import Jogador
import os

app = Flask(__name__)
app.secret_key = 'chave-muito-secreta'  # Troque por algo mais seguro

@app.route('/')
def index():
    # Se não houver jogador na sessão, cria um novo
    if 'jogador' not in session:
        jogador = Jogador(nome="Pelézinho", posicao="Atacante", idade=14)
        session['jogador'] = jogador.to_dict()
    
    # Converte o dicionário de volta para objeto (opcional, mas facilita)
    jogador_dict = session['jogador']
    return render_template('index.html', jogador=jogador_dict)

@app.route('/treinar', methods=['POST'])
def treinar():
    # Recupera o dicionário
    jogador_dict = session.get('jogador')
    if jogador_dict:
        # Aplica o treino (exemplo: +2 na finalização)
        jogador_dict['finalizacao'] = min(100, jogador_dict['finalizacao'] + 2)
        jogador_dict['energia'] = max(0, jogador_dict['energia'] - 5)
        session['jogador'] = jogador_dict
    return index()

@app.route('/resetar')
def resetar():
    session.clear()
    return index()

if __name__ == '__main__':
    app.run(debug=True)