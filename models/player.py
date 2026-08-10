# models/player.py

class Jogador:
    def __init__(self, nome="Craque", posicao="Atacante", idade=14):
        self.nome = nome
        self.posicao = posicao
        self.idade = idade
        # Atributos principais (0-100)
        self.finalizacao = 50
        self.passe = 50
        self.drible = 50
        self.fisico = 50
        self.defesa = 50
        self.mental = 50
        self.energia = 100
        self.clube = "Base"
        self.gols = 0
        self.assistencias = 0
        self.nota_media = 6.0

    def to_dict(self):
        """Converte o objeto para dicionário (para salvar na session)"""
        return {
            'nome': self.nome,
            'posicao': self.posicao,
            'idade': self.idade,
            'finalizacao': self.finalizacao,
            'passe': self.passe,
            'drible': self.drible,
            'fisico': self.fisico,
            'defesa': self.defesa,
            'mental': self.mental,
            'energia': self.energia,
            'clube': self.clube,
            'gols': self.gols,
            'assistencias': self.assistencias,
            'nota_media': self.nota_media
        }

    @classmethod
    def from_dict(cls, dados):
        """Recria um objeto Jogador a partir de um dicionário"""
        jogador = cls(
            nome=dados.get('nome', 'Craque'),
            posicao=dados.get('posicao', 'Atacante'),
            idade=dados.get('idade', 14)
        )
        jogador.finalizacao = dados.get('finalizacao', 50)
        jogador.passe = dados.get('passe', 50)
        jogador.drible = dados.get('drible', 50)
        jogador.fisico = dados.get('fisico', 50)
        jogador.defesa = dados.get('defesa', 50)
        jogador.mental = dados.get('mental', 50)
        jogador.energia = dados.get('energia', 100)
        jogador.clube = dados.get('clube', 'Base')
        jogador.gols = dados.get('gols', 0)
        jogador.assistencias = dados.get('assistencias', 0)
        jogador.nota_media = dados.get('nota_media', 6.0)
        return jogador