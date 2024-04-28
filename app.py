from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from datetime import datetime
import webbrowser
import os
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

api_key = os.getenv("API_KEY")
genai.configure(api_key=api_key)

for m in genai.list_models():
    if "generateContent" in m.supported_generation_methods:
        print(m.name)

model = genai.GenerativeModel("gemini-pro")

chat = model.start_chat(history=[])
response = chat.send_message(
    """
    Falar como um assistente de IA avançado e abrangente. 
    Meu nome é Galileu. Estou aqui para ajudar com seus estudos
    e desenvolvimento profissional.
    """
)


# Variável para armazenar o nome do usuário
user_name = None
primeira_pergunta = None


@app.route("/")
def home():
    return render_template("chatbot.html")


@app.route("/start_conversation", methods=["POST"])
def start_conversation():
    # Obter a hora atual
    current_hour = datetime.now().hour
    # Determinar a saudação com base na hora atual
    if 6 <= current_hour < 12:
        greeting = "Bom dia"
    elif 12 <= current_hour < 18:
        greeting = "Boa tarde"
    else:
        greeting = "Boa noite"
    # Retorna a mensagem de saudação
    return {"response": f"{greeting} meu nome e Galileu. Qual é seu nome ?"}


@app.route("/message", methods=["POST"])
def message():
    message = request.get_json().get("message")
    response = chat.send_message(message)
    print("Galileu:", response.text, "\n")
    return {
        "response": response.text,
    }


# @app.route('/message', methods=['POST'])
# def message():
#     global user_name
#     global primeira_pergunta

#     message = request.get_json().get('message')
#     if user_name is None:
#         user_name = message
#         return {'response': 'Prazer em conhecer você, ' + user_name + '! achei muito lindo seu nome! gostaria de saber quem foi galileu?'}

#     if primeira_pergunta is None:
#         primeira_pergunta = message
#         if str(message).upper().strip() == 'SIM':
#             return {'response': f'Opa {user_name} vamos la entao: {GALILEU} enfim em que eu posso ajudar então?'}
#         else:
#             return {'response': f'Opa {user_name} sinto que você já sabe dessa informação que posso ajudar então?'}

#     return {'response': f'Entendi, validando aqui {user_name} eu nao tenho essa função ainda em meu sitema, sinto muito vamos tentar outra coisa?'}

if __name__ == "__main__":
    webbrowser.open("http://localhost:5000")
    app.run(debug=False)
